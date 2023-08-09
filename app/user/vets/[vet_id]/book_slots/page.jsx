"use client";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import slots from "@/utils/slots";
import {
  Avatar,
  Button,
  Card,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const FIND_SLOTS = gql`
  query FindSlotsThatAreNotBooked($date: DateTime!, $vetId: String!) {
    FindSlotsThatAreNotBooked(date: $date, vetId: $vetId) {
      ids
    }
  }
`;

const FIND_MY_PETS = gql`
  query GetAllPets {
    getAllPets {
      _id
      name
    }
  }
`;

const CREATE_APPOINTMENT = gql`
  mutation BookAppointment($input: BookAppointmentInput!) {
    bookAppointment(input: $input) {
      message
    }
  }
`;

const FETCH_VET = gql`
  query Query($getVetId: String!) {
    getVet(id: $getVetId) {
      avatar
      email
      name
      _id
    }
  }
`;

const TABLE_ROWS = (params) => [
  {
    name: "VET Name",
    job: params.name,
  },
  {
    name: "VET Id",
    job: params._id,
  },
  {
    name: "Email",
    job: params.email,
  },
];

function Page({ params }) {
  const curr = new Date();
  curr.setDate(curr.getDate() + 1);
  const today = curr.toISOString().substring(0, 10);

  const [date, setDate] = useState(today);
  const [slot, setSlot] = useState();

  const [type, setType] = useState("");
  const [petId, setPetId] = useState("");

  const { data, loading, error } = useQuery(FIND_SLOTS, {
    variables: {
      date: date,
      vetId: params.vet_id,
    },
  });

  const {
    data: pets,
    loading: petsLoading,
    error: petsError,
  } = useQuery(FIND_MY_PETS);

  const { loading: loadingVET, data: dataVET } = useQuery(FETCH_VET, {
    variables: {
      getVetId: params.vet_id,
    },
  });

  const [bookAppointment] = useMutation(CREATE_APPOINTMENT);

  if (loading || petsLoading || loadingVET) return <p>Loading...</p>;
  if (error || petsError) return <p>Error :(</p>;

  const handleSubmit = async () => {
    if (!date || slot === undefined || !type || !petId) {
      await MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all the fields!",
      });

      return;
    }

    const diffTime = new Date(date) - new Date(today);
    const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      await MySwal.fire({
        icon: "error",
        title: "Cannot book appointment",
        text: "you can't book an appointment in the past",
      });

      return;
    }
    if (diffDays > 2) {
      await MySwal.fire({
        icon: "error",
        title: "Cannot book appointment",
        text: "you can book an appointment at most 2 days ago",
      });

      return;
    }

    try {
      const { data } = await bookAppointment({
        variables: {
          input: {
            date: date,
            slot_id: slot,
            type: type,
            petId: petId,
            vetId: params.vet_id,
          },
        },
      });

      await MySwal.fire({
        icon: "success",
        title: "Success",
        text: data.bookAppointment.message,
      });
      window.location.reload();
    } catch (e) {
      await MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: e.message,
      });
    }
  };

  return (
    <div className={""}>
      <h1 className={"text-semi-blue font-semibold text-center mb-10"}>
        Book A VET
      </h1>

      <div
        className={
          "text-center flex flex-col lg:flex-row justify-around items-center gap-y-10 mb-20"
        }
      >
        <Avatar
          alt="avatar"
          src="/assets/user.png"
          className="border border-primary shadow-xl shadow-primary ring-4 ring-primary w-[200px] h-[200px] "
        />
        <Card className="w-[550px] h-full overflow-auto">
          <table className="w-full min-w-max table-auto text-left">
            <tbody>
              {TABLE_ROWS(dataVET.getVet).map(({ name, job }, index) => {
                const isLast = index === TABLE_ROWS.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={name}>
                    <td className={classes}>
                      <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="paragraph"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[600px] mx-auto"
        }
      >
        <input
          type="date"
          name="book date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
          }}
          className=" border border-gray-500 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        <Select variant="outlined" label="Select Slot">
          {data.FindSlotsThatAreNotBooked.ids.map((id, index) => (
            <Option
              key={index}
              value={id + ""}
              onClick={() => {
                setSlot(id);
              }}
            >
              {slots[id].starts_at + " - " + slots[id].ends_at}
            </Option>
          ))}
        </Select>
        <Select variant="outlined" label="Select Type">
          <Option
            onClick={(e) => {
              setType("ONLINE");
            }}
          >
            ONLINE
          </Option>

          <Option
            onClick={(e) => {
              setType("INPERSON");
            }}
          >
            INPERSON
          </Option>
        </Select>

        <Select variant="outlined" label="Select Your Pet">
          {pets.getAllPets.map((pet, index) => (
            <Option
              key={index}
              value={pet._id}
              onClick={(e) => {
                setPetId(pet._id);
              }}
            >
              {pet.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className={"text-center mt-10"}>
        <Button color={"orange"} onClick={handleSubmit}>
          Book
        </Button>
      </div>
    </div>
  );
}

export default Page;

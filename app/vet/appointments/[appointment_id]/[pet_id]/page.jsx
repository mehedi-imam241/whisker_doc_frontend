"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import slots from "@/utils/slots";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import Link from "next/link";
import { FaUserDoctor } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import VetPrescription from "@/components/VetPrescription";
import { MdTimelapse } from "react-icons/md";
import isInRange, { isInRangeByDate } from "@/utils/in_range";


import  dynamic from 'next/dynamic'
const PDFViewer = dynamic(()=>import('@/components/pdf'),{ssr:false})

const FETCH_APPOINMENT = gql`
  query GetAppointmentById($appointmentId: String!) {
    getAppointmentById(appointmentId: $appointmentId) {
      _id,
      owner {
        email
        name
      }

      vet {
        name
      }

      pet {
        age
        avatar
        breed
        gender
        name
        species
        weight
      }
      slot_id
      type
      date
      prescription {
        _id
        advice
        diseases
        medicines {
          dose
          duration
          name
        }
        symptoms
      }
    }
  }
`;

const FETCH_PREVIOUS_APPOINTMENTS = gql`
  query GetAllPreviousAppointmentsOfPet($petId: String!) {
    getAllPreviousAppointmentsOfPet(petId: $petId) {
      _id
      vet {
        name
      }
      date
    }
  }
`;

const TABLE_ROWS = (params) => [
  {
    name: "Pet Name",
    job: params.pet.name,
  },
  {
    name: "Owner Name",
    job: params.owner.name,
  },
  {
    name: "Owner Email",
    job: params.owner.email,
  },
  {
    name: "Species",
    job: params.pet.species,
  },
  {
    name: "Breed",
    job: params.pet.breed,
  },
  {
    name: "Gender",
    job: params.pet.gender,
  },
  {
    name: "Age",
    job: params.pet.age + " years",
  },
  {
    name: "Weight",
    job: params.pet.weight + " kg",
  },
  {
    name: "Appointment Type",
    job: params.type,
  },

  {
    name: "Appointment Date",
    job: params.date.substring(0, 10),
  },
  {
    name: "Appointment Slot",
    job:
      slots[params.slot_id].starts_at + " - " + slots[params.slot_id].ends_at,
  },
];

const CardAppointment = ({ appointment, petId }) => (
  <Card className="mt-6 w-96">
    <CardBody>
      <div className="flex ">
        {/* <FaClock size={25} className="mr-2 text-primary" /> */}
        {/* <Typography variant="h5" color="blue-gray" className="mb-2">
          {slots[appointment.slot_id].starts_at} -{" "}
          {slots[appointment.slot_id].ends_at}
        </Typography> */}
      </div>

      <div className="flex justify-between mt-5 mb-3">
        <div className="text-gray font-semibold flex items-center">
          <FaUserDoctor size={25} className="mr-2 text-primary" />
          {appointment.vet.name}
        </div>
        <div className="text-gray font-semibold flex items-center">
          <SlCalender size={25} className=" text-semi-blue mr-2" />
          {appointment.date.substring(0, 10)}
        </div>
      </div>
    </CardBody>
    <CardFooter className="pt-0">
      <Link href={`/vet/appointments/${appointment._id}/${petId}`}>
        <Button className="w-full" color="indigo">
          See More
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function Page({ params }) {
  const { loading, error, data } = useQuery(FETCH_APPOINMENT, {
    variables: {
      appointmentId: params.appointment_id,
    },
  });



  const {
    loading: loadingPrevious,
    error: errorPrevious,
    data: dataPrevious,
  } = useQuery(FETCH_PREVIOUS_APPOINTMENTS, {
    variables: {
      petId: params.pet_id,
    },
  });

  if (loading || loadingPrevious) return <p>Loading...</p>;

  return (
    <div className="mx-[5%]">
      <h1 className="text-semibold text-3xl text-semi-blue text-center mt-32 font-semibold">
        Appointment Details
      </h1>


      {
           isInRangeByDate([slots[data.getAppointmentById.slot_id].starts_at,slots[data.getAppointmentById.slot_id].ends_at],data.getAppointmentById.date) &&   <div className="flex justify-between text-red-500 my-10 w-[800px] mx-auto">
              <h2 className="font-semibold">
                Meeting currently running
              </h2>
              <MdTimelapse size={30} />
            </div>
      }


      <Card className="w-[820px] h-full overflow-auto mx-auto mt-10">



        <table className="w-full min-w-max table-auto text-left">
          <tbody>
            {data &&
              TABLE_ROWS(data.getAppointmentById).map(
                ({ name, job }, index) => {
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
                }
              )}
          </tbody>
        </table>
      </Card>

      <h2 className="text-3xl text-semi-blue mt-20 mb-10 text-center ">
        Previous appointments
      </h2>

      <div className="grid grid-flow-col auto-cols-max gap-x-4 mb-20">
        {dataPrevious.getAllPreviousAppointmentsOfPet.length > 0 ? (
          dataPrevious.getAllPreviousAppointmentsOfPet.map((appointment) => (
            <CardAppointment appointment={appointment} petId={params.pet_id} />
          ))
        ) : (
          <h5 className="text-red-500 text-center my-10 font-semibold text-xl">
            No appointments
          </h5>
        )}
      </div>

      {data && isInRangeByDate([slots[data.getAppointmentById.slot_id].starts_at,slots[data.getAppointmentById.slot_id].ends_at],data.getAppointmentById.date) && <VetPrescription appointment={data.getAppointmentById} petId={params.pet_id}/>}

      {/* {data &&   <VetPrescription appointment={data.getAppointmentById} petId={params.pet_id} />} */}

      {
        data.getAppointmentById.prescription && <PDFViewer prescription={data.getAppointmentById.prescription} appointment = {data.getAppointmentById}/>
      }

    </div>
  );
}

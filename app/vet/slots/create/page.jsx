"use client";
import React, { useEffect } from "react";
import { Button, Checkbox } from "@material-tailwind/react";
import { gql, useMutation } from "@apollo/client";
import slots from "@/utils/slots";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CREATE_SLOT = gql`
  mutation CreateSlots($input: CreateAllAppointmentSlotsInput!) {
    CreateSlots(input: $input) {
      message
    }
  }
`;

function Page(props) {
  const [checked, setChecked] = React.useState([]);

  const [createSlot, { data, loading, error }] = useMutation(CREATE_SLOT);

  const handleSubmit = async () => {
    setChecked((checked) => checked.sort((a, b) => a - b));

    if (checked.length === 0) {
      await MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select at least one slot",
      });
    }

    try {
      const { data } = await createSlot({
        variables: {
          input: {
            slots: checked.map((idx) => ({
              idx: idx,
            })),
          },
        },
      });
      await MySwal.fire({
        icon: "success",
        title: "Success",
        text: data.CreateSlots.message,
      });
    } catch (e) {
      await MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  return (
    <div className={"text-center"}>
      <h1 className={"text-semi-blue mb-10"}>Create Slot</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {slots.map((slot, index) => (
          <Checkbox
            key={index}
            id={index}
            label={slot.starts_at + " - " + slot.ends_at}
            ripple={true}
            checked={checked.includes(index)}
            onChange={(e) => {
              if (e.target.checked) {
                setChecked([...checked, index]);
              } else {
                setChecked(checked.filter((item) => item !== index));
              }
            }}
            color={"orange"}
          />
        ))}
      </div>

      <Button className={"mt-10"} color={"orange"} onClick={handleSubmit}>
        Confirm
      </Button>
    </div>
  );
}

export default Page;

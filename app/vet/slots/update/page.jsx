"use client";
import React, { useEffect } from "react";
import { Button, Checkbox } from "@material-tailwind/react";
import { gql, useMutation } from "@apollo/client";
import slots from "@/utils/slots";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CREATE_SLOT = gql`
  mutation UpdateAppointmentSlot($input: CreateAllAppointmentSlotsInput!) {
    updateAppointmentSlot(input: $input) {
      message
    }
  }
`;

function Page(props) {
  const [checked, setChecked] = React.useState([]);

  const [updateAppointmentSlot, { data, loading, error }] =
    useMutation(CREATE_SLOT);

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
      const { data } = await updateAppointmentSlot({
        variables: {
          input: {
            slots: checked.map((idx) => ({
              idx: idx,
            })),
          },
        },
      });

      console.log(data);
      await MySwal.fire({
        icon: "success",
        title: "Success",
        text: data.updateAppointmentSlot.message,
      });
    } catch (e) {
      await MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };
  const curr = new Date();
  curr.setDate(curr.getDate() + 3);
  const date = curr.toISOString().substring(0, 10);

  return (
    <div className={"text-center"}>
      <h1 className={"text-semi-blue mb-10"}>Update Slot</h1>

      <h3 className={"text-red-600 mb-10"}>
        Changes will be applied after two days from the current date i.e {date}{" "}
        (yyyy-mm-dd)
      </h3>

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

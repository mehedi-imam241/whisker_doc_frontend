"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Card,
  CardBody,
  Typography,
  CardFooter,
  Button,
} from "@material-tailwind/react";
import slots from "@/utils/slots";
import { FaCat, FaClock } from "react-icons/fa";
import { MdOutlineMan } from "react-icons/md";
import Link from "next/link";

const GetAppointments = gql`
  query GetAllAppointmentsOfVetToday($type: String!) {
    getAllAppointmentsOfVetToday(type: $type) {
      _id
      slot_id
      pet {
        name
      }
      owner {
        name
      }
      petId
      ownerId
    }
  }
`;

const CardAppointment = ({ appointment }) => (
  <Card className="mt-6 w-96">
    <CardBody>
      <div className="flex ">
        <FaClock size={25} className="mr-2 text-primary" />
        <Typography variant="h5" color="blue-gray" className="mb-2">
          {slots[appointment.slot_id].starts_at} -{" "}
          {slots[appointment.slot_id].ends_at}
        </Typography>
      </div>

      <div className="flex justify-between mt-5 mb-3">
        <div className="text-gray font-semibold flex items-center">
          <FaCat size={25} className="mr-2 text-semi-blue" />
          {appointment.pet.name}
        </div>
        <div className="text-gray font-semibold flex items-center">
          <MdOutlineMan size={30} className=" text-primary" />
          {appointment.owner.name}
        </div>
      </div>
    </CardBody>
    <CardFooter className="pt-0">
      <Link href={`/vet/appointments/${appointment._id}/${appointment.petId}`}>
        <Button className="w-full" color="indigo">
          See More
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function Page() {
  const {
    data: onlineData,
    loading: onlineLoading,
    error: onlineError,
  } = useQuery(GetAppointments, {
    variables: {
      type: "ONLINE",
    },
  });

  const {
    data: offlineData,
    loading: offlineLoading,
    error: offlineError,
  } = useQuery(GetAppointments, {
    variables: {
      type: "INPERSON",
    },
  });

  if (onlineLoading || offlineLoading) return <p>Loading...</p>;

  return (
    <div className="mx-[5%]">
      <h1 className="text-semibold text-3xl text-semi-blue text-center mt-32 font-semibold">
        Appointments
      </h1>

      <h2 className="text-2xl text-semi-blue my-10 font-semibold">
        Upcoming{" "}
        <span className="text-2xl text-primary my-10 font-semibold">
          online
        </span>{" "}
        appointments
      </h2>

      <div className="grid grid-flow-col auto-cols-max gap-x-4 mb-20">
        {onlineData.getAllAppointmentsOfVetToday.length > 0 ? (
          onlineData.getAllAppointmentsOfVetToday.map((appointment) => (
            <CardAppointment appointment={appointment} />
          ))
        ) : (
          <p className="text-red text-center my-10">No online appointments</p>
        )}
      </div>

      <h2 className="text-2xl text-semi-blue my-10 font-semibold">
        Upcoming{" "}
        <span className="text-2xl text-primary my-10 font-semibold">
          offline
        </span>{" "}
        appointments
      </h2>

      <div className="grid grid-flow-col auto-cols-max gap-x-4 mb-20">
        {offlineData.getAllAppointmentsOfVetToday.length > 0 ? (
          offlineData.getAllAppointmentsOfVetToday.map((appointment) => (
            <CardAppointment appointment={appointment} />
          ))
        ) : (
          <p className="text-red text-center my-10">No offline appointments</p>
        )}
      </div>
    </div>
  );
}

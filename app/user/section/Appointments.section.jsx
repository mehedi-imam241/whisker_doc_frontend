import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography
} from "@material-tailwind/react";
import Link from "next/link";
import slots from "@/utils/slots";
import { FaClock } from "react-icons/fa";
import {FaUserDoctor} from "react-icons/fa6"
import { isInRangeByDate } from "@/utils/in_range";
import { MdTimelapse,MdOutlineOnlinePrediction } from "react-icons/md";
import { FaCat } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

const FETCH_APPOINTMENTS = gql`
  query GetAppointmentSlotsOfMe {
    getAppointmentSlotsOfMe {
      _id
      date
      pet {
        _id
        name
      }
      slot_id
      type
      vet {
        name
      }
    }
  }
`;


const FETCH_PREVIOUS_APPOINTMENTS = gql`
query GetPreviousAppointmentSlotsOfMe {
  getPreviousAppointmentSlotsOfMe {
    _id
    date
    pet {
      _id
      name
    }
    slot_id
    type
    vet {
      name
    }
  }
}
`;


const CardAppointment = ({ appointment,index }) => (
  <Card className="mt-6 w-96" key={index} >
    <CardBody>

      <div className="flex justify-between">


      <div className="flex ">
        <FaClock size={25} className="mr-2 text-primary" />
        <Typography variant="h6" color="blue-gray" className="mb-2">
          {slots[appointment.slot_id].starts_at} -{" "}
          {slots[appointment.slot_id].ends_at}
        </Typography>
        {
          isInRangeByDate([slots[appointment.slot_id].starts_at,slots[appointment.slot_id].ends_at],appointment.date) && <MdTimelapse size={30} color="red"/>
        }
      </div>


<div className="text-gray font-semibold flex items-center">
          <SlCalender size={25} className="mr-2 text-semi-blue" />
          {appointment.date.substring(0,10)}
        </div>
      </div>

      <div className="flex justify-between mt-5 mb-3">
        <div className="text-gray font-semibold flex items-center">
          <FaCat size={25} className="mr-2 text-semi-blue" />
          {appointment.pet.name}
        </div>
        <div className="text-gray font-semibold flex items-center">
          <FaUserDoctor size={25} className=" text-primary mr-2" />
          {appointment.vet.name}
        </div>
      </div>
      <div className="flex text-gray font-semibold  items-center mt-7 ">
      <MdOutlineOnlinePrediction size={25} className=" text-primary mr-2" />
          {appointment.type}
      </div>
    </CardBody>
    <CardFooter className="pt-0">
      <Link href={`/user/appointments/${appointment._id}/${appointment.pet._id}`}>
        <Button className="w-full" color="indigo">
          See More
        </Button>
      </Link>
    </CardFooter>
  </Card>
);



function AppointmentsSection(props) {
  const { loading, error, data } = useQuery(FETCH_APPOINTMENTS);

  const {loading:loadingPrev,error:errorPrev,data:dataPrev} = useQuery(FETCH_PREVIOUS_APPOINTMENTS)

  if (loading||loadingPrev) return <p>Loading...</p>;

  return (
    <div className="mx-[5%]">
      <h2 className={"text-2xl font-bold text-semi-blue my-10 text-center "}>
        My Today and Future Appointments
      </h2>

      {data && data.getAppointmentSlotsOfMe.length === 0 ? (
        <h3 className={"text-center text-xl text-red-500"}>
          You didn't create any appointment
        </h3>
      ) : (
        <div
          className={
            " grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-center"
          }
        >
          {data &&
            data.getAppointmentSlotsOfMe.map((appointment, index) => (
              // <Card className="mt-6 w-96 mx-auto" key={index}>
              //   <CardBody>
              //     {appointment.date.substring(0, 10)} <br />
              //     Slot: {slots[appointment.slot_id].starts_at} -{" "}
              //     {slots[appointment.slot_id].ends_at} <br />
              //     VET: {appointment.vet.name} <br />
              //     PET: {appointment.pet.name} <br />
              //     TYPE: {appointment.type} <br />
              //   </CardBody>
              //   <CardFooter className="pt-0">
              //     <Link
              //       href={{
              //         pathname: `/user/appointments/${appointment._id}/${appointment.pet._id}`,
              //       }}
              //     >
              //       <Button fullWidth={true} className={"bg-semi-blue"}>
              //         See Details
              //       </Button>
              //     </Link>
              //   </CardFooter>
              // </Card>


              <CardAppointment appointment={appointment} index={index}/>

            ))}
        </div>
      )}


<h2 className={"text-2xl font-bold text-semi-blue my-10 text-center "}>
        My Previous Appointments
      </h2>

      {dataPrev && dataPrev.getPreviousAppointmentSlotsOfMe.length === 0 ? (
        <h3 className={"text-center text-xl text-red-500"}>
          You didn't create any appointment
        </h3>
      ) : (
        <div
          className={
            " grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-center"
          }
        >
          {dataPrev &&
            dataPrev.getPreviousAppointmentSlotsOfMe.map((appointment, index) => (
              <CardAppointment appointment={appointment} index={index}/>

            ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsSection;

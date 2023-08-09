import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@material-tailwind/react";
import Link from "next/link";
import slots from "@/utils/slots";

const FETCH_APPOINTMENTS = gql`
  query GetAppointmentSlotsOfMe {
    getAppointmentSlotsOfMe {
      _id
      date
      pet {
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

function AppointmentsSection(props) {
  const { loading, error, data } = useQuery(FETCH_APPOINTMENTS);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className={"text-2xl font-bold text-semi-blue my-10 text-center "}>
        My Upcoming Appointments
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
              <Card className="mt-6 w-96 mx-auto" key={index}>
                <CardBody>
                  {appointment.date.substring(0, 10)} <br />
                  Slot: {slots[appointment.slot_id].starts_at} -{" "}
                  {slots[appointment.slot_id].ends_at} <br />
                  VET: {appointment.vet.name} <br />
                  PET: {appointment.pet.name} <br />
                  TYPE: {appointment.type} <br />
                </CardBody>
                <CardFooter className="pt-0">
                  <Link
                    href={{
                      pathname: `/user/appointments/${appointment._id}`,
                    }}
                  >
                    <Button fullWidth={true} className={"bg-semi-blue"}>
                      See Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsSection;

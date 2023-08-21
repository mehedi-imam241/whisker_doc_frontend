"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Card, Typography } from "@material-tailwind/react";
import slots from "@/utils/slots";
import Link from "next/link";
import  dynamic from 'next/dynamic'

const PDFViewer = dynamic(()=>import('@/components/pdf'),{ssr:false})

const FETCH_APPOINTMENT = gql`
  query GetAppointmentDetails($apptId: String!) {
    getAppointmentDetails(apptId: $apptId) {
      date
      pet {
        name
        breed
        age
        weight
        species
      }
      slot_id
      type
      vet {
        email
        name
        _id
      }
      zoomLink
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

const TABLE_ROWS = (params) => [
  {
    name: "Pet Name",
    job: params.pet.name,
  },
  {
    name: "Date",
    job: params.date.substring(0, 10),
  },
  {
    name: "Slot",
    job:
      slots[params.slot_id].starts_at + " - " + slots[params.slot_id].ends_at,
  },
  {
    name: "Type",
    job: params.type,
  },
  {
    name: "Vet Name",
    job: params.vet.name,
  },
  {
    name: "Vet Email",
    job: params.vet.email,
  },

  {
    name: "Zoom Link",
    job: params.zoomLink ?? "No link provided",
  },
];

function Page({ params }) {
  const { loading, error, data } = useQuery(FETCH_APPOINTMENT, {
    variables: {
      apptId: params.appt_id,
    },
  });
  if (loading) return <p>Loading...</p>;


  console.log(data.getAppointmentDetails);

  return (
    <div className="mx-[5%]">
      {" "}
      {data && (
        <>
          <h2
            className={" text-2xl font-bold text-semi-blue mb-10 text-center"}
          >
            Appointment Details
          </h2>

          <div
            className={
              "text-center flex flex-col lg:flex-row justify-center items-center gap-y-10"
            }
          >
            {/*<img*/}
            {/*  // src={data.getPetById.avatar}*/}

            {/*  alt="pet-avatar"*/}
            {/*  className={"w-[200px]"}*/}
            {/*/>*/}
            <Card className="w-[550px] h-full overflow-auto">
              <table className="w-full min-w-max table-auto text-left">
                <tbody>
                  {TABLE_ROWS(data.getAppointmentDetails).map(
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
                    },
                  )}
                </tbody>
              </table>
            </Card>
          </div>

          <div className={"text-center mt-16 text-xl"}>
            <Link href={"/user/vets/" + data.getAppointmentDetails.vet._id} className="text-semi-blue hover:text-primary">
              View Vet Profile 
              {
                data.getAppointmentDetails.type==='INPERSON' &&             <> / See Vet Location</>
              }
            </Link>
          </div>

<div className="mt-16">



{
  data.getAppointmentDetails.prescription && <PDFViewer prescription={data.getAppointmentDetails.prescription} appointment={data.getAppointmentDetails}/>
}


</div>


          
        </>

          

        

      )}
    </div>
  );
}

export default Page;

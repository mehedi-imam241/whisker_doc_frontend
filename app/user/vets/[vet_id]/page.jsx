"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Card, Typography } from "@material-tailwind/react";
import ButtonCustom from "@/components/Button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { center } from "@/utils/location_center";
const Map = dynamic(
  () => import("@/components/map"), // replace '@components/map' with your component's location
  { ssr: false } // This line is important. It's what prevents server-side render
);

const FETCH_VET = gql`
  query Query($getVetId: String!) {
    getVet(id: $getVetId) {
      avatar
      email
      name
      role
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
    name: "Email",
    job: params.email,
  },
  {
    name: "BVG Registration Number",
    job: params.certificateId,
  },
  {
    name: "Degree",
    job: params.degree,
  },
];

// const TABLE_ROWS2 = (params) => [

// ];

const GET_VET_INFO = gql`
query GetVetInfo($vetId: String!) {
  getVetInfo(vetId: $vetId) {
    certificateId
    degree
    location {
      lat
      lng
    }
    zoomLink
  }
}
`;

const getVetInfo = (dataVetInfo) => {
  if (!dataVetInfo || !dataVetInfo.getVetInfo) {
    return {
      degree: "Not Provided",
      certificateId: "Not Provided",
      zoomLink: "Not Provided",
    };

  } else {
    return {
      degree: dataVetInfo.getVetInfo.degree,
      certificateId: dataVetInfo.getVetInfo.certificateId,
      zoomLink: dataVetInfo.getVetInfo.zoomLink,
    };
  }
};


export default function Page({ params }) {


  const { loading, error, data } = useQuery(FETCH_VET, {
    variables: {
      getVetId: params.vet_id,
    },
  });

  const {
    data: dataVetInfo,
    loading: loadingVerify,
    error: errorVerify,
  } = useQuery(GET_VET_INFO, {
    variables: {
      vetId: params.vet_id,
    },
  });

  if (loadingVerify || loading) return <div>Loading...</div>;

  return (
    <div className={"text-center mb-20"}>
      {/* {loading && <p>Loading...</p>} */}

      {data && (
        <>
          <h2 className={" text-2xl font-bold text-semi-blue mb-10"}>
            Vet Profile
          </h2>

          <div
            className={
              "text-center flex flex-col lg:flex-row justify-around items-center gap-y-10"
            }
          >
            <Avatar
              alt="avatar"
              src="/assets/user.png"
              className="border border-primary shadow-xl shadow-primary ring-4 ring-primary w-[300px] h-[300px] "
            />
            <div className={"flex flex-col justify-center items-center"}>
              <Card className="w-[550px] h-full overflow-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <tbody>
                    {TABLE_ROWS({...data['getVet'],                    ...(getVetInfo(dataVetInfo)),}).map(({ name, job }, index) => {
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






          </div>

          <h1 className={"text-2xl font-bold text-semi-blue my-16 text-center"}>
            Vet Location
          </h1>
          <div className="mx-[10%]">
            {
              dataVetInfo && dataVetInfo.getVetInfo? <Map userLocation={dataVetInfo.getVetInfo.location} update={false} /> : <p className="text-2xl text-red-500 -mt-10" >Not Provided</p>
            }
            
          </div>

          <Link
            href={"/user/vets/[vet_id]/book_slots"}
            as={`/user/vets/${params.vet_id}/book_slots`}
          >
            <ButtonCustom className={"mt-16"}>Request Appointment</ButtonCustom>
          </Link>
        </>
      )}
    </div>
  );
}

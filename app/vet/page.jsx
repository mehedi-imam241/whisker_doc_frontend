"use client";
import React, { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  Input,
  Typography,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import ButtonCustom from "@/components/Button";
import Link from "next/link";
import dynamic from "next/dynamic";
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
      _id
    }
  }
`;

const IS_SLOT_CREATED = gql`
  query IsSlotCreated {
    IsSlotCreated {
      message
    }
  }
`;

const FETCH_VET_INFO = gql`
  query GetMyInfo {
    getMyInfo {
      _id
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
  {
    name: "Degree",
    job: params.degree,
  },
  {
    name: "BVC Registration Number",
    job: params.certificateId,
  },
  {
    name: "Zoom Link",
    job: params.zoomLink,
  },
];

export default function Page() {
  const USER = JSON.parse(Cookies.get("user"));

  const { loading, error, data } = useQuery(FETCH_VET, {
    variables: {
      getVetId: USER._id,
    },
  });

  const { data: isSlotCreated, loading: loadingSlot } =
    useQuery(IS_SLOT_CREATED);

  const { data: dataVetInfo, loading: loadingVetInfo } =
    useQuery(FETCH_VET_INFO);

  if (loadingSlot || loading || loadingVetInfo) return <p>Loading...</p>;

  return (
    <div className={"text-center "}>
      {data && (
        <>
          <h1 className={" text-3xl font-bold text-semi-blue mb-10"}>
            My Profile
          </h1>

          <div
            className={
              "text-center flex flex-col xl:flex-row justify-around items-center gap-y-20"
            }
          >
            <Avatar
              alt="avatar"
              src="/assets/user.png"
              className="border border-primary shadow-xl shadow-primary ring-4 ring-primary w-[300px] h-[300px] "
            />

            <Card className="w-[700px] h-full overflow-auto">
              <table className="w-full min-w-max table-auto text-left">
                <tbody>
                  {TABLE_ROWS({
                    ...data["getVet"],
                    ...dataVetInfo["getMyInfo"],
                  }).map(({ name, job }, index) => {
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
                  {/*<tr key={9}>*/}
                  {/*  <td>*/}
                  {/*    <Typography*/}
                  {/*      variant="paragraph"*/}
                  {/*      color="blue-gray"*/}
                  {/*      className="font-semibold"*/}
                  {/*    >*/}
                  {/*      Zoom Link*/}
                  {/*    </Typography>*/}
                  {/*  </td>*/}
                  {/*  <td>*/}
                  {/*    <Typography*/}
                  {/*      variant="paragraph"*/}
                  {/*      color="blue-gray"*/}
                  {/*      className="font-normal"*/}
                  {/*    >*/}
                  {/*      {zoomLink.getZoomLink ?? "Not Provided"}*/}
                  {/*    </Typography>*/}
                  {/*  </td>*/}
                  {/*</tr>*/}
                </tbody>
              </table>
            </Card>
          </div>

          <h1 className={"text-2xl font-bold text-semi-blue my-16"}>
            My Location
          </h1>
          <div className="mx-[10%]">
            <Map userLocation={dataVetInfo.getMyInfo.location} update={false} />
          </div>
        </>
      )}

      {isSlotCreated.IsSlotCreated.message === "0" ? (
        <Link href={"/vet/slots/create"}>
          <ButtonCustom className={"my-20"}>Provide Slots</ButtonCustom>
        </Link>
      ) : (
        <Link href={"/vet/slots/update"}>
          <ButtonCustom className={"my-20"}>Update Slots</ButtonCustom>
        </Link>
      )}
    </div>
  );
}

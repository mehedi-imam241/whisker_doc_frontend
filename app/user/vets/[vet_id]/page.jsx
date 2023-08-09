"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Card, Typography } from "@material-tailwind/react";
import ButtonCustom from "@/components/Button";
import Link from "next/link";

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
];

const TABLE_ROWS2 = (params) => [
  {
    name: "BVG Registration Number",
    job: params.certificateId,
  },
  {
    name: "Degree",
    job: params.degree,
  },
];

const GET_VERIFY_ID = gql`
  query Query($vetId: String!) {
    getVetVerificationInfo(vetId: $vetId) {
      degree
      certificateId
    }
  }
`;

export default function Page({ params }) {
  const { loading, error, data } = useQuery(FETCH_VET, {
    variables: {
      getVetId: params.vet_id,
    },
  });

  const {
    data: dataVerify,
    loading: loadingVerify,
    error: errorVerify,
  } = useQuery(GET_VERIFY_ID, {
    variables: {
      vetId: params.vet_id,
    },
  });

  if (loadingVerify) return <div>Loading...</div>;

  return (
    <div className={"text-center"}>
      {loading && <p>Loading...</p>}

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
                    {TABLE_ROWS(data.getVet).map(({ name, job }, index) => {
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

              <Card className="w-[550px] h-full overflow-auto mt-10">
                <table className="w-full min-w-max table-auto text-left">
                  <tbody>
                    {dataVerify &&
                      TABLE_ROWS2(dataVerify.getVetVerificationInfo).map(
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

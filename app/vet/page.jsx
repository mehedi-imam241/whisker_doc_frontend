"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Card, Typography } from "@material-tailwind/react";
import Cookies from "js-cookie";
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

const IS_SLOT_CREATED = gql`
  query IsSlotCreated {
    IsSlotCreated {
      message
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

  if (loadingSlot || loading) return <p>Loading...</p>;

  return (
    <div className={"text-center "}>
      {data && (
        <>
          <h2 className={" text-2xl font-bold text-semi-blue mb-10"}>
            My Profile
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
          </div>
        </>
      )}

      {isSlotCreated.IsSlotCreated.message === "0" ? (
        <Link href={"/vet/slots/create"}>
          <ButtonCustom className={"mt-10"}>Provide Slots</ButtonCustom>
        </Link>
      ) : (
        <Link href={"/vet/slots/update"}>
          <ButtonCustom className={"mt-10"}>Update Slots</ButtonCustom>
        </Link>
      )}
    </div>
  );
}
"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { MdPets } from "react-icons/md";
import Link from "next/link";
import { Pagination } from "@mui/material";
import ButtonCustom from "@/components/Button";
import MyAvatar from "@/components/Avatar";

const GET_UNVERIFIED_SYMPTOMS = gql`
  query GetUnverfiedSymptoms($limit: Float!, $skip: Float!) {
    getUnverfiedSymptoms(limit: $limit, skip: $skip) {
      _id
      article
      species
      tags
      title
      vetId
      vet {
        avatar
        name
        email
        _id
      }
    }
  }
`;

const PAGE_COUNT = gql`
  query CountPage {
    countPages
  }
`;

function Page(props) {
  const [skip, setSkip] = React.useState(0);

  const { loading, error, data } = useQuery(GET_UNVERIFIED_SYMPTOMS, {
    variables: { limit: 100, skip: skip },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className={"mx-[10%]"}>
      <div className="flex mx-2 justify-between  pt-5 items-center">
        <h1 className="text-semi-blue font-semibold">Unverified Symptoms</h1>

        <Link
          href={"/vet/symptoms/create"}
          className={"flex justify-center items-center"}
        >
          <ButtonCustom className={""}>Create symptoms</ButtonCustom>
        </Link>
      </div>

      {data && data.getUnverfiedSymptoms.length === 0 && (
        <h3 className="mx-2 text-red-300 mt-5">
          No symptoms found to be verified
        </h3>
      )}
      {data &&
        data.getUnverfiedSymptoms.map((symptoms, index) => {
          return (
            <Card key={index} className="mt-6">
              <CardBody>
                <div className={"flex justify-between"}>
                  <div>
                    <div className="flex gap-3 items-center mb-5">
                      <MdPets className="text-3xl text-semi-blue" />
                      <Typography variant="h5">{symptoms.species}</Typography>
                    </div>
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                      {symptoms.title}
                    </Typography>
                  </div>

                  <div className={"flex flex-col items-center mr-4"}>
                    <MyAvatar src={symptoms.vet.avatar} size="50px" />
                    <Typography className="mt-2">
                      {symptoms.vet.name} | Vet
                    </Typography>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="pt-0 flex items-center justify-between">
                <Link
                  href={`/vet/symptoms/${symptoms._id}`}
                  className="inline-block"
                >
                  <Button
                    size="md"
                    variant="contained"
                    color={"orange"}
                    className="flex items-center gap-2  rounded-full"
                  >
                    Read symptoms
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </Button>
                </Link>
                <div className="flex">
                  {symptoms.tags.map((tag, index) => {
                    return (
                      <div
                        key={index}
                        className="rounded-full bg-blue-300 text-white px-3 py-1 font-semibold mr-2"
                      >
                        {tag}
                      </div>
                    );
                  })}
                </div>
              </CardFooter>
            </Card>
          );
        })}
    </div>
  );
}

export default Page;

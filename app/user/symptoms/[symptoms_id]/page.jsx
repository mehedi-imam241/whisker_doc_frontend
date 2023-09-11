"use client";
import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import MyAvatar from "@/components/Avatar";
import { MdPets } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Link from "next/link";

const MySwal = withReactContent(Swal);

const GET_SYMPTOMS = gql`
  query GetSymptomsById($getSymptomsByIdSymptomsId2: Float!) {
    getSymptomsById(symptomsId: $getSymptomsByIdSymptomsId2) {
      article
      species
      tags
      title
      vet {
        avatar
        name
      }
      verifiedBy {
        avatar
        name
      }
    }
  }
`;

function Page(props) {
  const { loading, error, data } = useQuery(GET_SYMPTOMS, {
    variables: { getSymptomsByIdSymptomsId2: Number(props.params.symptoms_id) },
  });

  if (loading) return <p>Loading...</p>;

  if (error) console.log(error);

  return (
    <div className={"mx-[5%]"}>
      <h1 className={"text-3xl text-center text-semi-blue mb-10 font-semibold"}>
        {data.getSymptomsById.title}
      </h1>
      <Card className="flex justify-between mb-10">
        <CardBody className="flex justify-between">
          <div>
            <div className="flex gap-3 items-center mb-5">
              <div className="flex gap-10">
                <div className={"flex gap-2 items-center"}>
                  <MyAvatar src={data.getSymptomsById.vet.avatar} size="40px" />
                  <h5 className={"text-gray-500 flex flex-col"}>
                    Written by{" "}
                    <span className="text-semi-blue font-semibold text-lg -mt-1">
                      {" "}
                      {data.getSymptomsById.vet.name}
                    </span>{" "}
                  </h5>
                </div>

                <div className="flex gap-2 items-center">
                  <MyAvatar
                    src={data.getSymptomsById.verifiedBy.avatar}
                    size="40px"
                  />
                  <h5 className={"text-gray-500 flex flex-col"}>
                    Verified by{" "}
                    <span className="text-primary font-semibold text-lg -mt-1">
                      {data.getSymptomsById.verifiedBy.name}
                    </span>{" "}
                  </h5>
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-center mb-5">
              <MdPets className="text-xl text-semi-blue" />
              <Typography variant="h5">
                {data.getSymptomsById.species}
              </Typography>
            </div>

            <div className="flex ">
              {data.getSymptomsById.tags.map((tag, index) => {
                return (
                  <div
                    key={index}
                    className="rounded-full bg-blue-300 text-white py-1 font-semibold mr-2 h-10 px-5 flex items-center justify-center"
                  >
                    {tag}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-blue-400 rounded-lg flex flex-col items-center justify-center  px-10 pt-4">
            <h5 className="font-bold  text-white">
            Still Concerned?
            </h5>

            <Link href={"/user/vets"}>
              <Button color="orange" className="my-5 rounded-full">
                Book A vet
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>

              
      <div dangerouslySetInnerHTML={{ __html: data.getSymptomsById.article }} />
    </div>
  );
}

export default Page;

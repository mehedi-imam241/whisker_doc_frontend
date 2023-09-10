"use client";
import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Avatar, Button, Typography } from "@material-tailwind/react";
import MyAvatar from "@/components/Avatar";
import { MdPets } from "react-icons/md";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
    }
  }
`;

const VERIFY_SYMPTOMS = gql`
  mutation Mutation($symptomsId: Float!) {
    verifySymptoms(symptomsId: $symptomsId) {
      message
      success
    }
  }
`;

function Page(props) {
  const { loading, error, data } = useQuery(GET_SYMPTOMS, {
    variables: { getSymptomsByIdSymptomsId2: Number(props.params.symptoms_id) },
  });

  const [verifySymptoms] = useMutation(VERIFY_SYMPTOMS);

  if (loading) return <p>Loading...</p>;

  console.log(data);
  return (
    <div className={"mx-[5%]"}>
      <h1 className={"text-3xl text-center text-semi-blue mb-10 font-semibold"}>
        {data.getSymptomsById.title}
      </h1>
      <div className="flex justify-between">
        <div>
          <div className="flex gap-3 items-center mb-5">
            <MdPets className="text-3xl text-semi-blue" />
            <Typography variant="h5">{data.getSymptomsById.species}</Typography>
          </div>

          <div className="flex">
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
        <div className={"flex flex-col items-center mb-10"}>
          <MyAvatar src={data.getSymptomsById.vet.avatar} size="50px" />
          <Typography className="mt-2">
            {data.getSymptomsById.vet.name} | Vet
          </Typography>
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: data.getSymptomsById.article }} />

      <Button
        color="orange"
        className="my-10 rounded-full"
        onClick={async () => {
          try {
            const { data } = await verifySymptoms({
              variables: { symptomsId: Number(props.params.symptoms_id) },
            });

            if (data.verifySymptoms.success) {
              await MySwal.fire({
                title: "Success",
                text: data.verifySymptoms.message,
                icon: "success",
                confirmButtonText: "Ok",
              });
              window.location.href = "/vet/symptoms";
            } else {
              await MySwal.fire({
                title: "Error",
                text: data.verifySymptoms.message,
                icon: "error",
                confirmButtonText: "Ok",
              });
            }
          } catch (err) {
            MySwal.fire({
              title: "Error",
              text: err.message,
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        }}
      >
        Approve
      </Button>
    </div>
  );
}

export default Page;

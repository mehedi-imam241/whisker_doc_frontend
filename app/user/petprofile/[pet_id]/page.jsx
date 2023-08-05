"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Card, Typography } from "@material-tailwind/react";

const FETCH_PET = gql`
  query GetPetById($_id: String!) {
    getPetById(id: $_id) {
      _id
      age
      avatar
      breed
      gender
      name
      species
      weight
    }
  }
`;

const TABLE_ROWS = (params) => [
  {
    name: "Pet Name",
    job: params.name,
  },
  {
    name: "Pet Id",
    job: params._id,
  },
  {
    name: "Species",
    job: params.species,
  },
  {
    name: "Breed",
    job: params.breed,
  },
  {
    name: "Gender",
    job: params.gender,
  },
  {
    name: "Age",
    job: params.age + " years",
  },
  {
    name: "Weight",
    job: params.weight + " kg",
  },
];

export default function Page({ params }) {
  const { loading, error, data } = useQuery(FETCH_PET, {
    variables: {
      _id: params.pet_id,
    },
  });
  return (
    <div className={"text-center"}>
      {loading && <p>Loading...</p>}

      {data && (
        <>
          <h2 className={" text-2xl font-bold text-semi-blue mb-10"}>
            Pet Profile
          </h2>

          <div
            className={
              "text-center flex flex-col lg:flex-row justify-around items-center gap-y-10"
            }
          >
            <Avatar
              alt="avatar"
              src="/assets/pet.svg"
              className="border border-primary shadow-xl shadow-primary ring-4 ring-primary w-[300px] h-[300px] "
            />
            {/*<img*/}
            {/*  // src={data.getPetById.avatar}*/}

            {/*  alt="pet-avatar"*/}
            {/*  className={"w-[200px]"}*/}
            {/*/>*/}
            <Card className="w-[550px] h-full overflow-auto">
              <table className="w-full min-w-max table-auto text-left">
                <tbody>
                  {TABLE_ROWS(data.getPetById).map(({ name, job }, index) => {
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
    </div>
  );
}

import React from "react";
import { gql, useQuery } from "@apollo/client";
import ButtonCustom from "@/components/Button";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@material-tailwind/react";

const FETCH_PETS = gql`
  query GetAllPets {
    getAllPets {
      _id
      avatar
      name
    }
  }
`;

function PetSection(props) {
  const { loading, error, data } = useQuery(FETCH_PETS);

  return (
    <div className={"text-center"}>
      <h2 className={"text-2xl font-bold text-semi-blue mb-10"}>My Pets</h2>
      {loading && <p>Loading...</p>}

      {data && data.getAllPets.length === 0 ? (
        <h3 className={"text-center text-xl text-red-500"}>
          You didn't create any pet profile
        </h3>
      ) : (
        <div
          className={
            " grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-center"
          }
        >
          {data &&
            data.getAllPets.map((pet, index) => (
              <Card className="mt-6 w-96 mx-auto" key={index}>
                <CardHeader color="white" className="relative h-56 ">
                  <img
                    src="/assets/pet.svg"
                    alt="card-image"
                    className={"h-5/6 mx-auto"}
                  />
                </CardHeader>
                <CardBody>{pet.name}</CardBody>
                <CardFooter className="pt-0">
                  <Link
                    href={{
                      pathname: `/user/petprofile/${pet._id}`,
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

      <Link href={"/user/petprofile/create"}>
        <ButtonCustom className={"text-lg mt-10"}>
          Create Pet Profile
        </ButtonCustom>
      </Link>
    </div>
  );
}

export default PetSection;

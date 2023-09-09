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
  IconButton,
} from "@material-tailwind/react";
import MyAvatar from "@/components/Avatar";
import { BsFillPlusCircleFill } from "react-icons/bs";

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

  if (loading) return <p>Loading...</p>;

  return (
    <div className={"text-center"}>
      <div className={"flex justify-center mb-10"}>
        <h2 className={"text-2xl font-bold text-semi-blue col-span-2 mr-4"}>
          My Pets
        </h2>
        <Link href={"/user/petprofile/create"} className="">
          <IconButton className="rounded-full" color="indigo">
            <BsFillPlusCircleFill size={25} />
          </IconButton>
        </Link>
      </div>
      {data && data.getAllPets.length === 0 ? (
        <>
          <h3 className={"text-center text-xl text-red-500"}>
            You didn't create any pet profile
          </h3>
        </>
      ) : (
        <div
          className={
            " grid gap-4 grid-cols-[repeat(auto-fit,_25%)] justify-center mb-20"
          }
        >
          {data &&
            data.getAllPets.map((pet, index) => (
              <Card className="mt-6 w-80 mx-auto" key={index}>
                <CardHeader
                  color="white"
                  className="relative h-60 pt-2"
                  shadow={false}
                  floated={false}
                >
                  <MyAvatar pet={true} src={pet.avatar} size="222px" />
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
    </div>
  );
}

export default PetSection;

"use client";
import React, { useEffect, useState } from "react";
import { center } from "@/utils/location_center";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
  Menu,
  MenuItem,
  MenuHandler,
  MenuList,
} from "@material-tailwind/react";
import { Pagination } from "@mui/material";
import Link from "next/link";
import dynamic from "next/dynamic";
import { RiPinDistanceFill } from "react-icons/ri";
import { BsFillClockFill } from "react-icons/bs";

const GET_VETS = gql`
  query GetAllVetsByLocation(
    $location: LocationInput!
    $limit: Float!
    $skip: Float!
    $sortBy: SortByInput!
  ) {
    getAllVetsByLocation(
      location: $location
      limit: $limit
      skip: $skip
      sort_by: $sortBy
    ) {
      vet {
        name
        email
      }
      location {
        lat
        lng
      }
      distance
      duration
      vetId
    }
  }
`;

// const PAGE_COUNT = gql`
//   query Query {
//     getVetsCount
//   }
// `;

const Map = dynamic(
  () => import("@/components/map"), // replace '@components/map' with your component's location
  { ssr: false } // This line is important. It's what prevents server-side render
);

function PageUtils(props) {
  const [userLocation, setUserLocation] = useState(center);
  const [sortBy, setSortBy] = useState("DURATION");

  // const [skip, setSkip] = React.useState(0);
  // const { data: dataPageCount, loading: loadingPageCount } =
  //   useQuery(PAGE_COUNT);
  const [getAllVetsByLocation, { data, loading, error }] =
    useLazyQuery(GET_VETS);

  return (
    <div className="mb-20">
      <h1 className={"text-semi-blue font-semibold text-center"}>
        Choose Nearby Vet
      </h1>

      <div className="mx-[10%]">
        <Map
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          icon="user"
          allVets={data?.getAllVetsByLocation}
        />
      </div>

      <div className="text-center">
        <Menu>
          <MenuHandler className="my-20 ">
            <Button color="indigo" variant="outlined" className="rounded-full ">
              {sortBy === "DURATION" ? "Sort By Duration" : "Sort By Distance"}
            </Button>
          </MenuHandler>
          <MenuList>
            <MenuItem
              onClick={() => {
                setSortBy("DURATION");

                return getAllVetsByLocation({
                  variables: {
                    location: userLocation,
                    limit: 10,
                    skip: 0,
                    sortBy: {
                      sortBy: "DURATION",
                    },
                  },
                });
              }}
            >
              Sort By Duration
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortBy("DISTANCE");

                return getAllVetsByLocation({
                  variables: {
                    location: userLocation,
                    limit: 10,
                    skip: 0,
                    sortBy: {
                      sortBy: "DISTANCE",
                    },
                  },
                });
              }}
            >
              Sort By Distance
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

      {loading && <div>Loading...</div>}

      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mt-20">
          {data.getAllVetsByLocation.map((vetInfo, index) => (
            <Card className="w-[290px]" key={index}>
              <CardHeader
                shadow={false}
                floated={false}
                className="h-64 flex items-center justify-center"
              >
                <Avatar
                  src="/assets/user.png"
                  alt="avatar"
                  withBorder={true}
                  className="p-0.5 w-60  h-60"
                />
              </CardHeader>
              <CardBody>
                <div className="mb-2 flex items-center justify-between">
                  <Typography color="blue-gray" className="font-medium">
                    {vetInfo.vet.name}
                  </Typography>
                </div>

                <a
                  href={"mailto:" + vetInfo.vet.email}
                  className="text-blue-gray-500"
                >
                  {vetInfo.vet.email}
                </a>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-x-2 justify-start items-center">
                    <RiPinDistanceFill size={20} className="text-semi-blue" />
                    <Typography color="blue-gray" className="font-medium">
                      {Math.round(vetInfo.distance / 100) / 10 + " km"}
                    </Typography>
                  </div>

                  <div className="flex gap-x-2 justify-end items-center">
                    <BsFillClockFill size={20} className="text-primary" />
                    <Typography color="blue-gray" className="font-medium">
                      {Math.round(vetInfo.duration / 6) / 10 + " min"}
                    </Typography>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="pt-0">
                <Link href={"/user/vets/" + vetInfo.vetId}>
                  <Button
                    ripple={false}
                    fullWidth={true}
                    color="orange"
                    className=" shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
                  >
                    See Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* <div className={"my-10"}>
        <Pagination
          count={dataPageCount.getVetsCount}
          color="primary"
          onChange={(e) => {
            setSkip(e.target.innerText * 10 - 10);
          }}
        />
      </div> */}
    </div>
  );
}

export default PageUtils;

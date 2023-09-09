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
import { Pagination, Rating } from "@mui/material";
import Link from "next/link";
import dynamic from "next/dynamic";
import { RiPinDistanceFill } from "react-icons/ri";
import { BsFillClockFill, BsFillPeopleFill } from "react-icons/bs";
import { MdModeComment, MdPeople } from "react-icons/md";
import StarRatings from "react-star-ratings";

const GET_VETS = gql`
  query GetAllVetsByLocation(
    $limit: Float!
    $skip: Float!
    $sortBy: SortByInput!
  ) {
    getAllVetsByLocation(limit: $limit, skip: $skip, sort_by: $sortBy) {
      apptCount
      vet {
        name
        email
        avatar
        _id
      }
      distance
      duration
      ratingCount
      sumRating
      location {
        lat
        lng
      }
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
  const [sortBy, setSortBy] = useState("RATINGS");

  // const [skip, setSkip] = React.useState(0);
  // const { data: dataPageCount, loading: loadingPageCount } =
  //   useQuery(PAGE_COUNT);
  const [getAllVetsByLocation, { data, loading, error }] = useLazyQuery(
    GET_VETS,
    {
      fetchPolicy: "network-only",
    }
  );

  console.log(data);

  useEffect(() => {
    getAllVetsByLocation({
      variables: {
        limit: 10,
        skip: 0,
        sortBy: {
          sortBy: "RATINGS",
        },
      },
    });
  }, []);

  return (
    <div className="mb-20">
      <h1 className={"text-semi-blue font-semibold text-center"}>
        Choose Nearby Vet
      </h1>

      <div className="text-center">
        <Menu>
          <MenuHandler className="my-20 ">
            <div>
              <Button color="orange" className="rounded-full">
                {sortBy === "DURATION"
                  ? "Sort By Duration"
                  : sortBy === "DISTANCE"
                  ? "Sort By Distance"
                  : sortBy === "EXPERIENCE"
                  ? "Sort By Experience"
                  : sortBy === "LASTNAME"
                  ? "Sort By Last Name"
                  : "Sort By Ratings"}
              </Button>
            </div>
          </MenuHandler>
          <MenuList>
            <MenuItem
              onClick={() => {
                setSortBy("LASTNAME");
                return getAllVetsByLocation({
                  variables: {
                    limit: 10,
                    skip: 0,
                    sortBy: {
                      sortBy: "LASTNAME",
                    },
                  },
                });
              }}
            >
              Sort By Last Name
            </MenuItem>

            <MenuItem
              onClick={() => {
                setSortBy("DURATION");
              }}
            >
              Sort By Duration
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortBy("DISTANCE");
              }}
            >
              Sort By Distance
            </MenuItem>

            <MenuItem
              onClick={() => {
                setSortBy("Ratings");

                return getAllVetsByLocation({
                  variables: {
                    limit: 10,
                    skip: 0,
                    sortBy: {
                      sortBy: "RATINGS",
                    },
                  },
                });
              }}
            >
              Sort By Ratings
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSortBy("EXPERIENCE");

                return getAllVetsByLocation({
                  variables: {
                    limit: 10,
                    skip: 0,
                    sortBy: {
                      sortBy: "EXPERIENCE",
                    },
                  },
                });
              }}
            >
              Sort By Experience
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

      {(sortBy === "DURATION" || sortBy === "DISTANCE") && (
        <div className="mx-[10%]">
          <Map
            userLocation={userLocation}
            setUserLocation={setUserLocation}
            icon="user"
            allVets={data?.getAllVetsByLocation}
            query={getAllVetsByLocation}
            sortBy={sortBy}
          />
        </div>
      )}

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

                {vetInfo.distance && (
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
                )}
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex gap-x-2 justify-start items-center">
                    {/* <Rating
                      name="half-rating-read"
                      defaultValue={4.2}
                      precision={0.2}
                      readOnly
                    /> */}
                    <StarRatings
                      rating={
                        vetInfo.ratingCount === 0
                          ? 0
                          : Math.round(vetInfo.sumRating / vetInfo.ratingCount)
                      }
                      starRatedColor="#FF8A00"
                      // changeRating={this.changeRating}
                      numberOfStars={5}
                      name="rating"
                      starDimension="23px"
                      starSpacing="1px"
                    />
                  </div>

                  <div className="flex gap-x-2 justify-start items-center">
                    <MdModeComment size={20} className="text-primary" />
                    <Typography color="blue-gray" className="font-medium">
                      {Math.round(vetInfo.ratingCount)}
                    </Typography>
                  </div>
                  <div className="flex gap-x-2 justify-end items-center">
                    <MdPeople size={25} className="text-semi-blue" />
                    <Typography color="blue-gray" className="font-medium">
                      {vetInfo.apptCount}
                    </Typography>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="pt-0">
                <Link href={"/user/vets/" + vetInfo.vet._id}>
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

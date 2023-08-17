"use client";
import React, { useEffect, useState } from "react";
import { center } from "@/utils/location_center";
import { gql, useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { Pagination } from "@mui/material";
import Link from "next/link";
import MyMap from "@/components/map";

// import dynamic from "next/dynamic";
// import MapComponent from "@/components/map.component";

// const GET_VETS = gql`
//   query GetVets($limit: Float!, $skip: Float!) {
//     getVets(limit: $limit, skip: $skip) {
//       _id
//       avatar
//       email
//       name
//     }
//   }
// `;

// const PAGE_COUNT = gql`
//   query Query {
//     getVetsCount
//   }
// `;

// const Map = dynamic(
//   () => import("@/components/map"), // replace '@components/map' with your component's location
//   { ssr: false } // This line is important. It's what prevents server-side render
// );

function PageUtils(props) {
  const [userLocation, setUserLocation] = useState(center);
  //   const [mounted, setMounted] = useState(false);

  //   useEffect(() => {
  //     setMounted(true);
  //   }, []);

  // const [skip, setSkip] = React.useState(0);
  // const { data: dataPageCount, loading: loadingPageCount } =
  //   useQuery(PAGE_COUNT);
  // const { data, loading, error } = useQuery(GET_VETS, {
  //   variables: {
  //     limit: 10,
  //     skip: skip,
  //   },
  // });

  // if (loading || loadingPageCount) return <div>Loading...</div>;

  return (
    <div>
      <h1 className={"text-semi-blue font-semibold text-center"}>
        Choose Nearby Vet
      </h1>
      {/* {mounted && (
        <Map userLocation={userLocation} setUserLocation={setUserLocation} />
      )} */}

      <MyMap userLocation={userLocation} setUserLocation={setUserLocation} />

      {/* <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
        {dataPageCount &&
          data &&
          data.getVets.map((vet, index) => ( 
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
                    {vet.name}
                  </Typography>
                </div>

                <a href={"mailto:" + vet.email} className="text-blue-gray-500">
                  {vet.email}
                </a>
              </CardBody>
              <CardFooter className="pt-0">
                <Link href={"/user/vets/" + vet._id}>
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

      <div className={"my-10"}>
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

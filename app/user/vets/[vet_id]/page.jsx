"use client";
import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Card, Typography } from "@material-tailwind/react";
import ButtonCustom from "@/components/Button";
import Link from "next/link";
import dynamic from "next/dynamic";
import StarRatings from "react-star-ratings";
import MyAvatar from "@/components/Avatar";
const Map = dynamic(
  () => import("@/components/map"), // replace '@components/map' with your component's location
  { ssr: false } // This line is important. It's what prevents server-side render
);

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

const TABLE_ROWS = (params) => [
  {
    name: "VET Name",
    job: params.name,
  },
  {
    name: "Email",
    job: params.email,
  },
  {
    name: "BVG Registration Number",
    job: params.certificateId,
  },
  {
    name: "Degree",
    job: params.degree,
  },
];

// const TABLE_ROWS2 = (params) => [

// ];

const GET_VET_INFO = gql`
  query GetVetInfo($vetId: String!) {
    getVetInfo(vetId: $vetId) {
      certificateId
      degree
      location {
        lat
        lng
      }
      zoomLink
    }
  }
`;

const FETCH_REVIEWS = gql`
  query FindReviewsByVetId($vetId: String!) {
    findReviewsByVetId(vetId: $vetId) {
      comment
      rating
      user {
        name
        avatar
      }
    }
  }
`;

const getVetInfo = (dataVetInfo) => {
  if (!dataVetInfo || !dataVetInfo.getVetInfo) {
    return {
      degree: "Not Provided",
      certificateId: "Not Provided",
      zoomLink: "Not Provided",
    };
  } else {
    return {
      degree: dataVetInfo.getVetInfo.degree,
      certificateId: dataVetInfo.getVetInfo.certificateId,
      zoomLink: dataVetInfo.getVetInfo.zoomLink,
    };
  }
};

export default function Page({ params }) {
  const { loading, error, data } = useQuery(FETCH_VET, {
    variables: {
      getVetId: params.vet_id,
    },
  });

  const {
    data: dataVetInfo,
    loading: loadingVerify,
    error: errorVerify,
  } = useQuery(GET_VET_INFO, {
    variables: {
      vetId: params.vet_id,
    },
  });

  const {
    data: dataReviews,
    loading: loadingReviews,
    error: errorReviews,
  } = useQuery(FETCH_REVIEWS, {
    variables: {
      vetId: params.vet_id,
    },
  });

  if (loadingVerify || loading || loadingReviews) return <div>Loading...</div>;

  console;

  return (
    <div className={"text-center mb-20"}>
      {data && (
        <>
          <h2 className={" text-2xl font-bold text-semi-blue mb-10"}>
            Vet Profile
          </h2>

          <div
            className={
              "text-center flex flex-col lg:flex-row justify-around items-center gap-y-10"
            }
          >
            <MyAvatar src={data["getVet"].avatar} size="300px" />

            <div className={"flex flex-col justify-center items-center"}>
              <Card className="w-[550px] h-full overflow-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <tbody>
                    {TABLE_ROWS({
                      ...data["getVet"],
                      ...getVetInfo(dataVetInfo),
                    }).map(({ name, job }, index) => {
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
          </div>

          {dataReviews && dataReviews.findReviewsByVetId.length > 0 && (
            <div className={"text-left mt-20 mx-[10%]"}>
              <h2
                className={
                  " text-2xl font-bold text-semi-blue mb-10 text-center"
                }
              >
                Reviews
              </h2>
              <div className={"flex flex-col"}>
                {dataReviews.findReviewsByVetId.map((review, index) => (
                  <div
                    className="pt-4 h-[150px] px-5 shadow-lg rounded-lg w-full"
                    key={index}
                  >
                    <div className="my-5 flex gap-2 justify-between">
                      <div className="flex gap-2 justify-start items-center">
                        <MyAvatar src={review.user.avatar} size="30px" />
                        <h4 className="font-semibold text-semi-blue">
                          {review.user.name}
                        </h4>
                      </div>
                      <StarRatings
                        rating={review.rating}
                        numberOfStars={5}
                        name="rating"
                        starDimension="23px"
                        starSpacing="1px"
                        starRatedColor="#FF8A00"
                      />
                    </div>

                    <div className="mt-5 mb-10 text-lg font-roboto ">
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h1 className={"text-2xl font-bold text-semi-blue my-16 text-center"}>
            Vet Location
          </h1>
          <div className="mx-[10%]">
            {dataVetInfo && dataVetInfo.getVetInfo ? (
              <Map
                userLocation={dataVetInfo.getVetInfo.location}
                update={false}
              />
            ) : (
              <p className="text-2xl text-red-500 -mt-10">Not Provided</p>
            )}
          </div>

          <Link
            href={"/user/vets/[vet_id]/book_slots"}
            as={`/user/vets/${params.vet_id}/book_slots`}
          >
            <ButtonCustom className={"mt-16"}>Request Appointment</ButtonCustom>
          </Link>
        </>
      )}
    </div>
  );
}

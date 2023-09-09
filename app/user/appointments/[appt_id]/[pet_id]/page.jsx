"use client";
import React, { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Avatar, Button, Card, Typography } from "@material-tailwind/react";
import slots from "@/utils/slots";
import Link from "next/link";
import { TextField } from "@mui/material";
import dynamic from "next/dynamic";
import StarRatings from "react-star-ratings";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import MyAvatar from "@/components/Avatar";

const MySwal = withReactContent(Swal);
const PDFViewer = dynamic(() => import("@/components/pdf"), { ssr: false });

const FETCH_APPOINTMENT = gql`
  query GetAppointmentDetails($apptId: String!) {
    getAppointmentDetails(apptId: $apptId) {
      date
      pet {
        avatar
        name
        breed
        age
        weight
        species
      }
      slot_id
      type
      vet {
        email
        name
        _id
      }
      zoomLink
      prescription {
        _id
        advice
        diseases
        medicines {
          dose
          duration
          name
        }
        symptoms
      }
    }
  }
`;

const TABLE_ROWS = (params) => [
  {
    name: "Pet Name",
    job: params.pet.name,
  },
  {
    name: "Date",
    job: params.date.substring(0, 10),
  },
  {
    name: "Slot",
    job:
      slots[params.slot_id].starts_at + " - " + slots[params.slot_id].ends_at,
  },
  {
    name: "Type",
    job: params.type,
  },
  {
    name: "Vet Name",
    job: params.vet.name,
  },
  {
    name: "Vet Email",
    job: params.vet.email,
  },

  {
    name: "Zoom Link",
    job: params.zoomLink ?? "No link provided",
  },
];

const CREATE_REVIEW = gql`
  mutation CreateReview($review: CreateReviewInput!) {
    createReview(review: $review) {
      message
      success
    }
  }
`;

const FIND_REVIEW = gql`
  query FindReviewByAppointmentId($apptId: String!) {
    findReviewByAppointmentId(apptId: $apptId) {
      comment
      rating
    }
  }
`;

function Page({ params }) {
  const { loading, error, data } = useQuery(FETCH_APPOINTMENT, {
    variables: {
      apptId: params.appt_id,
    },
  });

  const [createReview] = useMutation(CREATE_REVIEW);

  const { data: reviewData, loading: reviewLoading } = useQuery(FIND_REVIEW, {
    variables: {
      apptId: params.appt_id,
    },
  });

  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");

  useEffect(() => {
    if (reviewData) {
      console.log(reviewData);
    }
  }, [reviewData]);
  if (loading || reviewLoading) return <p>Loading...</p>;

  const handleSubmitReview = async () => {
    try {
      const { data: reviewData, error: errorReview } = await createReview({
        variables: {
          review: {
            appointmentId: params.appt_id,
            rating: rating,
            comment: comment,
            vetId: data.getAppointmentDetails.vet._id,
          },
        },
      });

      if (reviewData.createReview.success) {
        await MySwal.fire({
          icon: "success",
          title: "Success",
          text: "Review submitted successfully",
        });
      } else {
        await MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Review could not be submitted",
        });
      }
    } catch (e) {
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Review could not be submitted",
      });
    }
  };

  return (
    <div className="mx-[5%]">
      {data && (
        <>
          <h2
            className={" text-2xl font-bold text-semi-blue mb-10 text-center"}
          >
            Appointment Details
          </h2>

          <div
            className={
              "text-center flex flex-col lg:flex-row justify-around items-center gap-y-10"
            }
          >
            <MyAvatar pet={true} src={data.getAppointmentDetails.pet.avatar} />
            {/*<img*/}
            {/*  // src={data.getPetById.avatar}*/}

            {/*  alt="pet-avatar"*/}
            {/*  className={"w-[200px]"}*/}
            {/*/>*/}
            <Card className="w-[550px] h-full overflow-auto">
              <table className="w-full min-w-max table-auto text-left">
                <tbody>
                  {TABLE_ROWS(data.getAppointmentDetails).map(
                    ({ name, job }, index) => {
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
                    }
                  )}
                </tbody>
              </table>
            </Card>
          </div>

          <div className={"text-center mt-16 text-xl"}>
            <Link
              href={"/user/vets/" + data.getAppointmentDetails.vet._id}
              className="text-semi-blue hover:text-primary"
            >
              View Vet Profile
              {data.getAppointmentDetails.type === "INPERSON" && (
                <> / See Vet Location</>
              )}
            </Link>
          </div>

          <div className="mt-16">
            {data.getAppointmentDetails.prescription && (
              <PDFViewer
                prescription={data.getAppointmentDetails.prescription}
                appointment={data.getAppointmentDetails}
              />
            )}
          </div>

          {reviewData ? (
            <div className="my-16">
              <h2 className="text-center text-2xl text-semi-blue font-bold">
                Your Rating
              </h2>
              <div className="pt-4 h-[150px] px-5 shadow-lg rounded-lg">
                <div className="my-5 ">
                  <StarRatings
                    rating={reviewData.findReviewByAppointmentId.rating}
                    numberOfStars={5}
                    name="rating"
                    starDimension="23px"
                    starSpacing="1px"
                    starRatedColor="#FF8A00"
                  />
                </div>

                <div className="mt-5 mb-10 text-lg font-roboto ">
                  {reviewData.findReviewByAppointmentId.comment}
                </div>
              </div>
            </div>
          ) : (
            <div className="my-16">
              <h2 className="text-center text-2xl text-semi-blue font-bold">
                Rate your vet
              </h2>

              <div className="my-5">
                <StarRatings
                  rating={rating}
                  changeRating={setRating}
                  numberOfStars={5}
                  name="rating"
                  starDimension="23px"
                  starSpacing="1px"
                  starRatedColor="#FF8A00"
                />
              </div>

              <TextField
                id="standard-basic"
                label="Comment"
                variant="standard"
                fullWidth
                color="warning"
                inputProps={{
                  style: { fontSize: 20 },
                }}
                multiline
                rows={2}
                // {...register("advice")}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <div className="mt-10 text-center">
                <Button
                  color="indigo"
                  className="rounded-full text-lg"
                  onClick={handleSubmitReview}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Page;

"use client";
import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Link from "next/link";
import { HiCurrencyDollar } from "react-icons/hi";
import { BsCalendarDateFill } from "react-icons/bs";
import { BiSolidRocket } from "react-icons/bi";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch } from "react-redux";
import { setReturnUrl } from "@/redux/slices/return_url.stripe";

const MySwal = withReactContent(Swal);

const FETCH_SUBSCRIPTION = gql`
  query GetSubscriptionStatus {
    getSubscriptionStatus {
      plan {
        active
        amount
        id
        product {
          name
          images
        }
      }
      currency
      current_period_end
      current_period_start
      id
    }
  }
`;

const CANCEL_SUBSCRIPTION = gql`
  mutation Mutation($subscriptionId: String!) {
    cancelSubscription(subscriptionId: $subscriptionId) {
      message
      success
    }
  }
`;

export default function page() {
  const { loading, error, data } = useQuery(FETCH_SUBSCRIPTION);
  const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION);

  if (loading) return <div>Loading...</div>;

  const disPatch = useDispatch();

  return (
    <div className="mx-[5%]">
      <h2 className="text-2xl text-blue-600 font-semibold mb-5">
        My subscription
      </h2>

      {data && data.getSubscriptionStatus.length == 0 && (
        <div className="mt-6">
          <Typography color="blue-gray" className="text-xl mb-5">
            You don't have any active subscription
          </Typography>
          <Link href="/user/products">
            <Button
              color="blue"
              ripple="light"
              variant="contained"
              onClick={() => {
                disPatch(setReturnUrl("/user/subscription"));
              }}
            >
              Subscribe
              <BiSolidRocket className="inline-block ml-2" size={25} />
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-3 mb-20">
        {data &&
          data.getSubscriptionStatus.map((subscription) => {
            return (
              <Card className="mt-6 w-96">
                <CardBody>
                  <img
                    src={subscription.plan.product.images[0]}
                    className="w-[100px] h-[100px] mb-5"
                  />

                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {subscription.plan.product.name} plan
                  </Typography>
                  <div className="flex justify-between items-center">
                    <div>
                      <HiCurrencyDollar
                        className="inline-block mr-2 text-blue-500 -mt-1"
                        size={25}
                      />
                      <Typography className="inline-block mr-2">
                        {subscription.plan.amount / 100}.00
                      </Typography>
                      <Typography className="inline-block mr-2">
                        {subscription.currency}
                      </Typography>
                    </div>
                    <div>
                      <BsCalendarDateFill
                        className="inline-block mr-2 text-primary -mt-1"
                        size={25}
                      />
                      <Typography className="inline-block mr-2">
                        {new Date(
                          subscription.current_period_end * 1000
                        ).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="pt-0">
                  <Button
                    size="sm"
                    variant="contained"
                    className="flex items-center gap-2"
                    color={"red"}
                    onClick={async () => {
                      const {
                        data: { cancelSubscription: { success } = {} } = {},
                      } = await cancelSubscription({
                        variables: { subscriptionId: subscription.id },
                      });

                      if (success) {
                        await MySwal.fire({
                          title: "Success!",
                          text: "Your subscription has been cancelled",
                          icon: "success",
                          confirmButtonText: "Ok",
                        });
                        window.location.reload();
                      } else
                        await MySwal.fire({
                          title: "Error!",
                          text: "Something went wrong",
                          icon: "error",
                          confirmButtonText: "Ok",
                        });
                    }}
                  >
                    Cancel
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                      />
                    </svg>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

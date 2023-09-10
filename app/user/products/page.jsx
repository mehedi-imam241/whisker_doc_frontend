"use client";

import React, { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import Link from "next/link";
import SubscriptionForm from "@/components/subscriptionForm";

const GET_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      default_price
      description
      id
      name
      images
      My_Price
    }
  }
`;
const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($priceId: String!) {
    createSubscription(priceId: $priceId) {
      subscriptionId
      clientSecret
    }
  }
`;

export default function page() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [productIdx, setProductIdx] = useState(null);
  const [createSubscription] = useMutation(CREATE_SUBSCRIPTION);
  const [options, setOptions] = useState(null);

  const getSubscription = async () => {
    const { data: { createSubscription: { clientSecret } = {} } = {} } =
      await createSubscription({
        variables: { priceId: data.getAllProducts[productIdx].default_price },
      });
    setOptions({
      // Fully customizable with appearance API.
      appearance: {},
      clientSecret,
    });
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div className="mx-[5%]">
      <div className="flex items-center gap-5">
        {data.getAllProducts.map((product, index) => {
          return (
            <Card className="mt-6 w-96">
              <CardBody>
                <img
                  src={product.images[0]}
                  className="w-[100px] h-[100px] mb-5"
                />

                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {product.name}
                </Typography>
                <Typography>{product.description}</Typography>
              </CardBody>
              <CardFooter className="pt-0">
                <Link href="#" className="inline-block">
                  <Button
                    size="sm"
                    variant="text"
                    className="flex items-center gap-2 text-lg"
                    color={product.name === "Premium" ? "orange" : "blue"}
                    onClick={() => setProductIdx(index)}
                  >
                    Buy
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
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {productIdx !== null && (
        <Card className="mt-10">
          <CardBody className="flex justify-between flex-row-reverse">
            <img
              src={data.getAllProducts[productIdx].images[0]}
              className="w-[50px] h-[50px] mb-5"
            />

            <div>
              <div className="flex gap-5">
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  Buying {data.getAllProducts[productIdx].name} Plan
                </Typography>

                <Typography
                  variant="h5"
                  color={
                    data.getAllProducts[productIdx].name === "Premium"
                      ? "orange"
                      : "blue"
                  }
                  className="mb-2"
                >
                  ${data.getAllProducts[productIdx].My_Price}
                  {data.getAllProducts[productIdx].name === "Premium"
                    ? " per year"
                    : " per month"}
                </Typography>
              </div>

              <Typography>
                {data.getAllProducts[productIdx].description}
              </Typography>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Link href="#" className="inline-block">
              <Button
                size="sm"
                variant="gradient"
                className="flex items-center gap-2"
                color={
                  data.getAllProducts[productIdx].name === "Premium"
                    ? "orange"
                    : "blue"
                }
                onClick={getSubscription}
              >
                Proceed
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
      <SubscriptionForm options={options} />
    </div>
  );
}

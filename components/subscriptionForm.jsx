"use client";

import React, { use, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation, gql } from "@apollo/client";
import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const return_url = useSelector((state) => state.stripe.return_url);

  useEffect(() => {
    console.log("stripe", return_url);
  }, [return_url]);

  // console.log("stripe", return_url);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    console.log("stripe", return_url);

    const paymentResult = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          `${window.location.origin + return_url}` ||
          `${window.location.origin}/user/subscription`,
      },
    });

    if (paymentResult.error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(paymentResult.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <Button
        variant="contained"
        size="lg"
        type="submit"
        color="orange"
        disabled={!stripe || !elements}
        className="mt-5 mb-20"
      >
        Pay
      </Button>

      {/* <button type="submit" disabled={!stripe || !elements}>
        Pay
      </button> */}
      {/* Show error message to your customers */}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </form>
  );
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function SubscriptionForm({ options }) {
  return (
    <div className="mt-10">
      {options && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { center } from "@/utils/location_center";
import dynamic from "next/dynamic";
import ButtonCustom from "@/components/Button";
import { gql, useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const Map = dynamic(
  () => import("@/components/map"), // replace '@components/map' with your component's location
  { ssr: false } // This line is important. It's what prevents server-side render
);

const FETCH_VET_INFO = gql`
  query GetMyInfo {
    getMyInfo {
      _id
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

const UPDATE_VET = gql`
  mutation Mutation($input: VetInfoInput!) {
    UpdateVetInfo(input: $input) {
      message
    }
  }
`;

export default function Page() {
  const [userLocation, setUserLocation] = useState(center);
  const [automaticLocation, setAutomaticLocation] = useState(1); // 1 for previous location, 2 for GPS location, 3 for manual location
  const { data: dataVetInfo, loading: loadingVetInfo } =
    useQuery(FETCH_VET_INFO);
  const [UpdateVetInfo, { data, loading, error }] = useMutation(UPDATE_VET);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      degree: dataVetInfo?.getMyInfo?.degree,
      certificateId: dataVetInfo?.getMyInfo?.certificateId,
      zoomLink: dataVetInfo?.getMyInfo?.zoomLink,
    },
  });

  useEffect(() => {
    if (dataVetInfo?.getMyInfo?.location) {
      setUserLocation(dataVetInfo?.getMyInfo?.location);
    }
    if (dataVetInfo && dataVetInfo.getMyInfo) {
      setValue("degree", dataVetInfo.getMyInfo.degree);
      setValue("certificateId", dataVetInfo.getMyInfo.certificateId);
      setValue("zoomLink", dataVetInfo.getMyInfo.zoomLink);
    }
  }, [dataVetInfo]);

  const onSubmit = async (form_data) => {
    form_data.location = userLocation;


    try {
      const { data } = await UpdateVetInfo({
        variables: {
          input: {
            ...form_data,
          },
        },
      });

      await MySwal.fire({
        title: "Success!",
        text: data.UpdateVetInfo.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
      reset();
    } catch (error) {
      console.log(error);
      await MySwal.fire({
        title: "Error!",
        text: "Something went wrong",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  if (loadingVetInfo) return <div>Loading...</div>;

  console.log(dataVetInfo);

  return (
    <form
      className="text-xl w-[750px] mx-auto "
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className={"text-semi-blue font-semibold text-center"}>
        Edit Profile
      </h1>
      <div className="grid grid-cols-2 my-10 gap-x-10 gap-y-10">
        <div>
          <label
            htmlFor="degree"
            className="block mb-2  font-medium text-gray-900 dark:text-white"
          >
            Your degree
          </label>
          <input
            type="text"
            name="degree"
            id="degree"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your degree"
            {...register("degree", {
              required: "degree is required",
            })}
          />
          {errors.degree && (
            <p className={"text-red-500 text-left text-sm mt-1"}>
              {errors.degree?.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="certificateId"
            className="block mb-2  font-medium text-gray-900 dark:text-white"
          >
            BVC Reg No
          </label>
          <input
            type="text"
            name="certificateId"
            id="certificateId"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="BVC Reg No"
            {...register("certificateId", {
              required: "certificateId is required",
            })}
          />
          {errors.certificateId && (
            <p className={"text-red-500 text-left text-sm mt-1"}>
              {errors.certificateId?.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <label
            htmlFor="zoomLink"
            className="block mb-2  font-medium text-gray-900 dark:text-white "
          >
            Zoom Link
          </label>
          <input
            type="text"
            name="zoomLink"
            id="zoomLink"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Zoom Link"
            {...register("zoomLink", {
              required: "zoomLink is required",
              pattern: {
                value:
                  /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i,
                message: "Invalid URL",
              },
            })}
          />
          {errors.zoomLink && (
            <p className={"text-red-500 text-left text-sm mt-1"}>
              {errors.zoomLink?.message}
            </p>
          )}
        </div>
      </div>

      <div className="my-10">
        <Map
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          previous={true}
        />
      </div>

      <div className="text-center mb-20">
        <ButtonCustom type="submit">Update Infos</ButtonCustom>
      </div>
    </form>
  );
}

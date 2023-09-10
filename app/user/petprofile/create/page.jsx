"use client";
import React from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import ButtonCustom from "@/components/Button";

const MySwal = withReactContent(Swal);

const REGISTER_PET = gql`
  mutation CreatePet($input: CreatePetInput!) {
    createPet(input: $input) {
      message
    }
  }
`;

// eslint-disable-next-line react/display-name
const Select = React.forwardRef(({ onChange, onBlur, name, label }, ref) => (
  <div>
    {/*<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">*/}
    {/*  {label}*/}
    {/*</label>*/}
    <select
      placeholder={label}
      name={name}
      ref={ref}
      onChange={onChange}
      onBlur={onBlur}
      className={
        " bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      }
    >
      <option value="MALE">MALE</option>
      <option value="FEMALE">FEMALE</option>
    </select>
  </div>
));

function Page(props) {
  const [CreatePet, { data, loading, error }] = useMutation(REGISTER_PET);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (form_data) => {
    form_data.age = parseFloat(form_data.age);
    form_data.weight = parseFloat(form_data.weight);

    try {
      const res = await CreatePet({
        variables: {
          input: {
            ...form_data,
          },
        },
      });

      await MySwal.fire({
        title: "Success!",
        text: res.data.createPet.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (e) {

      await MySwal.fire({
        title: "Error!",
        text: "Something went wrong",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
    // reset();

    window.location.href = "/user";
  };

  return (
    <form className={"text-center"} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={"font-semibold text-semi-blue text-2xl mb-10"}>
        Create Pet Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[600px] mx-auto">
        <div>
          <input
            type={"text"}
            placeholder={"Name"}
            {...register("name", { required: true })}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.name && (
            <p className={"text-red-500 text-left text-sm mt-1"}>
              {errors.name?.message}
            </p>
          )}
        </div>
        <div>
          <input
            type={"number"}
            placeholder={"Age"}
            {...register("age", { required: true })}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.age && (
            <p className={"text-red-500 text-left text-sm mt-1"}>
              {errors.age?.message}
            </p>
          )}
        </div>
        <div>
          <input
            type={"text"}
            placeholder={"Breed"}
            {...register("breed", { required: true })}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.breed && (
            <p className={"text-red-500 text-left text-sm mt-1"}>
              {errors.breed?.message}
            </p>
          )}
        </div>
        <div>
          <Select
            label="Select Gender"
            {...register("gender", {
              required: "gender is required",
            })}
          />
          {errors.gender && (
            <p className={"text-red-500 text-left text-sm mt-1"}>
              {errors.gender?.message}
            </p>
          )}
        </div>
        <div>
          <input
            type={"text"}
            placeholder={"Species"}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            {...register("species", { required: true })}
          />
          {errors.species && (
            <p className={"text-red-500 text-left text-sm mt-1"}>
              {errors.species?.message}
            </p>
          )}
        </div>
        <div>
          <input
            type={"number"}
            placeholder={"Weight (kg)"}
            {...register("weight", { required: true })}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.weight && (
            <p className={"text-red-500 text-left text-sm mt-1"}>
              {errors.weight?.message}
            </p>
          )}
        </div>
      </div>
      <ButtonCustom className={"mt-10"} type={"submit"}>
        Create
      </ButtonCustom>
    </form>
  );
}

export default Page;

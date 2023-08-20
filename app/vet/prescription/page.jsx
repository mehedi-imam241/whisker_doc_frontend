"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { IconButton } from "@material-tailwind/react";
import { Input } from "@mui/material";
import { AiFillPlusCircle } from "react-icons/ai";

export default function Page() {
  const { register, control, handleSubmit, reset, trigger, setError } = useForm(
    {
      // defaultValues: {}; you can populate the fields by this attribute
    }
  );
  const {
    fields: fieldsSymptoms,
    append: appendSymptoms,
    remove: removeSymptoms,
  } = useFieldArray({
    control,
    name: "symptoms",
  });

  const {
    fields: fieldsDiseases,
    append: appendDiseases,
    remove: removeDiseases,
  } = useFieldArray({
    control,
    name: "diseases",
  });

  const today = new Date().toDateString();

  return (
    <form
      className="mx-[5%] "
      onSubmit={handleSubmit((data) => console.log(data))}
    >
      <h1 className="text-3xl text-semi-blue text-center my-20">
        Prescription
      </h1>
      <h2 className="text-2xl text-semi-blue mb-14 ">Information</h2>
      <h3 className="text-xl  mb-4">
        <span className="text-primary font-semibold">Date :</span> {today}
      </h3>

      <div className="grid grid-cols-3 place-content-center">
        <h3 className="text-xl  mb-4">
          <span className="text-primary font-semibold">Name :</span> Nemo
        </h3>
        <h3 className="text-xl  mb-4">
          <span className="text-primary font-semibold">Species :</span> Cat
        </h3>
        <h3 className="text-xl  mb-4">
          <span className="text-primary font-semibold">Breed :</span> Local
        </h3>
        <h3 className="text-xl  mb-4">
          <span className="text-primary font-semibold">Gender :</span> Female
        </h3>
        <h3 className="text-xl  mb-4">
          <span className="text-primary font-semibold">Age :</span> 2 years
        </h3>
        <h3 className="text-xl  mb-4">
          <span className="text-primary font-semibold">Weight :</span> 4 kg
        </h3>
      </div>

      <h2 className="text-2xl text-semi-blue my-14 ">Diagnosis</h2>
      <div className="flex justify-around my-10 text-lg">
        <div className="w-[300px]">
          <h3 className="text-xl  mb-5">
            <span className="text-primary font-semibold">Symptoms</span>
          </h3>
          <ul>
            {fieldsSymptoms.map((item, index) => (
              <li key={item.id} className="mb-4 flex items-center gap-4 ">
                <Input variant="standard" {...register(`symptoms.${index}`)} />

                {/* <Controller
                  render={({ field }) => <input {...field} />}
                  name={`test.${index}.lastName`}
                  control={control}
                /> */}
                <IconButton
                  variant="gradient"
                  size="sm"
                  className="rounded-full -mb-2"
                  onClick={() => removeSymptoms(index)}
                  color="indigo"
                >
                  <MdDelete size={25} />
                </IconButton>
              </li>
            ))}
          </ul>
          <IconButton
            variant="gradient"
            size="sm"
            className="rounded-full"
            type="button"
            onClick={() => appendSymptoms("bill")}
            color="orange"
          >
            <AiFillPlusCircle size={25} />
          </IconButton>
        </div>
        <div className="w-[300px]">
          <h3 className="text-xl  mb-5">
            <span className="text-primary font-semibold">Diseases</span>
          </h3>
          <ul>
            {fieldsDiseases.map((item, index) => (
              <li key={item.id} className="mb-4 flex items-center gap-4 ">
                {/* <input {...register(`diseases.${index}`)} /> */}

                <Input variant="standard" {...register(`diseases.${index}`)} />
                {/* <Controller
                  render={({ field }) => <input {...field} />}
                  name={`test.${index}.lastName`}
                  control={control}
                /> */}
                <IconButton
                  variant="gradient"
                  size="sm"
                  className="rounded-full -mb-2"
                  onClick={() => removeDiseases(index)}
                  color="indigo"
                >
                  <MdDelete size={25} />
                </IconButton>
              </li>
            ))}
          </ul>
          <IconButton
            variant="gradient"
            size="sm"
            className="rounded-full"
            type="button"
            onClick={() => appendDiseases("bill")}
            color="orange"
          >
            <AiFillPlusCircle size={25} />
          </IconButton>
          {/* <button type="button" onClick={() => append({ firstName: "bill" })}>
            append
          </button> */}
        </div>
      </div>

      <input type="submit" />
    </form>
  );
}

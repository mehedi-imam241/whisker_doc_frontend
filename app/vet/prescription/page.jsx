"use client";

import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { IconButton, input } from "@material-tailwind/react";
import { Input } from "@mui/material";
import { AiFillPlusCircle } from "react-icons/ai";
import ButtonCustom from "@/components/Button";
import { TextField } from "@mui/material";


const styles = {
  root: {
    background: "black"
  },
  input: {
    color: "#2EFF22"
  }
};

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

  const {
    fields: fieldsMedicines,
    append: appendMedicines,
    remove: removeMedicines,
  } = useFieldArray({
    control,
    name: "medicines"
  })

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
      <div className="flex my-10 text-lg gap-x-28">
        <div className="w-[450px]">
          <div className="flex justify-between">
            <h3 className="text-xl  mb-5">
              <span className="text-primary font-semibold">Symptoms</span>
            </h3>
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

          <ul>
            {fieldsSymptoms.map((item, index) => (
              <li
                key={item.id}
                className="mb-4 flex justify-between items-center gap-4 "
              >
                <Input variant="standard" {...register(`symptoms.${index}`)} className="w-[300px]" />

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
        </div>
        <div className="w-[450px]">
          <div className="flex justify-between">
            <h3 className="text-xl  mb-5">
              <span className="text-primary font-semibold">Diseases</span>
            </h3>
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
          </div>

          <ul>
            {fieldsDiseases.map((item, index) => (
              <li
                key={item.id}
                className="mb-4 flex justify-between items-center gap-4 "
              >
                {/* <input {...register(`diseases.${index}`)} /> */}

                <Input variant="standard" {...register(`diseases.${index}`)} className="w-[300px]"/>
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

          {/* <button type="button" onClick={() => append({ firstName: "bill" })}>
            append
          </button> */}
        </div>
      </div>

      <h2 className="text-2xl text-semi-blue my-14 ">Medicine</h2>

      <div className="">
        <div className="grid grid-cols-4 w-full gap-y-4 ">
          <h3 className="text-xl  mb-5">
            <span className="text-primary font-semibold">Medicine Name</span>
          </h3>
          <h3 className="text-xl  mb-5">
            <span className="text-primary font-semibold">Dosage</span>
          </h3>
          <h3 className="text-xl  mb-5">
            <span className="text-primary font-semibold">Duration (days)</span>
          </h3>
          <IconButton
          variant="gradient"
          size="sm"
          className="rounded-full"
          type="button"
          onClick={() => appendMedicines({
            name: "Medicine",
            dose: "1+1+1",
            duration: "7",
          })}
          color="orange"
        >
          <AiFillPlusCircle size={25} />
        </IconButton>

          {fieldsMedicines.map((item, index) => (
            <>
              <Input variant="standard" {...register(`medicines.${index}.name`)} className="w-[300px]"/>
              <Input variant="standard" {...register(`medicines.${index}.dose`)} className="w-[300px]"/>
              <Input variant="standard" {...register(`medicines.${index}.duration`)} className="w-[300px]"/>

              <IconButton
                variant="gradient"
                size="sm"
                className="rounded-full -mb-2"
                onClick={() => removeMedicines(index)}
                color="indigo"
              >
                <MdDelete size={25} />
              </IconButton>
            </>
          ))}



        </div>












      </div>

      <div className="w-1/2 my-10 ">



      <TextField id="standard-basic" label="Advice" variant="standard"  fullWidth color="warning" inputProps={{
  style: {fontSize: 20} 
  
}}

{...register("advice")}

/>
      </div>




      <div className="text-center my-20">
        <ButtonCustom className={"text-xl"} type="submit">Submit</ButtonCustom>
      </div>
    </form>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Card, Typography } from "@material-tailwind/react";
import { BsFillCameraFill } from "react-icons/bs";
import { FileUploader } from "react-drag-drop-files";
import imageTypes from "@/utils/imageTypes";
import MyAvatar from "@/components/Avatar";
import { uploadCloudinary } from "@/utils/uploadCloudinary";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import { useMutation } from "@apollo/client";

const MySwal = withReactContent(Swal);

const FETCH_PET = gql`
  query GetPetById($_id: String!) {
    getPetById(id: $_id) {
      _id
      age
      avatar
      breed
      gender
      name
      species
      weight
    }
  }
`;

const UPLOAD_AVATAR = gql`
  mutation UploadPetAvatar($avatar: String!, $petId: String!) {
    uploadPetAvatar(avatar: $avatar, petId: $petId) {
      message
      success
    }
  }
`;

const TABLE_ROWS = (params) => [
  {
    name: "Pet Name",
    job: params.name,
  },
  {
    name: "Pet Id",
    job: params._id,
  },
  {
    name: "Species",
    job: params.species,
  },
  {
    name: "Breed",
    job: params.breed,
  },
  {
    name: "Gender",
    job: params.gender,
  },
  {
    name: "Age",
    job: params.age + " years",
  },
  {
    name: "Weight",
    job: params.weight + " kg",
  },
];

export default function Page({ params }) {
  const { loading, error, data } = useQuery(FETCH_PET, {
    variables: {
      _id: params.pet_id,
    },
  });

  const [uploadAvatar] = useMutation(UPLOAD_AVATAR);
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (data && data.getPetById.avatar) {
      setSrc(data.getPetById.avatar);
    }
  }, [data]);

  const handleChange = (file) => {
    uploadCloudinary(file).then((res) => {
      uploadAvatar({
        variables: {
          petId: params.pet_id,
          avatar: res.data.secure_url,
        },
      })
        .then(({ data }) => {
          console.log(data);
          if (data.uploadPetAvatar.success) {
            setSrc(res.data.secure_url);

            MySwal.fire({
              icon: "success",
              title: "Success",
              text: "Avatar updated successfully",
            });
          } else {
            MySwal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }
        })
        .catch((e) => {
          console.log(e);
          MySwal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    });
  };

  return (
    <div className={"text-center"}>
      {loading && <p>Loading...</p>}

      {data && (
        <>
          <h2 className={" text-2xl font-bold text-semi-blue mb-10"}>
            Pet Profile
          </h2>

          <div
            className={
              "text-center flex flex-col lg:flex-row justify-around items-center gap-y-10"
            }
          >
            <FileUploader
              handleChange={handleChange}
              name="file"
              types={imageTypes}
            >
              <div className="relative hover:cursor-pointer">
                <MyAvatar pet={true} src={src} />
                <div className="rounded-full absolute bottom-5 right-5 p-1 bg-gray-50">
                  <BsFillCameraFill size={30} className=" text-primary" />
                </div>
              </div>
            </FileUploader>
            <Card className="w-[550px] h-full overflow-auto">
              <table className="w-full min-w-max table-auto text-left">
                <tbody>
                  {TABLE_ROWS(data.getPetById).map(({ name, job }, index) => {
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
        </>
      )}
    </div>
  );
}

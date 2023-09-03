"use client";
import React, { useEffect, useState, useContext } from "react";
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  Input,
  Typography,
  avatar,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import ButtonCustom from "@/components/Button";
import Link from "next/link";
import dynamic from "next/dynamic";
import MyAvatar from "@/components/Avatar";
import { BsFillCameraFill } from "react-icons/bs";
import { FileUploader } from "react-drag-drop-files";
import imageTypes from "@/utils/imageTypes";
import { uploadCloudinary } from "@/utils/uploadCloudinary";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user";

const MySwal = withReactContent(Swal);

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
      _id
    }
  }
`;

const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($avatar: String!) {
    uploadUserAvatar(avatar: $avatar) {
      message
      success
    }
  }
`;

const IS_SLOT_CREATED = gql`
  query IsSlotCreated {
    IsSlotCreated {
      message
    }
  }
`;

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

const TABLE_ROWS = (params) => [
  {
    name: "VET Name",
    job: params.name,
  },
  {
    name: "VET Id",
    job: params._id,
  },
  {
    name: "Email",
    job: params.email,
  },
  {
    name: "Degree",
    job: params.degree,
  },
  {
    name: "BVC Registration Number",
    job: params.certificateId,
  },
  {
    name: "Zoom Link",
    job: params.zoomLink,
  },
];

const getVetInfo = (dataVetInfo) => {
  if (!dataVetInfo || !dataVetInfo.getMyInfo) {
    return {
      degree: "Not Provided",
      certificateId: "Not Provided",
      zoomLink: "Not Provided",
    };
  } else {
    return {
      degree: dataVetInfo.getMyInfo.degree,
      certificateId: dataVetInfo.getMyInfo.certificateId,
      zoomLink: dataVetInfo.getMyInfo.zoomLink,
    };
  }
};

export default function Page() {
  const user = useSelector(({ user }) => user.profile);

  const [getVet, { loading, error, data }] = useLazyQuery(
    FETCH_VET
    //   ,
    //   {
    //   variables: {
    //     getVetId: USER._id,
    //   },
    // }
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (user)
      getVet({
        variables: {
          getVetId: user._id,
        },
      });
  }, [user]);

  const [uploadAvatar] = useMutation(UPLOAD_AVATAR);

  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (data && data.getVet.avatar) {
      setSrc(data.getVet.avatar);
    }
  }, [data]);

  const handleChange = (file) => {
    uploadCloudinary(file).then((res) => {
      console.log(res);
      uploadAvatar({
        variables: {
          avatar: res.data.secure_url,
        },
      })
        .then(({ data }) => {
          if (data.uploadUserAvatar.success) {
            setSrc(res.data.secure_url);
            // Cookies.set(
            //   "user",
            //   JSON.stringify({ ...USER, avatar: res.data.secure_url })
            // );

            dispatch(setUser({ ...user, avatar: res.data.secure_url }));

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

  const { data: isSlotCreated, loading: loadingSlot } =
    useQuery(IS_SLOT_CREATED);

  const { data: dataVetInfo, loading: loadingVetInfo } =
    useQuery(FETCH_VET_INFO);

  if (loadingSlot || loading || loadingVetInfo) return <p>Loading...</p>;

  return (
    <div className={"text-center "}>
      {data && (
        <>
          <h1 className={" text-3xl font-bold text-semi-blue mb-10"}>
            My Profile
          </h1>

          <div
            className={
              "text-center flex flex-col xl:flex-row justify-around items-center gap-y-20"
            }
          >
            {/* <Avatar
              alt="avatar"
              src="/assets/user.png"
              className="border border-primary shadow-xl shadow-primary ring-4 ring-primary w-[300px] h-[300px] "
            /> */}

            <FileUploader
              handleChange={handleChange}
              name="file"
              types={imageTypes}
            >
              <div className="relative hover:cursor-pointer">
                <MyAvatar src={src} />
                <div className="rounded-full absolute bottom-5 right-5 p-1 bg-gray-50">
                  <BsFillCameraFill size={30} className=" text-primary" />
                </div>
              </div>
            </FileUploader>

            <Card className="w-[700px] h-full overflow-auto">
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
                  {/*<tr key={9}>*/}
                  {/*  <td>*/}
                  {/*    <Typography*/}
                  {/*      variant="paragraph"*/}
                  {/*      color="blue-gray"*/}
                  {/*      className="font-semibold"*/}
                  {/*    >*/}
                  {/*      Zoom Link*/}
                  {/*    </Typography>*/}
                  {/*  </td>*/}
                  {/*  <td>*/}
                  {/*    <Typography*/}
                  {/*      variant="paragraph"*/}
                  {/*      color="blue-gray"*/}
                  {/*      className="font-normal"*/}
                  {/*    >*/}
                  {/*      {zoomLink.getZoomLink ?? "Not Provided"}*/}
                  {/*    </Typography>*/}
                  {/*  </td>*/}
                  {/*</tr>*/}
                </tbody>
              </table>
            </Card>
          </div>

          <h1 className={"text-2xl font-bold text-semi-blue my-16"}>
            My Location
          </h1>
          <div className="mx-[10%]">
            {dataVetInfo && dataVetInfo.getMyInfo ? (
              <Map
                userLocation={dataVetInfo.getMyInfo.location}
                update={false}
              />
            ) : (
              <p className="text-2xl text-red-500 -mt-10">Not Provided</p>
            )}
          </div>
        </>
      )}

      {isSlotCreated.IsSlotCreated.message === "0" ? (
        <Link href={"/vet/slots/create"}>
          <ButtonCustom className={"my-20 text-2xl"}>
            Provide Slots
          </ButtonCustom>
        </Link>
      ) : (
        <Link href={"/vet/slots/update"}>
          <ButtonCustom className={"my-20 text-2xl"}>Update Slots</ButtonCustom>
        </Link>
      )}
    </div>
  );
}

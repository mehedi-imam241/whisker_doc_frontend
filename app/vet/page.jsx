"use client";
import React, { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  Input,
  Typography,
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import ButtonCustom from "@/components/Button";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const FETCH_VET = gql`
  query Query($getVetId: String!) {
    getVet(id: $getVetId) {
      avatar
      email
      name
      role
      _id
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

const GET_ZOOM_LINK = gql`
  query GetZoomLink {
    getZoomLink {
      zoomLink
    }
  }
`;

const UPDATE_ZOOM_LINK = gql`
  mutation UpdateZoomLink($link: String!) {
    updateZoomLink(link: $link) {
      message
    }
  }
`;

const UPDATE_VERIFICATION_INFO = gql`
  mutation Mutation($input: VerificationRequestInput!) {
    UpdateVerification(input: $input) {
      message
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
];

export default function Page() {
  const USER = JSON.parse(Cookies.get("user"));

  const { loading, error, data } = useQuery(FETCH_VET, {
    variables: {
      getVetId: USER._id,
    },
  });

  const { data: isSlotCreated, loading: loadingSlot } =
    useQuery(IS_SLOT_CREATED);

  const { data: zoomLink, loading: loadingZoom } = useQuery(GET_ZOOM_LINK);
  const [UpdateVerification] = useMutation(UPDATE_VERIFICATION_INFO);
  const [link, setLink] = React.useState("");
  const [degree, setDegree] = React.useState("");
  const [regNo, setRegNo] = React.useState("");

  useEffect(() => {
    if (zoomLink && zoomLink.getZoomLink)
      setLink(zoomLink.getZoomLink.zoomLink);
  }, [zoomLink]);

  const [updateZoomLink] = useMutation(UPDATE_ZOOM_LINK);

  const handleUpdateZoomLink = async () => {
    try {
      const { data } = await updateZoomLink({
        variables: {
          link: link,
        },
      });
      console.log(data);
      await MySwal.fire({
        icon: "success",
        title: "Success",
        text: data.updateZoomLink.message,
      });
    } catch (e) {
      await MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const handleUpdateVerification = async () => {
    if (!degree || !regNo)
      return await MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all the fields!",
      });

    try {
      const { data } = await UpdateVerification({
        variables: {
          input: {
            degree,
            certificateId: regNo,
          },
        },
      });
      console.log(data);
      await MySwal.fire({
        icon: "success",
        title: "Success",
        text: data.UpdateVerification.message,
      });
    } catch (e) {
      await MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  if (loadingSlot || loading || loadingZoom) return <p>Loading...</p>;

  return (
    <div className={"text-center "}>
      {data && (
        <>
          <h2 className={" text-2xl font-bold text-semi-blue mb-10"}>
            My Profile
          </h2>

          <div
            className={
              "text-center flex flex-col lg:flex-row justify-around items-center gap-y-10"
            }
          >
            <Avatar
              alt="avatar"
              src="/assets/user.png"
              className="border border-primary shadow-xl shadow-primary ring-4 ring-primary w-[300px] h-[300px] "
            />
            <div>
              <div className={"mb-10 flex flex-col gap-y-5 items-center"}>
                <Input
                  size="lg"
                  label="BVC REGISTRATION NUMBER"
                  className={""}
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                />
                <Input
                  size="lg"
                  label="Degree"
                  className={""}
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
                <Button onClick={handleUpdateVerification} className={"w-32"}>
                  Update
                </Button>
              </div>

              <div className={"flex mb-6 gap-6 text-xl"}>
                <Input
                  size="lg"
                  label="Zoom Link"
                  className={""}
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <Button onClick={handleUpdateZoomLink} className={"w-48"}>
                  Update Link
                </Button>
              </div>

              <Card className="w-[550px] h-full overflow-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <tbody>
                    {TABLE_ROWS(data.getVet).map(({ name, job }, index) => {
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
          </div>
        </>
      )}

      {isSlotCreated.IsSlotCreated.message === "0" ? (
        <Link href={"/vet/slots/create"}>
          <ButtonCustom className={"mt-10"}>Provide Slots</ButtonCustom>
        </Link>
      ) : (
        <Link href={"/vet/slots/update"}>
          <ButtonCustom className={"mt-10"}>Update Slots</ButtonCustom>
        </Link>
      )}
    </div>
  );
}

"use client";
import React, { useEffect } from "react";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { MdPets } from "react-icons/md";
import Link from "next/link";
import { Pagination } from "@mui/material";
import ButtonCustom from "@/components/Button";
import MyAvatar from "@/components/Avatar";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

import Select from "react-select";

const GET_VerIFIED_SYMPTOMS = gql`
  query GetVerfiedSymptoms($limit: Float!, $skip: Float!) {
    getVerfiedSymptoms(limit: $limit, skip: $skip) {
      _id
      article
      species
      tags
      title
      vetId
      vet {
        avatar
        name
        email
        _id
      }
    }
  }
`;

const SEARCH_SYMPTOMS = gql`
  query SearchSymptoms($input: SearchSymptomsInput!) {
    searchSymptoms(input: $input) {
      _id
      article
      species
      tags
      title
      vetId
      vet {
        avatar
        name
        email
        _id
      }
    }
  }
`;

const PAGE_COUNT = gql`
  query CountPage {
    countPages
  }
`;

const SEARCH_SYMPTOMS_TAGS = gql`
  query SearchSymptomsTags($input: String!) {
    searchSymptomsTags(input: $input) {
      Disease
      Symptom
    }
  }
`;

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: "#fff",
    borderColor: "#9e9e9e",
    minHeight: "30px",
    height: "55px",
    boxShadow: state.isFocused ? null : null,
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: "50px",
    padding: "0 6px",
  }),

  input: (provided, state) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: (state) => ({
    display: "none",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "50px",
  }),
};

const PetOptions = [
  "Dog",
  "Cat",
  "Fish",
  "Bird",
  "Hamster",
  "Rabbit",
  "Guinea Pig",
  "Turtle",
  "Ferret",
  "Chinchilla",
  "Hedgehog",
  "Parrot",
  "Snake",
  "Lizard",
  "Gerbil",
  "Mouse",
  "Rat",
  "Hermit Crab",
  "Potbelly Pig",
  "Sugar Glider",
  "Tarantula",
  "Cockatoo",
  "Iguana",
  "African Grey Parrot",
  "Toucan",
  "Capybara",
  "Fennec Fox",
  "Salamander",
  "Axolotl",
  "Betta Fish",
  "Guppy",
  "Goldfish",
  "Budgerigar",
  "African Clawed Frog",
  "Gecko",
  "Pigeon",
  "Canary",
  "Havanese",
  "Persian Cat",
  "Siamese Cat",
  "Poodle",
  "Bulldog",
  "Siberian Husky",
  "Rottweiler",
  "Dachshund",
  "Boxer",
  "Great Dane",
];

function Page(props) {
  const [skip, setSkip] = React.useState(0);
  const [tagOptions, setTagOptions] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [species, setSpecies] = React.useState("");
  const [searchSymptoms] = useLazyQuery(SEARCH_SYMPTOMS);
  const { loading, error, data } = useQuery(GET_VerIFIED_SYMPTOMS, {
    variables: { limit: 100, skip: skip },
  });

  const [myData, setMyData] = React.useState([]);

  const [searchSymptomsTags] = useLazyQuery(SEARCH_SYMPTOMS_TAGS);
  useEffect(() => {
    if (data && data.getVerfiedSymptoms) {
      setMyData(data.getVerfiedSymptoms);
    }
  }, [data]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className={"mx-[10%] mb-20"}>
      <div className="flex mx-2 justify-between  pt-5 items-center">
        <h1 className="text-semi-blue font-semibold">Verified Symptoms</h1>

        <div className="flex gap-5">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={PetOptions}
            sx={{ width: 300 }}
            onChange={(e, v) => {
              setSpecies(v);
            }}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                label="Species"
                {...params}
                className="w-[300px]"
              />
            )}
          />
          <div className="min-w-[300px] z-[500] justify-self-end ">
            <Select
              isMulti
              placeholder={<div className="font-roboto">Symptoms</div>}
              name="colors"
              options={tagOptions}
              className="basic-multi-select"
              classNamePrefix="Tags"
              onChange={setTags}
              onInputChange={(e) => {
                searchSymptomsTags({
                  variables: {
                    input: e,
                  },
                }).then((res) => {
                  const fetchedTags = [];
                  res.data.searchSymptomsTags.map((symptom) => {
                    fetchedTags.push({
                      value: symptom.Symptom,
                      label: symptom.Symptom,
                      color: "#666666",
                    });
                  });

                  setTagOptions(fetchedTags);

                  // res.data.searchSymptomsTags.
                });
              }}
              styles={customStyles}
            />
          </div>

          <Button
            variant="contained"
            color="indigo"
            onClick={async () => {
              if (species === "" || tags.length === 0) {
                await MySwal.fire({
                  icon: "error",
                  text: "Search Fields Empty",
                  title: "Oops..",
                });
                return;
              }

              const searchTags = tags.map((v) => {
                return v.value;
              });

              console.log(searchTags);

              searchSymptoms({
                variables: {
                  input: {
                    species: species,
                    tags: searchTags,
                  },
                },
              })
                .then(({ data }) => {
                  setMyData(data.searchSymptoms);
                })
                .catch((e) => {
                  console.log(e);
                  MySwal.fire({
                    icon: "error",
                    text: "Error Data Fetching",
                    title: "Oops..",
                  });
                });
            }}
          >
            Search
          </Button>
        </div>
      </div>

      {myData.length === 0 && (
        <h3 className="mx-2 text-red-300 mt-5">No symptoms found</h3>
      )}
      {myData.map((symptoms, index) => {
        return (
          <Card key={index} className="mt-6">
            <CardBody>
              <div className={"flex justify-between"}>
                <div>
                  <div className="flex gap-3 items-center mb-5">
                    <MdPets className="text-3xl text-semi-blue" />
                    <Typography variant="h5">{symptoms.species}</Typography>
                  </div>
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {symptoms.title}
                  </Typography>
                </div>

                <div className={"flex flex-col items-center mr-4"}>
                  <MyAvatar src={symptoms.vet.avatar} size="50px" />
                  <Typography className="mt-2">
                    {symptoms.vet.name} | Vet
                  </Typography>
                </div>
              </div>
            </CardBody>
            <CardFooter className="pt-0 flex items-center justify-between">
              <Link
                href={`/user/symptoms/${symptoms._id}`}
                className="inline-block"
              >
                <Button
                  size="md"
                  variant="contained"
                  color={"orange"}
                  className="flex items-center gap-2  rounded-full"
                >
                  Read symptoms
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
              <div className="flex">
                {symptoms.tags.map((tag, index) => {
                  return (
                    <div
                      key={index}
                      className="rounded-full bg-blue-300 text-white px-3 py-1 font-semibold mr-2"
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default Page;

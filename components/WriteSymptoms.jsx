"use client";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@material-tailwind/react";
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import Select from "react-select";

const CREATE_SYMPTOMS = gql`
  mutation Mutation($input: CreateSymptomsInput!) {
    createSymptoms(input: $input) {
      message
      success
    }
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

export const options = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
  { value: "blue", label: "Blue", color: "#0052CC", isDisabled: true },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630", isFixed: true },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

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

export default function WriteSymptoms(props) {
  const [createSymptoms] = useMutation(CREATE_SYMPTOMS);

  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const [species, setSpecies] = React.useState("");
  const [tagOptions, setTagOptions] = React.useState([]);

  const [searchSymptomsTags] = useLazyQuery(SEARCH_SYMPTOMS_TAGS);

  const editorRef = useRef(null);
  const log = async () => {
    if (title === "" || species === "" || tags.length === 0) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Fields cannot be empty!",
      });
      return;
    }

    if (editorRef.current && editorRef.current.getContent().length < 10) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Blog content cannot be this much short!",
      });
      return;
    }

    const stringTags = tags.map((value) => {
      return value.value;
    });

    const res = await createSymptoms({
      variables: {
        input: {
          article: editorRef.current.getContent(),
          species: species,
          tags: stringTags,
          title: title,
        },
      },
    });

    await MySwal.fire({
      title: "Success!",
      text: "Symptoms creation successfull. Waiting for approval",
      icon: "success",
      confirmButtonText: "Ok",
    });

    window.location.href = `/vet/symptoms/` + res.data.createSymptoms.message;
  };

  return (
    <div className={"text-center mb-10"}>
      <h1 className={"text-2xl text-semi-blue mb-6"}> Write Symptoms </h1>

      <div className="flex mb-5 gap-5">
        <TextField
          variant="outlined"
          label="Title"
          onChange={(e) => setTitle(e.target.value)}
          className="w-[300px]"
        />
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
                console.log(res.data.searchSymptomsTags);

                const fetchedTags = [];
                res.data.searchSymptomsTags.map((symptom) => {
                  fetchedTags.push({
                    value: symptom.Symptom,
                    label: symptom.Symptom,
                    color: "#666666",
                  });
                });

                console.log(fetchedTags);

                setTagOptions(fetchedTags);

                // res.data.searchSymptomsTags.
              });
            }}
            styles={customStyles}
          />
        </div>

        {/* <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={medicines}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    variant="standard"
                    {...params}
                    {...register(`medicines.${index}.name`, {
                      onChange: async (e) => {
                        const { data } = await searchDrug({
                          variables: { query: e.target.value },
                        });
                        const fetchedMedicines = [];
                        data.searchDrug.map((drug) => {
                          fetchedMedicines.push(drug.Drug);
                        });
                        setMedicines(fetchedMedicines);
                      },
                    })}
                    className="w-[300px]"
                  />
                )}
              /> */}
      </div>

      <Editor
        id={"MY_FIXED_ID"}
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>Start writing your blog</p>"
        init={{
          height: 440,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          imagetools_toolbar:
            "rotateleft rotateright | flipv fliph | editimage imageoptions",
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | link image | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
        }}
      />
      <Button onClick={log} color={"orange"} className={"mt-10"}>
        Create
      </Button>
    </div>
  );
}

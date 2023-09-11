"use client";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@material-tailwind/react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CREATE_SYMPTOMS = gql`
mutation Mutation($input: CreateSymptomsInput!) {
    createSymptoms(input: $input) {
      message
      success
    }
  }
`;

export default function WriteSymptoms(props) {
  const [createSymptoms] = useMutation(CREATE_SYMPTOMS);

  const [title, setTitle] = React.useState("");
const [tags, setTags] = React.useState("");
  const [species, setSpecies] = React.useState("");

  const editorRef = useRef(null);
  const log = async () => {
    if (title === "") {
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

    const res = await createSymptoms({
      variables: {
        input: {
            "article": editorRef.current.getContent(),
            "species": species,
            "tags": tags,
            "title": title,
        },
      },
    });

    await MySwal.fire({
      title: "Success!",
      text: res.data.createBlog.message,
      icon: "success",
      confirmButtonText: "Ok",
    });

    window.location.href = `/vet/symptoms/${props.symptoms_id}`;
  };
  return (
    <div className={"text-center mb-10"}>
      <h1 className={"text-2xl text-semi-blue mb-6"}> Write Symptoms </h1>

<div className="flex mb-5 gap-5">


      <input
        className={"border border-w-2 border-gray-400 p-2.5 rounded-lg mb-6 w-[350px]"}
        placeholder={"Title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />



<Autocomplete
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
              />



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

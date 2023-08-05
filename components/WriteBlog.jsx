"use client";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "@material-tailwind/react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Cookies from "js-cookie";

const MySwal = withReactContent(Swal);

const CREATE_BLOG = gql`
  mutation CreateBlog($input: CreateBlogInput!) {
    createBlog(input: $input) {
      message
    }
  }
`;

export default function WriteBlog() {
  const [CreateBlog, { data, loading, error }] = useMutation(CREATE_BLOG);

  const [title, setTitle] = React.useState("");

  const editorRef = useRef(null);
  const log = async () => {
    if (title === "") {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Title cannot be empty!",
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

    const res = await CreateBlog({
      variables: {
        input: {
          title: title,
          body: editorRef.current.getContent(),
        },
      },
    });

    await MySwal.fire({
      title: "Success!",
      text: res.data.createBlog.message,
      icon: "success",
      confirmButtonText: "Ok",
    });

    const role = JSON.parse(Cookies.get("user")).role.toLowerCase();
    window.location.href = `/${role}/blogs`;
  };
  return (
    <div className={"text-center mb-10"}>
      <h1 className={"text-2xl text-semi-blue mb-6"}> Write Blog </h1>

      <input
        className={"border border-gray-800 p-2.5 rounded-lg mb-6 w-[350px]"}
        placeholder={"Title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

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

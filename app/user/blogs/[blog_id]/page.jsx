"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Avatar, Typography } from "@material-tailwind/react";

const GET_BLOG = gql`
  query GetBlogById($getBlogByIdId: String!) {
    getBlogById(id: $getBlogByIdId) {
      author {
        avatar
        name
        role
        email
      }
      body
      title
    }
  }
`;

function Page(props) {
  const { loading, error, data } = useQuery(GET_BLOG, {
    variables: { getBlogByIdId: props.params.blog_id },
  });
  if (loading) return <p>Loading...</p>;
  return (
    <div className={""}>
      <h1 className={"text-3xl text-center text-semi-blue mb-4 font-semibold"}>
        {data.getBlogById.title}
      </h1>

      <div className={"flex flex-col items-center mb-10"}>
        <Avatar
          src="/assets/user.png"
          alt="avatar"
          withBorder={true}
          className="p-0.5 mb-2"
        />
        <Typography>
          {data.getBlogById.author.name} | {data.getBlogById.author.role}
        </Typography>
      </div>

      <div dangerouslySetInnerHTML={{ __html: data.getBlogById.body }} />
    </div>
  );
}

export default Page;

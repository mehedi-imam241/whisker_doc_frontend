"use client";
import React from "react";
import { gql, useQuery } from "@apollo/client";
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

const GET_BLOGS = gql`
  query Query($take: Float!, $skip: Float!) {
    getBlogs(take: $take, skip: $skip) {
      author {
        name
        role
      }
      _id
      title
    }
  }
`;

const PAGE_COUNT = gql`
  query CountPage {
    countPages
  }
`;

function Page(props) {
  const [skip, setSkip] = React.useState(0);

  const { data: dataPageCount } = useQuery(PAGE_COUNT);

  const { loading, error, data } = useQuery(GET_BLOGS, {
    variables: { take: 10, skip: skip },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <div className={""}>
      <Link
        href={"/user/blogs/create"}
        className={"flex justify-center items-center"}
      >
        <ButtonCustom className={""}>Create Blog</ButtonCustom>
      </Link>

      {data && data.getBlogs.length === 0 && <h1>No blogs found</h1>}
      {data &&
        data.getBlogs.map((blog, index) => {
          return (
            // <div key={index}>
            //   <h1>{blog.title}</h1>
            //   <p>{blog.body}</p>
            //   <p>{blog.author.name}</p>
            //   <p>{blog.author.role}</p>
            // </div>

            <Card key={index} className="mt-6">
              <CardBody>
                <div className={"flex justify-between"}>
                  <div>
                    <MdPets className="text-4xl text-semi-blue mb-5" />
                    <Typography variant="h5" color="blue-gray" className="mb-2">
                      {blog.title}
                    </Typography>
                  </div>

                  <div className={"flex flex-col items-center"}>
                    <Avatar
                      src="/assets/user.png"
                      alt="avatar"
                      withBorder={true}
                      className="p-0.5 mb-2"
                    />
                    <Typography>
                      {blog.author.name} | {blog.author.role}
                    </Typography>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="pt-0">
                <Link href={`/user/blogs/${blog._id}`} className="inline-block">
                  <Button
                    size="sm"
                    variant="text"
                    color={"orange"}
                    className="flex items-center gap-2"
                  >
                    Read Blog
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
              </CardFooter>
            </Card>
          );
        })}

      <div className={"my-10"}>
        <Pagination
          count={dataPageCount.countPages}
          color="primary"
          onChange={(e) => {
            setSkip(e.target.innerText * 10 - 10);
          }}
        />
      </div>
    </div>
  );
}

export default Page;

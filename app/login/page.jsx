"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user";

const MySwal = withReactContent(Swal);

const LOGIN = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        _id
        avatar
        email
        name
        role
      }
    }
  }
`;

function Page(props) {
  const [Login, { data, loading, error }] = useMutation(LOGIN);
  const { push } = useRouter();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (form_data) => {
    try {
      const { data } = await Login({
        variables: {
          loginInput: {
            ...form_data,
          },
        },
      });

      Cookies.set("accessToken", data.login.accessToken);
      Cookies.set("user", JSON.stringify(data.login.user));

      dispatch(setUser(data.login.user));

      if (data.login.user.role === "USER") {
        await push("/user");
      } else if (data.login.user.role === "VET") {
        await push("/vet");
      } else {
        await push("/admin");
      }
    } catch (e) {
      console.log(e);
      await MySwal.fire({
        title: "Error!",
        text: "Something went wrong",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="" src="/assets/logo.png" alt="logo" width={250} />
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className={"text-red-500 text-left text-sm mt-1"}>
                    {errors.email?.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className={"text-red-500 text-left text-sm mt-1"}>
                    {errors.password?.message}
                  </p>
                )}
              </div>
              {/*<div className="flex items-center justify-between">*/}
              {/*  <div className="flex items-start">*/}
              {/*    <div className="flex items-center h-5">*/}
              {/*      <input*/}
              {/*        id="remember"*/}
              {/*        aria-describedby="remember"*/}
              {/*        type="checkbox"*/}
              {/*        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"*/}
              {/*        required=""*/}
              {/*      />*/}
              {/*    </div>*/}
              {/*    <div className="ml-3 text-sm">*/}
              {/*      <label*/}
              {/*        htmlFor="remember"*/}
              {/*        className="text-gray-500 dark:text-gray-300"*/}
              {/*      >*/}
              {/*        Remember me*/}
              {/*      </label>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*  <a*/}
              {/*    href="#"*/}
              {/*    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"*/}
              {/*  >*/}
              {/*    Forgot password?*/}
              {/*  </a>*/}
              {/*</div>*/}
              <button
                type="submit"
                className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;

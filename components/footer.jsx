"use client";
import React from "react";
import world from "@/public/assets/language 1.webp";
import logo from "@/app/favicon.ico";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { Router } from "next/router";

function Footer(props) {
  const pathName = usePathname();
  const changeLanguage = () => {
    return pathName.replace("/en", "/he");
  };
  return (
    <footer className={"mt-24 font-poppins text-sm font-medium "}>
      <hr className={"border-gray-600 mx-5 lg:mx-10 "} />
      <div
        className={
          "flex flex-row items-center justify-around md:justify-between mx-5 lg:mx-10 my-10"
        }
      >
        <Menu>
          <MenuHandler>
            <Button
              variant={"text"}
              color={"orange"}
              className={"text-gray-900 flex items-center"}
            >
              <img
                src={"/assets/language 1.webp"}
                alt={"language icon"}
                width={25}
                height={25}
              />
              <span className={"ml-2"}>English</span>
            </Button>
          </MenuHandler>
          <MenuList>
            <MenuItem>English</MenuItem>
            <Link href={changeLanguage()}>
              <MenuItem>Hebrew</MenuItem>
            </Link>
          </MenuList>
        </Menu>
        <div className={"hidden md:flex flex-col items-center justify-center "}>
          <span className={"text-gray-800"}>
            <Link
              href={"/en/privacy-policy"}
              hrefLang={"en"}
              className={"hover:text-primary"}
            >
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link
              href={"/en/terms-conditions"}
              hrefLang={"en"}
              className={"hover:text-primary"}
            >
              Terms & Conditions
            </Link>
          </span>
          <span className={"text-gray-800"}>
            © All Right Reserved - Mimiplan.com
          </span>
        </div>

        <div className={"flex items-center gap-x-3"}>
          <img
            src={"/assets/mimi_logo_no_text.webp"}
            alt={"Mimiplan logo"}
            width={40}
            height={40}
          />
          <div>
            <div className={"text-gray-900 mb-[-2px]"}>Mimi</div>
            <div className={"text-gray-900"}>New way of Education</div>
          </div>
        </div>
      </div>

      <div
        className={
          "flex md:hidden flex-col items-center justify-center mb-16 text"
        }
      >
        <span className={"text-gray-800"}>
          <Link
            href={"/en/privacy-policy"}
            hrefLang={"en"}
            className={"hover:text-primary"}
          >
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link
            href={"/en/terms-conditions"}
            hrefLang={"en"}
            className={"hover:text-primary"}
          >
            Terms & Conditions
          </Link>
        </span>
        <span className={"text-gray-800"}>
          © All Right Reserved - Mimiplan.com
        </span>
      </div>
    </footer>
  );
}

export default Footer;

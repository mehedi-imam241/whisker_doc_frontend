"use client";

import React, { useState, useEffect } from "react";
import {
  Navbar,
  IconButton,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import Link from "next/link";
import ButtonCustom from "@/components/Button";
import { MdCancel } from "react-icons/md";

const navLinks = [
  { title: "Home", link: "/en", hreflang: "en" },
  { title: "FAQ", link: "/en/faq", hreflang: "en" },
  { title: "About Us", link: "/en/about-us", hreflang: "en" },
  { title: "Contact Us", link: "/en/contact-us", hreflang: "en" },
];

export default function CustomNavbar() {
  const [openNav, setOpenNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 654 && setOpenNav(false),
    );

    window.onscroll = function () {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
  }, []);

  const navList = (
    <ul className="  mb-4 mt-2 flex flex-col  lg:my-0 lg:flex-row lg:justify-between lg:items-center lg:gap-x-14 ">
      {navLinks.map((link, index) => (
        <li key={index}>
          <Link
            href={link.link}
            hrefLang={link.hreflang}
            className={`text-lg md:text-xl  text-color-navbar  hover:text-primary-dark transition-all`}
            onClick={() => setOpenNav(false)}
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  const handleOpenMenu = () => {
    setOpenNav(!openNav);
  };
  const renderDialogue = () => {
    return (
      <Dialog
        open={openNav}
        handler={handleOpenMenu}
        size={"lg"}
        className={"bg-transparent shadow-none "}
      >
        <DialogBody>
          <div className={"relative"}>
            <img
              src={"/assets/cloud.webp"}
              alt={"cloud"}
              width={1000}
              height={1000}
              className={"h-[110%] float-center"}
            />

            <MdCancel
              size={"32"}
              className={"text-white absolute top-[-.7rem] right-[-.7rem]"}
              onClick={handleOpenMenu}
            />

            <ul className="flex flex-col justify-center h-[75%] gap-5 text-2xl text-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[55%]">
              {navList}
              <a
                href={"https://web.mimiplan.com"}
                rel={"noreferrer"}
                className={"mt-[-20px]"}
              >
                <ButtonCustom className="w-full ">Login</ButtonCustom>
              </a>
            </ul>
          </div>
        </DialogBody>
      </Dialog>
    );
  };

  return (
    <Navbar
      className={`fixed left-1/2 -translate-x-1/2 top-0 py-2 px-4 lg:px-8 lg:py-4 font-roboto text-lg mb-5 bg-white  max-w-full z-[1000] ${
        scrolled ? " shadow-lg " : "shadow-none"
      } `}
    >
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900 ">
        <Link href={"/en"} hrefLang={"en"}>
          <img
            src={"/assets/mimi_logo_no_text.webp"}
            alt={"Mimiplan Logo"}
            width={60}
            height={60}
          />
        </Link>

        <div className="hidden lg:block">{navList}</div>
        <a
          href={"https://web.mimiplan.com"}
          rel={"noreferrer"}
          className="hidden lg:block"
        >
          <ButtonCustom>Login</ButtonCustom>
        </a>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      {renderDialogue()}
    </Navbar>
  );
}

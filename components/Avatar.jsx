"use client";

import React from "react";

import { Avatar } from "@material-tailwind/react";

export default function MyAvatar({ src = null, pet = false, size = "300px" }) {
  return (
    <Avatar
      alt="avatar"
      src={src ? src : pet ? "/assets/pet.svg" : "/assets/user.png"}
      className={`border border-primary ring-2 ring-primary`}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}

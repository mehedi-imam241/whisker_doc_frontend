"use client";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import PetSection from "@/app/user/section/pet.section";

function Page(props) {
  const [user, setUser] = React.useState(null);
  useEffect(() => {
    // setUser(JSON.parse(Cookies.get("user")));
    // console.log(Cookies.get("accessToken"));
    // console.log(JSON.parse(Cookies.get("user")));
  }, []);

  return (
    <div>
      <PetSection />
    </div>
  );
}

export default Page;

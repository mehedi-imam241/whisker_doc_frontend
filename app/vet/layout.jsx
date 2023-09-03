"use client";
import CustomNavbar from "@/components/Navbar_VET";
import Footer from "@/components/footer";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/user";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
    console.log(user);
  }, []);

  return (
    <section>
      <CustomNavbar />
      <div className={"mt-24"} />
      {children}
      {/*<Footer />*/}
    </section>
  );
}

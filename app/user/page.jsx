"use client";
import React, { useEffect } from "react";
import PetSection from "@/app/user/section/pet.section";
import AppointmentsSection from "@/app/user/section/Appointments.section";

function Page(props) {
  return (
    <div>
      <PetSection />
      <AppointmentsSection />
    </div>
  );
}

export default Page;

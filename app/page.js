import { redirect } from "next/navigation";

export const metadata = {
  title: "Whisker Docs",
  description: "The complete treatment for your pet's health",
};

export default function Home() {
  redirect("/login");
}

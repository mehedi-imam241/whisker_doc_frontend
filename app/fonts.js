import { Roboto, Roboto_Condensed, Poppins, Rubik } from "next/font/google";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const roboto_condensed = Roboto_Condensed({
  weight: "400",
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

export const poppins = Poppins({
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const rubik = Rubik({
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-rubik",
  subsets: ["latin"],
});

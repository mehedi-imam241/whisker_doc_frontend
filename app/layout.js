import "./globals.css";
import { poppins, roboto, roboto_condensed, rubik } from "@/app/fonts";

export const metadata = {
  title: "Whisker Docs",
  description: "Home service",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${roboto_condensed.variable} ${poppins.variable} ${rubik.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

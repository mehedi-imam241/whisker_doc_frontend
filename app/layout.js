import "./globals.css";
import { poppins, roboto, roboto_condensed, rubik } from "@/app/fonts";
import GraphQLWrapper from "@/app/graphql_wrapper";

const metadata = {
  title: "Whisker Docs",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${roboto_condensed.variable} ${poppins.variable} ${rubik.variable}`}
    >
      <body className={"mx-5"}>
        <GraphQLWrapper>{children}</GraphQLWrapper>
      </body>
    </html>
  );
}

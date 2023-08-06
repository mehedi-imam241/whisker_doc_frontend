import CustomNavbar from "@/components/Navbar";
import Footer from "@/components/footer";
import Script from "next/script";

export const metadata = {
  title: "My Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <section>
      <CustomNavbar />
      <div className="mt-32" />
      {children}
      {/*<Footer />*/}
    </section>
  );
}

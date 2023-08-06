import CustomNavbar from "@/components/Navbar_VET";
import Footer from "@/components/footer";

export default function DashboardLayout({ children }) {
  return (
    <section>
      <CustomNavbar />
      <div className={"mt-24"} />
      {children}
      {/*<Footer />*/}
    </section>
  );
}

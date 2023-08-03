import CustomNavbar from "@/components/Navbar";
import Footer from "@/components/footer";

export default function DashboardLayout({ children }) {
  return (
    <section>
      <CustomNavbar />
      {children}
      {/*<Footer />*/}
    </section>
  );
}

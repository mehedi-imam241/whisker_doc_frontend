import CustomNavbar from "@/components/Navbar";


export default function DashboardLayout({
                                            children, // will be a page or nested layout
                                        }) {
    return (
        <section>
            {/* Include shared UI here e.g. a header or sidebar */}
            <CustomNavbar/>

            {children}
        </section>
    )
}
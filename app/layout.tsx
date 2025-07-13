import ClientOnly from "@/components/ClientOnly";
import Footer from "@/components/Footer";
import ToastContainerBar from "@/components/ToastContainerBar";
import LoginModal from "@/components/models/LoginModal";
import RegisterModal from "@/components/models/RegisterModal";
import RentModal from "@/components/models/RentModal";
import SearchModal from "@/components/models/SearchModal";
import Navbar from "@/components/navbar/Navbar";
import { Nunito } from "next/font/google";
import "../styles/globals.css";
import getCurrentUser from "./actions/getCurrentUser";
import GoogleMapsProvider from "@/components/GoogleMapsProvider";
import ContactSupportModal from "../components/models/ContactSupportModal";
export const metadata = {
  title: "TripleOne",
  description: "TripleOne",
  icons: "https://img.icons8.com/?size=100&id=ZblEpxMTnnq4&format=png&color=000000",
};

// ✅ Airbnb-style font setup
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" className={nunito.variable}>
      <body className="font-sans bg-[#f7f7f7] text-neutral-800">
        <GoogleMapsProvider>
           <ContactSupportModal />
          <ClientOnly>
            <ToastContainerBar />
            <SearchModal />
            <RegisterModal />
            <LoginModal />
            <RentModal />
            <Navbar currentUser={currentUser} />
          </ClientOnly>
        </GoogleMapsProvider>
         <div className="pb-20 pt-28 px-4 sm:px-6 lg:px-8">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

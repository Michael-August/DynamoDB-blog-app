import NavBar from "@/components/NavBar";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Ewere",
};

export default function AuthLayout({ children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="container mx-auto bg-[#f7fbff]">

                <ToastContainer
                    position="top-center"
                    closeButton={true}
                />
                <NavBar />
                <div className="flex justify-center items-center mt-20 px-2 md:px-4">
                    {children}
                </div>
            </body>
        </html>
    );
}
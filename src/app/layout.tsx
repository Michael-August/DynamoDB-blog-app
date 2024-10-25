import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";import Footer from "@/components/Footer";
;

export const metadata: Metadata = {
  title: "Ewere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="container mx-auto bg-[#f7fbff]">
        <NavBar />
        <div className="mt-20 px-2 md:px-4">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

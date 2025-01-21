"use client"

import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import { GoogleAnalytics } from 'nextjs-google-analytics';
import Script from 'next/script';

import 'react-toastify/dist/ReactToastify.css';
import AdComponent from '@/components/AdsenseSlot';
import authorImage from "@/public/images/author-image.jpg"

import {motion} from "framer-motion"
import SideBar from '@/components/SideBar';
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: "Home for all DevOps, AWS and Cloud-native Content",
};

export default function MainRootLayout({ children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Home for all DevOps, AWS and Cloud-native Content"
        />
        <meta name="robots" content="index" />
        <meta
          name="image"
          content={`https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.teknopk.com%2Fwp-content%2Fuploads%2F2018%2F03%2Fblogging.jpg&f=1&nofb=1&ipt=511e91539d4619a40bf3ecd14fa546fc5f2c7dbbf8231b5e8a870eac9eb988bc&ipo=images`}
          key="ogimage"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`ewere.tech`}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={`"Home for all DevOps, AWS and Cloud-native Content"`}
          key="ogdesc"
        />
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4182955591624539"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics Scripts */}
        {/* <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-W7QZT1RWGW`}
        /> */}
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-W7QZT1RWGW', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="container mx-auto bg-[#f7fbff]">
        <GoogleAnalytics gaMeasurementId="G-W7QZT1RWGW" trackPageViews />
        <ToastContainer
            position="top-center"
            closeButton={true}
        />
        <NavBar />
        <div className='flex flex-col mt-20 px-2 md:px-4 md:gap-5'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Breadcrumb />
          </motion.div>
          <div className="">
            <div className="">
              {children}
            </div>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
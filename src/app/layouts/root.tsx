"use client"

import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import { GoogleAnalytics } from 'nextjs-google-analytics';
import Script from 'next/script';

import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react"

import {motion} from "framer-motion"
import SideBar from '@/components/SideBar';
import { usePathname } from 'next/navigation';

export default function MainRootLayout({ children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      <body className="container mx-auto bg-white">
        <GoogleAnalytics gaMeasurementId="G-W7QZT1RWGW" trackPageViews />
        <Analytics />
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
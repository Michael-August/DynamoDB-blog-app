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

import {motion} from "framer-motion"
import SideBar from '@/components/SideBar';
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: "Home for all DevOps, AWS and Cloud-native Content",
};

export default function MainRootLayout({ children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4182955591624539"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Analytics Scripts */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-W7QZT1RWGW`}
        />
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
          <div className="flex flex-col md:flex-row gap-5">
            <div className="md:flex-[8]">
              {children}
            </div>
            <div className='md:flex-[2] flex flex-col gap-4'>
              <AdComponent adSlot={''} />
              {pathname !== '/' && <SideBar />}
            </div>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import { GoogleAnalytics } from 'nextjs-google-analytics';
import Script from 'next/script';

import 'react-toastify/dist/ReactToastify.css';
import AdComponent from '@/components/AdsenseSlot';

export const metadata: Metadata = {
  title: "Ewere",
};

export default function MainRootLayout({ children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-W7QZT1RWGW"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

      </head>
      <body className="container mx-auto bg-[#f7fbff]">
        <GoogleAnalytics trackPageViews />
        <ToastContainer
            position="top-center"
            closeButton={true}
        />
        <NavBar />
        <div className='flex flex-col mt-20 px-2 md:px-4 md:gap-5'>
          <Breadcrumb />
          <div className="flex flex-col-reverse md:flex-row">
            <div className="md:flex-[8]">
              {children}
            </div>
            <div className='md:flex-[2]'>
              <AdComponent adSlot={''} />
            </div>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
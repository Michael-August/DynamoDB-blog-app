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
  title: "Home for all DevOps, AWS and Cloud-native Content",
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
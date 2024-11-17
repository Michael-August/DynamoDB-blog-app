import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Ewere",
};

export default function MainRootLayout({ children,
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
        <div className="flex flex-col-reverse md:flex-row mt-20 px-2 md:px-4 md:gap-5">
          <div className="md:flex-[8]">
            {children}
          </div>
          <div className='md:flex-[2]'>
            
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
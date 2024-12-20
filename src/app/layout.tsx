import 'react-toastify/dist/ReactToastify.css';

import "./globals.css"
import { usePathname } from "next/navigation";
import AuthLayout from "./layouts/auth";
import MainRootLayout from "./layouts/root";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const pathname = typeof window === "undefined" ? "" : window.location.pathname;
  
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return (
      <AuthLayout>
        {children}
      </AuthLayout>
    );
  }

  return (
    <MainRootLayout>
      {children}
    </MainRootLayout>
  );
}

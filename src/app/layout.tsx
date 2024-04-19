import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import "./globals.css";
import { Menu } from "@/components/menu";
import { UserInfo } from "@/components/user";
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quikdev",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <div className="min-h-screen max-w-[85dvw] m-auto flex flex-col">
          <AuthProvider>
            <header className="min-h-[200px] flex items-center justify-center">
              <Link href={ "/" }><Image src={ "/logo.svg" } width={ 300 } height={ 75 } alt="Quikdev Blog" className="text-7xl" /></Link>
            </header>
            <div className="flex items-center justify-center">
              <div className="flex flex-row gap-4 flex-1">
                <Menu />
                <UserInfo />
              </div>
            </div>
            <div className="flex-1 flex py-4">
              {children}
            </div>
          </AuthProvider>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}

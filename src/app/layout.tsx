import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import Image from "next/image";
import Link from "next/link";
import { Sign } from "@/components/sign";

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
      <head>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen max-w-[85dvw] m-auto flex flex-col">
          <Provider>
            <header className="min-h-[200px] flex items-center justify-center">
              <Link href={ "/" }><Image src={ "/logo.svg" } width={ 300 } height={ 75 } alt="Quikdev Blog" className="text-7xl" /></Link>
            </header>
            <div className="flex items-center justify-center"><Sign /></div>
            <div className="flex-1 flex py-4">
              {children}
            </div>
          </Provider>
        </div>
      </body>
    </html>
  );
}

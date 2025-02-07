import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MainNav from "@/components/navigation/MainNav";
import ClientProviders from "@/components/providers/ClientProviders";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "A modern blog platform built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <ClientProviders>
          <MainNav />
          <main>{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}

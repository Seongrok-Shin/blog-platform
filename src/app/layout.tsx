import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/navigation/Nav";
import Footer from "@/components/Footer";
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
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}

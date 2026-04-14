import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MarineContextProvider } from "./context/marineContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marineford Monitoring System",
  description: "Real-time Fleet & Incident Tracking",
  icons: {
    icon: "/anchor.png", 
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden`}
      >
        <MarineContextProvider >
        {children}
        </MarineContextProvider>
      </body>
    </html>
  );
}

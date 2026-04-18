import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import { getServerSession } from "next-auth";
import NextAuthProvider from "@/provider/NextAuthProvider";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";


const PlayfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DinoPing",
  description: "Elevate every occasion with a table tailored to your standards.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const nextAuthSession = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={`${PlayfairDisplay.variable}`}>
        <NextAuthProvider session={nextAuthSession}>
          <TopMenu/>
          {children}
          </NextAuthProvider>
        </body>
    </html>
  );
}

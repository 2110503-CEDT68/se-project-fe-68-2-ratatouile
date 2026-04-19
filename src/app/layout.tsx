import type { Metadata } from "next";
import "./globals.css";
import "./design-system.css";
import TopMenu from "@/components/TopMenu";
import { getServerSession } from "next-auth";
import NextAuthProvider from "@/provider/NextAuthProvider";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

export const metadata: Metadata = {
  title: "DinoPing",
  description:
    "Elevate every occasion with a table tailored to your standards.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nextAuthSession = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextAuthProvider session={nextAuthSession}>
          <TopMenu session={nextAuthSession} />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}

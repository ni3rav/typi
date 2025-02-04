import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "TyPi",
  description: "A simple single player and multiplayer typing game",
};

const fonts = Roboto_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fonts.className} antialiased`}>{children}</body>
    </html>
  );
}

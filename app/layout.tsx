import type { Metadata } from "next";
import "./globals.css";
import { Space_Mono } from "next/font/google";

export const metadata: Metadata = {
  title: "TyPi",
  description: "A simple single player and multiplayer typing game",
};

const fonts = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

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

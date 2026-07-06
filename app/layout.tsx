import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Quicksand } from "next/font/google";
import { AppShell } from "./components/app-shell";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Kairos",
  description: "A polished app shell with persistent navigation."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.className}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

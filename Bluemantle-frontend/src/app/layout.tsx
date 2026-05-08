import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { DNABackground } from "@/components/DNABackground";
import { SecurityGuard } from "@/components/SecurityGuard";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Academic Atelier - Bluemantle",
  description: "Ultra-Premium eLearning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} font-inter antialiased bg-surface text-on_surface`}>
        <SecurityGuard>
          <DNABackground />
          {children}
        </SecurityGuard>
      </body>
    </html>
  );
}

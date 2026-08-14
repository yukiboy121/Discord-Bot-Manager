import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentinel Bot — Advanced Discord Security & Management",
  description: "Professional Discord security bot with anti-spam, anti-raid, anti-nuke protection, moderation, and a complete web dashboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f1117] text-gray-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

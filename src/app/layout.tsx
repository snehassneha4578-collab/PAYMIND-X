import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAYMIND X | AI Commerce Intelligence",
  description: "Think smarter. Shop wiser. Pay confidently. An AI-powered commerce and payment intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

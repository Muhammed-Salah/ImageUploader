import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Showcase | Premium Display",
  description: "A simple Next.js app to display high-quality images.",
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

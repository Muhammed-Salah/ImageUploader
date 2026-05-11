import type { Metadata, Viewport } from "next";
import { list } from "@vercel/blob";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch the latest blob to use as the share image
  const { blobs } = await list();
  const latestImage = blobs[0];
  const shareImage = latestImage?.url || "/og-image.png";

  return {
    title: "Image Showcase | Premium Display",
    description: "A minimal, high-performance image management and showcase application.",
    keywords: ["image", "uploader", "showcase", "minimal", "nextjs"],
    authors: [{ name: "MHM" }],
    icons: {
      icon: "/icon.svg",
      apple: "/icon.svg",
    },
    openGraph: {
      title: "Image Showcase",
      description: "Secure and minimal image display platform.",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: "Current Showcase Image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Image Showcase",
      description: "Secure and minimal image display platform.",
      images: [shareImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { list } from "@vercel/blob";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch the latest blobs and find the thumbnail
  const { blobs } = await list();
  const thumbnail = blobs.find(b => b.pathname.startsWith("thumb-"));
  const original = blobs.find(b => b.pathname.startsWith("original-"));
  
  // Use thumbnail for sharing, fallback to original or default
  const shareImage = thumbnail?.url || original?.url || "/og-image.png";

  return {
    metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
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

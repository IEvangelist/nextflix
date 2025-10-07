import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nextflix.vercel.app'),
  title: "NEXTFLIX - Netflix Clone",
  description: "A Netflix clone built with Next.js, TypeScript, and TMDB API featuring movie browsing, search, and video playback.",
  keywords: ["netflix", "movies", "streaming", "entertainment", "nextjs", "react"],
  authors: [{ name: "Netflix Clone Team" }],
  creator: "Netflix Clone",
  publisher: "Netflix Clone",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextflix.vercel.app",
    title: "NEXTFLIX - Netflix Clone",
    description: "Stream movies and TV shows with our Netflix-inspired streaming platform",
    siteName: "NEXTFLIX",
    images: [
      {
        url: "/details.png",
        width: 1200,
        height: 630,
        alt: "NEXTFLIX - Stream movies and TV shows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXTFLIX - Netflix Clone",
    description: "Stream movies and TV shows with our Netflix-inspired streaming platform",
    images: ["/details.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-black text-white`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

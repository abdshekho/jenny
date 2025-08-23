import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration"
import "./globals.css"

export const metadata: Metadata = {
  title: "Al Baik Restaurant Menu",
  description: "Digital menu for Al Baik Restaurant - Browse our delicious dishes, specials, and authentic flavors",
  generator: "Next.js",
  applicationName: "Al Baik Menu",
  referrer: "origin-when-cross-origin",
  keywords: ["restaurant", "menu", "food", "Al Baik", "dining", "Arabic cuisine"],
  authors: [{ name: "Al Baik Restaurant" }],
  creator: "Al Baik Restaurant",
  publisher: "Al Baik Restaurant",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://albaik-menu.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Al Baik Restaurant Menu",
    title: "Al Baik Restaurant Menu",
    description: "Digital menu for Al Baik Restaurant - Browse our delicious dishes and specials",
    url: "https://albaik-menu.vercel.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Al Baik Restaurant Menu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Baik Restaurant Menu",
    description: "Digital menu for Al Baik Restaurant - Browse our delicious dishes and specials",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Al Baik Menu",
    startupImage: [
      "/apple-touch-startup-image-768x1004.png",
      {
        url: "/apple-touch-startup-image-1536x2008.png",
        media: "(device-width: 768px) and (device-height: 1024px)",
      },
    ],
  },
  verification: {
    google: "google-site-verification-token",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#15803d" },
    { media: "(prefers-color-scheme: dark)", color: "#15803d" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Al Baik Menu" />

        {/* Microsoft-specific meta tags */}
        <meta name="msapplication-TileColor" content="#15803d" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Additional PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Al Baik Menu" />

        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}

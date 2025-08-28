import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration"
import { CartProvider } from "@/lib/cart-context"
import { LanguageProvider } from "@/lib/language-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "JENNY'S BURGER",
  description: "Digital menu for Jenny's Burger Restaurant - Browse our delicious dishes, specials, and authentic flavors",
  generator: "Next.js",
  applicationName: "Jenny's Burger Menu",
  referrer: "origin-when-cross-origin",
  keywords: ["restaurant", "menu", "food", "Jenny's Burger", "dining", "Arabic cuisine"],
  authors: [{ name: "Jenny's Burger Restaurant" }],
  creator: "Jenny's Burger Restaurant",
  publisher: "Jenny's Burger Restaurant",
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
    siteName: "Jenny's Burger Restaurant Menu",
    title: "Jenny's Burger Restaurant Menu",
    description: "Digital menu for Jenny's Burger Restaurant - Browse our delicious dishes and specials",
    url: "https://albaik-menu.vercel.app",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jenny's Burger Restaurant Menu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jenny's Burger Restaurant Menu",
    description: "Digital menu for Jenny's Burger Restaurant - Browse our delicious dishes and specials",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jenny's Burger Menu",
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
        <link rel="icon" href="/logo3.webp" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-logo3.webp" />

        {/* Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jenny's Burger Menu" />

        {/* Microsoft-specific meta tags */}
        <meta name="msapplication-TileColor" content="#15803d" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Additional PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Jenny's Burger Menu" />

        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <LanguageProvider>
          <CartProvider>
            {children}
            <ServiceWorkerRegistration />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

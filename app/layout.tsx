import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ServiceWorkerRegistration } from "../components/pwa/service-worker-registration"
import { CartProvider } from "../lib/cart-context"
import { LanguageProvider } from "../lib/language-context"
import { Toaster } from "sonner"
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
  metadataBase: new URL("https://jenny-burger.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Jenny's Burger",
    title: "Jenny's Burger Restaurant Menu",
    description: "Digital menu for Jenny's Burger Restaurant - Browse our delicious dishes and specials",
    url: "https://jenny-burger.vercel.app",
    images: [
      {
        url: "/logo.webp",
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
    images: ["/logo.webp"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jenny's Burger Menu",
    startupImage: [
      {
        url: "/icon/maskable_icon_x512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icon/maskable_icon_x512.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/icon/maskable_icon_x512.png",
        media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/icon/maskable_icon_x512.png",
        media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  verification: {
    google: "google-site-verification-token",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fece0b" },
    { media: "(prefers-color-scheme: dark)", color: "#fece0b" },
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
        <link rel="icon" href="/logo3.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/icon/maskable_icon_x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon/maskable_icon_x192.png" />

        {/* Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jenny's Burger Menu" />

        {/* Microsoft-specific meta tags */}
        <meta name="msapplication-TileColor" content="#ffcf09" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Additional PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Jenny's Burger Menu" />
        <meta name="theme-color" content="#fece0b" />

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
            <Toaster position="top-right" richColors />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

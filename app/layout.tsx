import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { NavDrawer } from "@/components/layout/NavDrawer"
import { SearchOverlay } from "@/components/layout/SearchOverlay"
import { CartSidebar } from "@/components/layout/CartSidebar"
import { CartInitializer } from "@/components/CartInitializer"
import SessionProvider from "@/components/providers/SessionProvider"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "ANNA PARIS — Quiet Luxury",
    template: "%s | ANNA PARIS",
  },
  description:
    "Express your unique self through the jewelry you choose. Discover diamond rings, gold necklaces, pearl earrings, and more from ANNA PARIS.",
  keywords: [
    "jewelry",
    "luxury jewelry",
    "diamond rings",
    "gold necklaces",
    "pearl earrings",
    "quiet luxury",
  ],
  openGraph: {
    title: "ANNA PARIS — Quiet Luxury",
    description:
      "Express your unique self through the jewelry you choose. Discover diamond rings, gold necklaces, pearl earrings, and more from ANNA PARIS.",
    url: "/",
    siteName: "ANNA PARIS",
    images: [{ url: "/assets/img/logo-anna-paris.png", width: 1200, height: 630, alt: "ANNA PARIS" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANNA PARIS — Quiet Luxury",
    description:
      "Express your unique self through the jewelry you choose. Discover diamond rings, gold necklaces, pearl earrings, and more from ANNA PARIS.",
    images: ["/assets/img/logo-anna-paris.png"],
  },
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <CartInitializer />
          <Header />
          <NavDrawer />
          <SearchOverlay />
          <CartSidebar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}


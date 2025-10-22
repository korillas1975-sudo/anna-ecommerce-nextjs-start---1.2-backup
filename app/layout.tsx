import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { NavDrawer } from "@/components/layout/NavDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { CartSidebar } from "@/components/layout/CartSidebar";
import { CartInitializer } from "@/components/CartInitializer";

export const metadata: Metadata = {
  title: "ANNA PARIS – Quiet Luxury",
  description: "Express your unique self through the jewelry you choose. Discover exquisite diamond rings, gold necklaces, pearl earrings, and more from ANNA PARIS.",
  keywords: ["jewelry", "luxury jewelry", "diamond rings", "gold necklaces", "pearl earrings", "quiet luxury"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartInitializer />
        <Header />
        <NavDrawer />
        <SearchOverlay />
        <CartSidebar />
        {children}
      </body>
    </html>
  );
}

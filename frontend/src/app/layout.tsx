import type { Metadata } from "next";
import { Barlow, Libre_Caslon_Text, Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ui",
  display: "swap",
});

const libreCaslonText = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-logo",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Discover Our Products | mettā muse",
    template: "%s | mettā muse",
  },
  description: "Browse curated collections and artisan products at mettā muse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${libreCaslonText.variable} ${inter.variable}`}
    >
      <body className={`${barlow.variable} ${libreCaslonText.variable} ${inter.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

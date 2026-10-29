import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://meun.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MEUN — Verified People. Trusted Homes.",
    template: "%s | MEUN",
  },
  description:
    "MEUN is India's dedicated domestic workforce platform, connecting households and businesses with background-verified maids, cooks, drivers, electricians, plumbers and more.",
  keywords: [
    "verified maid",
    "hire cook India",
    "domestic help booking",
    "verified electrician",
    "household staffing platform",
    "corporate staffing India",
  ],
  openGraph: {
    title: "MEUN — Verified People. Trusted Homes.",
    description:
      "India's dedicated domestic workforce platform. Background-verified professionals, booked in minutes.",
    url: siteUrl,
    siteName: "MEUN",
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={jakarta.variable}>
      <body className="font-sans antialiased bg-paper text-ink">
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 focus:rounded"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

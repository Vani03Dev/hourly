import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { BottomNav } from "../components/layout/BottomNav";
import { ThemeRegistry } from "../components/ThemeRegistry";
import { Toaster } from "react-hot-toast";

import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Sessionly',
    default: 'Sessionly | India\'s Expert Session Booking Marketplace',
  },
  description: "India's expert session booking marketplace. Book verified experts (CAs, lawyers, CTOs, CFOs, HR leads) for 15-60 min paid sessions. Pay per session. No retainer.",
  keywords: ["expert booking marketplace", "hire CA india", "startup lawyers", "fractional CFO", "on-demand CTO", "sessionly", "paid consultations"],
  authors: [{ name: "Sessionly Inc" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sessionly.in",
    title: "Sessionly | India's Expert Session Booking Marketplace",
    description: "Book verified experts (CAs, lawyers, CTOs, CFOs, HR leads) for 15-60 min paid sessions. Pay per session. No retainer.",
    siteName: "Sessionly",
    images: [
      {
        url: "https://sessionly.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sessionly - Expert Session Booking Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sessionly | India's Expert Session Booking Marketplace",
    description: "Book verified experts for 15-60 min paid sessions.",
    creator: "@sessionly",
    images: ["https://sessionly.in/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { NotificationsProvider } from "../contexts/NotificationsContext";
import { ReduxProvider } from "@/store/ReduxProvider";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { CurrencyProvider } from "../contexts/CurrencyContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'B2BBusiness',
    name: 'Sessionly',
    url: 'https://sessionly.in',
    description: "India's expert session booking marketplace. Book verified experts (CAs, lawyers, CTOs, CFOs, HR leads) for 15-60 min paid sessions.",
  };

  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrains.variable}`} data-scroll-behavior="smooth">
      <body className={`flex flex-col min-h-screen ${plusJakarta.className} bg-white text-text-primary antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeRegistry>
          <ReduxProvider>
            <SupabaseProvider>
              <AuthProvider>
                <CurrencyProvider>
                  <NotificationsProvider>
                    <Toaster position="bottom-center" toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '8px' } }} />
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                    <BottomNav />
                  </NotificationsProvider>
                </CurrencyProvider>
              </AuthProvider>
            </SupabaseProvider>
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

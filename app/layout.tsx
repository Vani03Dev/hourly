import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { BottomNav } from "../components/layout/BottomNav";
import { ThemeRegistry } from "../components/ThemeRegistry";
import { Toaster } from "react-hot-toast";

import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ['400'],
  style: ['italic', 'normal'],
  variable: '--font-instrument',
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Hourly',
    default: 'Hourly | B2B Expertise-as-a-Service',
  },
  description: "The premium B2B marketplace to hire the top 1% of vetted Indian professionals (Staff Engineers, Fractional CFOs, Legal Experts) for 60-minute unblocking sessions.",
  keywords: ["B2B expertise", "fractional CFO", "staff engineer consulting", "legal experts india", "Hourly", "corporate micro-consulting"],
  authors: [{ name: "Hourly Inc" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://hourly.app",
    title: "Hourly | B2B Expertise-as-a-Service",
    description: "Unblock your engineering, finance, and legal teams with vetted top 1% Indian professionals in under 60 minutes.",
    siteName: "Hourly",
    images: [
      {
        url: "https://hourly.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hourly - B2B Expertise Procurement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hourly | B2B Expertise-as-a-Service",
    description: "Unblock your teams with vetted top 1% Indian professionals in under 60 minutes.",
    creator: "@hourlyhq",
    images: ["https://hourly.app/og-image.jpg"],
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
    name: 'Hourly',
    url: 'https://hourly.app',
    description: 'The B2B Expertise Procurement Platform. Unblock your engineering, finance, and legal teams with vetted top 1% Indian professionals.',
  };

  return (
    <html lang="en" className={`${inter.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className={`flex flex-col min-h-screen ${inter.className} bg-white text-text-primary`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
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

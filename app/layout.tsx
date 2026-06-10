import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { BottomNav } from "../components/layout/BottomNav";
import { ThemeRegistry } from "../components/ThemeRegistry";
import { Toaster } from "react-hot-toast";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Hourly',
    default: 'Hourly | Rent Expertise by the Hour',
  },
  description: "Peer-to-peer micro-consulting from credentialed professionals. Book 1-on-1 sessions in seconds.",
  keywords: ["micro-consulting", "expert advice", "mentorship", "freelance consultants", "Hourly", "peer-to-peer consulting"],
  authors: [{ name: "Hourly Inc" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hourly.app",
    title: "Hourly | Rent Expertise by the Hour",
    description: "Connect with credentialed professionals for 1-on-1 micro-consulting sessions. Gain insights and accelerate your career.",
    siteName: "Hourly",
    images: [
      {
        url: "https://hourly.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hourly - Rent Expertise by the Hour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hourly | Rent Expertise by the Hour",
    description: "Peer-to-peer micro-consulting from credentialed professionals.",
    creator: "@hourlyapp",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={`flex flex-col min-h-screen ${plusJakartaSans.className}`} style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
        <ThemeRegistry>
          <ReduxProvider>
            <AuthProvider>
              <NotificationsProvider>
                <Toaster position="bottom-center" toastOptions={{ style: { background: '#333', color: '#fff', borderRadius: '8px' } }} />
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <BottomNav />
              </NotificationsProvider>
            </AuthProvider>
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

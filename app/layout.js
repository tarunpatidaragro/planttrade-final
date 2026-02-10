import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "PlantTrade | India's #1 Marketplace for Authentic Nurseries & Plants",
    template: "%s | PlantTrade India"
  },
  description: "Connect directly with trusted plant nurseries across India. Buy exotic plants, fruit trees, flowering shrubs, and gardening supplies from verified growers.",
  keywords: ["plant nursery", "buy plants online india", "gardening", "fruit trees", "indoor plants", "nursery marketplace", "planttrade"],
  openGraph: {
    title: "PlantTrade | Direct from Nurseries to Your Garden",
    description: "Discover thousands of plants from top-rated nurseries in Pune, Bangalore, Kerala, and beyond.",
    url: 'https://planttrade.in',
    siteName: 'PlantTrade',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PlantTrade | Nursery Marketplace",
    description: "Buy plants directly from the best nurseries in India.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

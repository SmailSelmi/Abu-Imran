import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { SplashScreen } from "@/components/SplashScreen";
import { Toaster } from "sonner";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://abu-imran-farm.com'),
  title: {
    default: "أبو عمران | سلالات نادرة ومعدات تفقيس",
    template: "%s | أبو عمران"
  },
  description: "مصدرك الأول للسلالات النادرة والبيض المخصب وأحدث تقنيات التفقيس في الجزائر. توصيل لجميع الولايات.",
  keywords: ["دواجن", "سلالات نادرة", "بيض مخصب", "فقاسات", "الجزائر", "أبو عمران"],
  authors: [{ name: "أبو عمران" }],
  creator: "أبو عمران",
  applicationName: "أبو عمران",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "أبو عمران",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    url: "https://abu-imran-farm.com",
    siteName: "أبو عمران",
    title: "أبو عمران | سلالات نادرة ومعدات تفقيس",
    description: "مصدرك الأول للسلالات النادرة والبيض المخصب وأحدث تقنيات التفقيس في الجزائر.",
    images: [{
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "أبو عمران"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "أبو عمران | سلالات نادرة ومعدات تفقيس",
    description: "أفضل السلالات والمعدات في الجزائر.",
    images: ["/og-image.jpg"]
  },
  alternates: {
    canonical: "https://abu-imran-farm.com"
  },
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192.png",
  }
};

export const viewport = {
    themeColor: "#10b981",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.className} antialiased bg-white dark:bg-zinc-950 min-h-screen flex flex-col`}>
        <ErrorBoundary>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <I18nProvider>
                    <SplashScreen />
                    <Header />
                    <main className="flex-1 pb-20 xl:pb-0">
                        {children}
                    </main>
                    <Footer />
                    <BottomNav />
                    <Toaster richColors position="top-center" />
                </I18nProvider>
            </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}


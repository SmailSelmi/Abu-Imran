import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { RealtimeNotifications } from "@/components/RealtimeNotifications";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://admin.abu-imran-farm.com"),
  title: "أبو عمران | لوحة التحكم",
  description: "نظام إدارة متجر أبو عمران لتربية الدواجن ومعداتها",
  applicationName: "أبو عمران أدمين",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "أبو عمران أدمين",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/AbuImranLogo.svg",
    apple: "/AbuImranLogo.svg",
  },
};

export const viewport = {
  themeColor: "#18181b", // zinc-950
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
      <body
        suppressHydrationWarning
        className={`${tajawal.variable} font-sans antialiased bg-white dark:bg-zinc-950`}
      >
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <I18nProvider>
              {children}
              <RealtimeNotifications />
              <PWAInstallPrompt />
              <Toaster richColors position="top-center" />
            </I18nProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import { RealtimeNotifications } from "@/components/RealtimeNotifications";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "أبو عمران | لوحة التحكم",
  description: "نظام إدارة متجر أبو عمران لتربية الدواجن ومعداتها",
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
        className={`${tajawal.className} antialiased bg-gray-50 dark:bg-gray-950`}
      >
        <ErrorBoundary>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <I18nProvider>
                    {children}
                    <RealtimeNotifications />
                    <Toaster richColors position="bottom-right" />
                </I18nProvider>
            </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

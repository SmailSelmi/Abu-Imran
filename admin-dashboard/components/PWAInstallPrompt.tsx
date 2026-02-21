"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(() => {
          console.log("[PWA] Service Worker registered");
        })
        .catch((err) => console.warn("[PWA] SW registration failed:", err));
    }

    // Check if already dismissed in this session
    const wasDismissed = sessionStorage.getItem("pwa_dismissed");
    if (wasDismissed) return;

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((window.navigator as { standalone?: boolean }).standalone === true)
      return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Small delay so the page loads first
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      toast.success("تم تثبيت التطبيق بنجاح!");
    }
    setIsVisible(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    sessionStorage.setItem("pwa_dismissed", "1");
  };

  if (!isVisible || dismissed) return null;

  return (
    <div
      role="alertdialog"
      aria-label="تثبيت التطبيق"
      className="fixed bottom-20 inset-x-4 md:inset-x-auto md:bottom-6 md:left-6 md:right-auto md:w-80 z-50 animate-in slide-in-from-bottom-4 duration-500"
    >
      <div className="bg-white dark:bg-zinc-900 border border-border/60 rounded-2xl shadow-lg p-4 flex items-start gap-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
          <Download className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground leading-snug">
            ثبّت لوحة التحكم
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            احصل على تجربة تطبيق أصلية مع وصول سريع من شاشة الرئيسية.
          </p>
          <button
            onClick={handleInstall}
            className="mt-2 text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            تثبيت الآن ←
          </button>
        </div>

        {/* Close */}
        <button
          onClick={handleDismiss}
          aria-label="إغلاق"
          className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

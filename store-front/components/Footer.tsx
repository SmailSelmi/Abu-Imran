"use client";

import Link from "next/link";
import { Egg, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t, isRTL, locale } = useI18n();

  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );

  const socialLinks = [
    { icon: Facebook, name: "Facebook", href: "#" },
    { icon: Instagram, name: "Instagram", href: "#" },
    { icon: TikTokIcon, name: "TikTok", href: "#" },
  ];

  return (
    <footer
      className="w-full bg-zinc-950 text-white pt-24 pb-12 relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top Gradient Border */}
      <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-900 opacity-50" />

      {/* Background Glow */}
      <div className="absolute bottom-0 start-0 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link className="flex items-center gap-4 group" href="/">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-xl text-white shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3 ring-1 ring-white/10 p-2 overflow-hidden relative">
                <Image
                  src="/icon0.svg"
                  alt="Abu Imran Logo"
                  fill
                  className="object-contain dark:brightness-0 dark:invert"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tighter leading-none">
                  {t.common.brand}
                </span>
                <span className="text-emerald-500 font-black tracking-[0.3em] text-[10px] uppercase opacity-70 mt-1">
                  {t.common.premiumGenetics}
                </span>
              </div>
            </Link>
            <p className="text-zinc-400 leading-relaxed text-lg font-medium opacity-80">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: IconComp, name, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  aria-label={`Follow us on ${name}`}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all hover:-translate-y-1 shadow-lg ring-1 ring-white/10"
                >
                  <IconComp className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-emerald-500">
              {t.footer.shop}
            </h3>
            <ul className="space-y-5">
              {[
                { label: t.footer.links.eggs, href: "/shop?category=eggs" },
                { label: t.footer.links.chicks, href: "/shop?category=chicks" },
                {
                  label: t.footer.links.adult,
                  href: "/shop?category=chickens",
                },
                {
                  label: t.footer.links.machine,
                  href: "/shop?category=machine",
                },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    className="text-zinc-400 hover:text-white transition-all flex items-center gap-4 group font-black text-sm tracking-tight"
                    href={link.href}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600/30 group-hover:bg-emerald-500 group-hover:scale-150 transition-all shrink-0"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-emerald-500">
              {t.footer.support}
            </h3>
            <ul className="space-y-5">
              {[
                { label: t.footer.links.contactUs, href: "/contact" },
                { label: t.footer.links.shipping, href: "/shipping" },
                { label: t.footer.links.return, href: "/returns" },
                { label: t.footer.links.faq, href: "/faq" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    className={cn(
                      "text-zinc-400 hover:text-white transition-all inline-block font-black text-sm tracking-tight",
                      isRTL ? "hover:-translate-x-1" : "hover:translate-x-1",
                    )}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="font-black text-xs uppercase tracking-[0.3em] text-emerald-500">
              {t.footer.contact}
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-5">
                <div className="p-3.5 bg-emerald-600/10 rounded-xl text-emerald-500 ring-1 ring-emerald-500/20">
                  <MapPin className="h-6 w-6 shrink-0" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                    {t.common.location}
                  </span>
                  <span className="font-black text-sm text-zinc-300">
                    {t.footer.delivery58}
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-5">
                <div className="p-3.5 bg-emerald-600/10 rounded-xl text-emerald-500 ring-1 ring-emerald-500/20">
                  <Phone className="h-6 w-6 shrink-0" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                    {t.common.contactMethod}
                  </span>
                  <a
                    href="https://wa.me/213665243819"
                    className="font-black text-xl text-emerald-500 tracking-tighter tabular-nums hover:text-emerald-400 transition-colors"
                  >
                    +213 665 24 38 19
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs text-zinc-500 text-center md:text-start font-black tracking-tight opacity-50">
            © 2026 {t.common.brand}. {t.footer.rights}
          </p>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Link
              href="/privacy"
              className="hover:text-emerald-500 transition-colors opacity-70 hover:opacity-100"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="/terms"
              className="hover:text-emerald-500 transition-colors opacity-70 hover:opacity-100"
            >
              شروط الاستخدام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

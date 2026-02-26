"use client";

import Link from "next/link";
import { Egg, Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Footer() {
  const { t, isRTL, locale } = useI18n();

  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );

  const socialLinks = [
    { icon: Facebook, name: "Facebook", href: "https://www.facebook.com/profile.php?id=61556685279269" },
    { icon: TikTokIcon, name: "TikTok", href: "https://www.tiktok.com/@poultry.sami?_r=1&_t=ZS-94FDFXEtdg5" },
  ];

  return (
    <footer
      className="w-full bg-white dark:bg-black text-slate-900 dark:text-white pt-16 pb-12 relative z-10 overflow-visible"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Premium Animated Divider with Gap */}
      <div className="absolute top-0 inset-x-0 h-px w-full flex items-center justify-center overflow-hidden">
        {/* Left Segment */}
        <div className="relative flex-1 h-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/40 to-emerald-500/40 mr-[18px] md:mr-[22px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-blue-500/20 mr-[18px] md:mr-[22px]" />
        </div>
        
        {/* 2px Gap on each side of the egg (radius + 2px) */}
        <div className="w-[36px] md:w-[44px] shrink-0 h-px bg-transparent" />
        
        {/* Right Segment */}
        <div className="relative flex-1 h-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-emerald-500/40 to-emerald-500/40 ml-[18px] md:ml-[22px]" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-500/20 to-blue-500/20 ml-[18px] md:ml-[22px]" />
        </div>
      </div>
      
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-12 bg-emerald-500/5 blur-[40px] pointer-events-none" />

      {/* Decorative Center Element (Animated Egg - Pure SVG) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="relative flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 md:w-10 md:h-10"
            style={{ 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15)) drop-shadow(0 0 1px rgba(16, 185, 129, 0.4))' 
            }}
          >
            {/* Outline Egg */}
            <path
              d="M12 2C8 2 4 7 4 14C4 18.5 7.5 22 12 22C16.5 22 20 18.5 20 14C20 7 16 2 12 2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-emerald-500/20"
            />
            
            {/* Clipping Mask for the Filling Effect */}
            <defs>
              <clipPath id="eggClip">
                <path d="M12 2C8 2 4 7 4 14C4 18.5 7.5 22 12 22C16.5 22 20 18.5 20 14C20 7 16 2 12 2Z" />
              </clipPath>
            </defs>

            {/* The "Water" Filling Animation with Wave Effect */}
            <g clipPath="url(#eggClip)">
              <motion.path
                animate={{
                  d: [
                    "M-5 20 Q 5 18, 12 20 T 29 20 L 29 30 L -5 30 Z",
                    "M-5 20 Q 5 22, 12 20 T 29 20 L 29 30 L -5 30 Z",
                    "M-5 20 Q 5 18, 12 20 T 29 20 L 29 30 L -5 30 Z"
                  ],
                  y: [4, -14, 4],
                }}
                transition={{
                  d: { duration: 2, repeat: Infinity, ease: "linear" },
                  y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                }}
                fill="url(#eggGradient)"
              />
            </g>

            {/* Gradient for the Liquid */}
            <defs>
              <linearGradient id="eggGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute bottom-0 start-0 w-full max-w-sm aspect-square bg-emerald-900/5 rounded-full blur-[100px] pointer-events-none overflow-hidden" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link className="flex items-center gap-3 group" href="/">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/5 text-white transition-all group-hover:scale-105 overflow-hidden p-1.5 relative">
                <Image
                  src="/AbuImranLogo.svg"
                  alt="أبو عمران"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight leading-none">
                  {t.common.brand}
                </span>
                <span className="text-emerald-600 font-bold tracking-widest text-[9px] uppercase opacity-70 mt-1">
                  {t.common.premiumGenetics}
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-base">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: IconComp, name, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  aria-label={`Follow us on ${name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/5 border border-emerald-500/10 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                >
                  <IconComp className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
 
          {/* Store & Support (Merged 1x1 on mobile, 2 columns) */}
          <div className="grid grid-cols-2 gap-8 md:block md:space-y-12">
            <div className="space-y-6">
              <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-600">
                {t.footer.shop}
              </h3>
              <ul className="space-y-4">
                {[
                  { label: t.footer.links.eggs, href: "/order/eggs" },
                  { label: t.footer.links.chicks, href: "/order/chicks" },
                  { label: t.footer.links.adult, href: "/order/chickens" },
                  { label: t.footer.links.machine, href: "/order/machine" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      className="text-muted-foreground hover:text-emerald-600 transition-all flex items-center gap-3 font-semibold text-sm"
                      href={link.href}
                    >
                      <span className="h-1 w-1 rounded-full bg-emerald-600/20 group-hover:bg-emerald-500 transition-all shrink-0"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-600">
                {t.footer.support}
              </h3>
              <ul className="space-y-4">
                {[
                  { label: t.footer.links.shipping, href: "/shipping" },
                  { label: t.footer.links.return, href: "/returns" },
                  { label: t.footer.links.faq, href: "/faq" },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      className="text-muted-foreground hover:text-emerald-600 transition-all flex items-center gap-3 font-semibold text-sm"
                      href={link.href}
                    >
                      <span className="h-1 w-1 rounded-full bg-emerald-600/20 group-hover:bg-emerald-500 transition-all shrink-0"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-600">
              تواصل مباشر
            </h3>
            <ul className="space-y-5">
              <li>
                <a
                  href="https://maps.app.goo.gl/RGFgiP21gvVkJB9n7?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group/address"
                >
                  <div className="p-3 bg-emerald-600/5 rounded-lg text-emerald-600 border border-emerald-500/10 group-hover/address:bg-emerald-600 group-hover/address:text-white transition-all duration-300">
                    <MapPin className="h-5 w-5 shrink-0" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground group-hover/address:text-emerald-600 transition-colors">
                      {t.common.location}
                    </span>
                    <span className="font-semibold text-sm text-foreground group-hover/address:text-emerald-600 transition-colors">
                      الجزائر، بلدية الزيتونة، ولاية الطارف
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <div className="space-y-4">
                  <a
                    href="tel:+213665243819"
                    className="flex items-center gap-4 group/phone"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 group-hover/phone:bg-emerald-600 group-hover/phone:text-white transition-all duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-lg text-emerald-600 tracking-tight transition-colors" dir="ltr">
                        +213 665 24 38 19
                      </span>
                    </div>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 pt-12 mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs text-slate-500 dark:text-zinc-500 text-center md:text-start font-black tracking-tight opacity-50">
            © 2026 {t.common.brand}. {t.footer.rights}
          </p>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
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

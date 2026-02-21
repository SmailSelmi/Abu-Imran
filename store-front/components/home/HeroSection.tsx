"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import Image from "next/image";

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <section
      className="relative h-[105vh] flex items-center justify-center overflow-hidden bg-black text-white"
      dir="rtl"
    >
      {/* Background Video with Gradient Overlay */}
      <div className="absolute inset-0 z-0 scale-110">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-55 select-none pointer-events-none"
        >
          <source
            src="https://res.cloudinary.com/dyi0jxi3g/video/upload/v1771274879/hero-video_n5fzks.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020504] via-[#020504]/50 to-[#020504]/20" />
      </div>

      <div className="container relative z-10 px-4 text-center" dir="rtl">
        <div className="flex flex-col items-center max-w-5xl mx-auto">


          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-balance mb-4 sm:mb-6"
          >
            {t.hero.titleMain}{" "}
            <span className="text-primary italic drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              {t.hero.titleRare}
            </span>
            <br className="hidden md:block" />
            <span className="text-white drop-shadow-xl">
              {t.hero.titleWorld}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-base md:text-xl text-white/70 max-w-3xl leading-relaxed font-bold italic text-balance mb-10"
          >
            {t.hero.description}
          </motion.p>

          {/* CTAs — hidden on mobile (bottom nav has the CTA), visible on xl+ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "circOut" }}
            className="hidden xl:flex flex-row gap-4 justify-center items-center"
          >
            <Link href="/hatching">
              <Button className="h-12 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all shadow-xl shadow-primary/30 hover:-translate-y-1 active:scale-95 group">
                {t.hero.bookIncubator}
                <ArrowUpRight className="me-2 w-5 h-5 transition-transform group-hover:rotate-45" />
              </Button>
            </Link>
            <Link href="https://wa.me/213665243819" target="_blank">
              <Button
                variant="outline"
                className="h-12 px-8 text-base font-bold border-2 border-white/30 glass-card text-white hover:bg-white hover:text-black rounded-full transition-all hover:-translate-y-1 active:scale-95 shadow-lg"
              >
                {t.common.contactUs}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator — hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden xl:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3"
        >
          <div className="w-px h-16 bg-gradient-to-b from-emerald-500 to-transparent opacity-40" />
          <span className="-rotate-90 text-[8px] font-black uppercase tracking-[0.5em] opacity-30 origin-left mt-6">
            {t.hero.scrollDown}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

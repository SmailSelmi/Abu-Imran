"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
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
      <div className="absolute inset-0 z-0 scale-110 overflow-hidden">
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


          {/* Main Heading with Elite Hierarchy */}
          <div className="space-y-2 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="flex justify-center"
            >
              <span className="text-emerald-500 font-bold text-sm tracking-[0.4em] uppercase opacity-70 mb-4 inline-block">
                {t.hero.title}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-5xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] select-none text-balance"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="block text-white"
              >
                {t.hero.titleMain}
              </motion.span>
              
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative inline-block text-emerald-500 italic py-1 mt-1"
              >
                <span className="relative z-10 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  {t.hero.titleRare}
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 1 }}
                  className="absolute bottom-2 inset-x-0 h-2 bg-emerald-500/10 -rotate-1 origin-left rounded-sm"
                />
              </motion.span>

              <br className="hidden md:block" />
              
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 mt-2 font-extrabold tracking-tight"
              >
                {t.hero.titleWorld}
              </motion.span>
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed mb-10 mx-auto"
          >
            {t.hero.description}
          </motion.p>
 
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
          >
            <Link href="/#shop">
              <Button className="h-14 px-10 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 active:scale-95 group">
                {t.common.orderNow}
                <ArrowUpLeft className="ms-2 w-5 h-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Link>
            <Link href="/hatching">
              <Button
                variant="outline"
                className="h-14 px-10 text-lg font-bold border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-black rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm"
              >
                {t.common.hatchingService}
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

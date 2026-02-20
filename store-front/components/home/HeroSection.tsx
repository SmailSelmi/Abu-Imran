'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Icon } from '@/components/ui/Icon'
import { useI18n } from '@/lib/i18n/I18nContext'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function HeroSection() {
  const { t, isRTL } = useI18n()

  return (
    <section className="relative h-[110vh] flex items-center justify-center overflow-hidden bg-black text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Video/Image with Smooth Gradient Overlay */}
      <div className="absolute inset-0 z-0 scale-110">
         <video 
            autoPlay loop muted playsInline 
            className="w-full h-full object-cover opacity-60 select-none pointer-events-none"
         >
             <source src="https://res.cloudinary.com/dyi0jxi3g/video/upload/v1771274879/hero-video_n5fzks.mp4" type="video/mp4" />
         </video>
         {/* Full-width smooth dark gradient for maximum readability */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#020504] via-[#020504]/50 to-[#020504]/20" />
      </div>


      <div className="container relative z-10 px-4 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col items-center max-w-5xl mx-auto">
            {/* Top Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="inline-flex items-center gap-4 py-3 px-8 rounded-full glass-card text-white text-[11px] font-black tracking-[0.3em] uppercase mb-10 border-white/20"
            >
                <div className="relative w-8 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    <Image 
                        src="/logo-official.png" 
                        alt="Logo" 
                        fill 
                        className="object-contain"
                    />
                </div>
                {t.common.brandFull}
            </motion.div>

            
            {/* Main Heading */}
            <motion.h1 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2, duration: 1.2, ease: "circOut" }}
               className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] drop-shadow-2xl text-balance mb-8"
            >
              {t.hero.titleMain} <span className="text-primary italic drop-shadow-[0_0_40px_rgba(16,185,129,0.5)]">{t.hero.titleRare}</span>
              <br /> 
              <span className="text-base sm:text-lg md:text-2xl font-black glass-card px-4 sm:px-8 py-3 rounded-full inline-block mt-6 mb-6 scale-90 md:scale-100 border-white/10">{t.hero.titleAnd}</span>
              <br className="hidden md:block" />
              <span className="text-white drop-shadow-xl">{t.hero.titleWorld}</span>
            </motion.h1>


            {/* Description */}
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4, duration: 1 }}
               className="text-lg md:text-2xl text-white/70 max-w-3xl leading-relaxed font-bold italic text-balance mb-12"
            >
              {t.hero.description}
            </motion.p>
    
            {/* CTAs */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6, duration: 0.8, ease: "circOut" }}
               className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto mt-8"
            >
                <Link href="/hatching" className="w-full sm:w-auto">
                   <Button className="w-full h-20 px-12 text-xl font-black bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all shadow-2xl shadow-primary/30 group hover:-translate-y-2 active:scale-95">
                       {t.hero.bookIncubator}
                       <ArrowUpRight className={cn("ms-2 w-8 h-8 transition-transform", isRTL ? "group-hover:-rotate-45" : "group-hover:rotate-45")} />
                   </Button>
                </Link>
               <Link href="https://wa.me/213550123456" target="_blank" className="w-full sm:w-auto">
                   <Button variant="outline" className="w-full h-20 px-12 text-xl font-black border-2 border-white/30 glass-card text-white hover:bg-white hover:text-black rounded-full transition-all group hover:-translate-y-2 active:scale-95 shadow-xl">
                        {t.common.contactUs}
                   </Button>
                </Link>
            </motion.div>

        </div>

        {/* Floating Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
            <div className="w-px h-24 bg-gradient-to-b from-emerald-500 to-transparent opacity-40" />
            <span className={cn(
                "text-[8px] font-black uppercase tracking-[0.5em] opacity-30 origin-left mt-8",
                isRTL ? "-rotate-90" : "rotate-90"
            )}>
                {t.hero.scrollDown}
            </span>
        </motion.div>
      </div>
    </section>
  )
}

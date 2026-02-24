"use client";
import { motion } from "framer-motion";
import {
  Thermometer,
  Activity,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HatchingServiceSection() {
  const { t, isRTL } = useI18n();
  const router = useRouter();

  return (
    <section
      className="py-16 md:py-32 bg-white dark:bg-zinc-900 relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={cn(
          "absolute top-0 w-1/2 h-full bg-emerald-500/[0.02] -skew-x-12",
          isRTL
            ? "left-0 -translate-x-1/2 skew-x-12"
            : "right-0 translate-x-1/2",
        )}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="text-emerald-600 font-bold text-sm tracking-widest bg-emerald-100/30 dark:bg-emerald-900/10 px-4 py-1.5 rounded-lg">
              {t.hatching.badge}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
              {t.hatching.title} <br />
              <span className="text-emerald-600">
                {t.hatching.titleAccent}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t.hatching.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            {[
              {
                icon: Thermometer,
                color: "emerald",
                label: t.hatching.precision,
              },
              { icon: Activity, color: "blue", label: t.hatching.oxygen },
              { icon: Clock, color: "amber", label: t.hatching.cycle },
              {
                icon: ShieldCheck,
                color: "purple",
                label: t.hatching.fullProtection,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-4 bg-zinc-50/50 dark:bg-zinc-800/20 p-6 lg:p-8 rounded-3xl transition-all group"
              >
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                  <item.icon className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest opacity-70">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="pt-10 flex flex-col items-center gap-8">
            <div className="flex -space-x-4 rtl:space-x-reverse items-center">
              {[
                "/images/breeders/breeder_1.png",
                "/images/breeders/breeder_2.png",
                "/images/breeders/breeder_3.png",
                "/images/breeders/breeder_4.png",
                "/images/breeders/breeder_5.png",
              ].map((url, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-14 h-14 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-200 overflow-hidden relative shadow-sm grayscale hover:grayscale-0 transition-all duration-500"
                >
                  <Image
                    src={url}
                    alt={`Breeder ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="w-14 h-14 rounded-full border-4 border-white dark:border-zinc-950 bg-emerald-700 flex items-center justify-center text-white text-xs font-black shadow-sm relative z-10"
              >
                +500
              </motion.div>
            </div>
            <p className="text-lg md:text-xl font-black text-emerald-950 dark:text-emerald-500 underline decoration-emerald-500/30 decoration-4 underline-offset-8 italic">
              {t.hatching.breederTrust}
            </p>
            
            <Button
              onClick={() => router.push('/hatching')}
              className="h-16 px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
            >
              {t.hatching.reserve}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

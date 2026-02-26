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
      className="py-12 md:py-32 bg-white dark:bg-zinc-900 relative overflow-hidden"
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

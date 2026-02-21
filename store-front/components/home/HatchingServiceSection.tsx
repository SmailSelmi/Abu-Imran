"use client";
import { motion } from "framer-motion";
import {
  Egg,
  Thermometer,
  Activity,
  Clock,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n/I18nContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HatchingServiceSection() {
  const { t, isRTL } = useI18n();
  const router = useRouter();

  const [eggCount, setEggCount] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [breed, setBreed] = useState("");

  const handleStartBooking = () => {
    const params = new URLSearchParams();
    if (eggCount) params.set("count", eggCount);
    if (breed) params.set("breed", breed);
    // We don't necessarily want name/phone in URL for privacy, but could store in session if needed.
    // For now, count and breed are enough to pre-fill the main form.
    router.push(`/hatching?${params.toString()}`);
  };

  return (
    <section
      className="py-32 bg-white dark:bg-zinc-900 relative overflow-hidden"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6 lg:space-y-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] bg-emerald-100 dark:bg-emerald-900/30 px-6 py-2 rounded-full border border-emerald-500/20">
                {t.hatching.badge}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
                {t.hatching.title} <br />
                <span className="text-emerald-600 italic">
                  {t.hatching.titleAccent}
                </span>
              </h2>
              <p className="text-base lg:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                {t.hatching.description}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 lg:gap-6">
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
                  className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 lg:p-6 rounded-2xl shadow-sm border border-border/50"
                >
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 lg:w-6 lg:h-6 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight opacity-70">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="hidden lg:flex pt-8 items-center gap-8">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-200 overflow-hidden"
                  />
                ))}
              </div>
              <p className="text-sm font-bold opacity-60 italic">
                {t.hatching.breederTrust}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative order-1 lg:order-2"
          >
            <div className="absolute inset-0 bg-emerald-600 blur-[80px] opacity-10 rounded-full" />
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] lg:rounded-[3.5rem] p-6 md:p-10 lg:p-14 shadow-sm border border-border/40 relative z-10">
              <div className="flex items-center justify-between mb-8 lg:mb-12">
                <h3 className="text-2xl lg:text-3xl font-black tracking-tight">
                  {t.hatching.reserve}
                </h3>
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/10">
                  <Egg className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ps-2 italic">
                    {t.hatching.eggCount}
                  </Label>
                  <Input
                    type="number"
                    value={eggCount}
                    onChange={(e) => setEggCount(e.target.value)}
                    placeholder="50, 100, 200..."
                    className="h-16 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-2xl px-6 font-black text-xl flex-1 focus-visible:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground ps-2 italic">
                      {t.hatching.fullName}
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-20 bg-zinc-50 dark:bg-zinc-800/80 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.5rem] px-8 font-black text-lg transition-all"
                      placeholder="..."
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground ps-2 italic">
                      {t.hatching.phone}
                    </Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-20 bg-zinc-50 dark:bg-zinc-800/80 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.5rem] px-8 font-black text-lg transition-all"
                      placeholder="05 / 06 / 07 ..."
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground ps-2 italic">
                    {t.hatching.breedCount}
                  </Label>
                  <Input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder={t.hatching.breedEx}
                    className="h-20 bg-zinc-50 dark:bg-zinc-800/80 border-2 border-transparent focus:border-emerald-500/20 rounded-[1.5rem] px-8 font-black text-lg transition-all"
                  />
                </div>

                <div className="pt-8">
                  <Button
                    onClick={handleStartBooking}
                    className="w-full h-24 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black text-3xl shadow-sm group transition-all transform hover:-translate-y-1 active:scale-95"
                  >
                    <span className="flex items-center gap-4">
                      {t.hatching.startBooking}
                      <ChevronRight
                        className={cn(
                          "w-10 h-10 transition-transform",
                          isRTL
                            ? "rotate-180 group-hover:-translate-x-2"
                            : "group-hover:translate-x-2",
                        )}
                      />
                    </span>
                  </Button>
                </div>

                <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 pt-4 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />{" "}
                  {t.hatching.shield}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

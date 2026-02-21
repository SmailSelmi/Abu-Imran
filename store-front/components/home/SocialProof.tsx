"use client";
import { useState, useEffect } from "react";
import { MapPin, Star, Quote } from "lucide-react";
import Image from "next/image";
import AlgeriaMap from "../ui/AlgeriaMap";
import { createClient } from "@/utils/supabase/client";
import { useI18n } from "@/lib/i18n/I18nContext";
import { cn } from "@/lib/utils";

export function DeliveryZones() {
  const { t, isRTL } = useI18n();
  const [highlightedWilayas, setHighlightedWilayas] = useState<string[]>([]);
  const [mainWilayas, setMainWilayas] = useState<string[]>([
    "الجزائر",
    "البليدة",
    "تيبازة",
    "بومرداس",
    "وهران",
  ]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchZones() {
      const { data } = await supabase.from("delivery_zones").select("wilayas");
      if (data) {
        const allWilayas = Array.from(new Set(data.flatMap((d) => d.wilayas)));
        setHighlightedWilayas(allWilayas);
      }
    }
    fetchZones();
  }, []);

  return (
    <section
      className="py-24 bg-white dark:bg-zinc-950"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container px-4 mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div
          className={cn("flex-1 space-y-8", isRTL ? "text-right" : "text-left")}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold">
            {t.socialProof.nationalCoverage}
          </span>
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            {t.socialProof.deliveryTitle}{" "}
            <span className="text-blue-600">
              {highlightedWilayas.length > 0 ? highlightedWilayas.length : "58"}{" "}
              {t.socialProof.wilaya}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t.socialProof.deliveryDescription}
          </p>

          <div
            className={cn(
              "flex flex-wrap gap-3 pt-4",
              isRTL ? "justify-start" : "justify-start",
            )}
          >
            {mainWilayas.map((w) => (
              <span
                key={w}
                className="px-4 py-2 bg-muted/50 border border-border/50 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white hover:shadow-sm transition-all cursor-default"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> {w}
              </span>
            ))}
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold border border-green-200 dark:border-green-800 cursor-pointer hover:bg-green-200 transition-colors">
              {t.common.more}
            </span>
          </div>
        </div>
        <div className="flex-1 relative h-[500px] w-full bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-border/40 overflow-hidden transition-all duration-500 flex items-center justify-center p-4">
          <AlgeriaMap
            className="w-full h-full"
            highlightedWilayas={
              highlightedWilayas.length > 0
                ? highlightedWilayas
                : ["16", "09", "42", "35", "31"]
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none flex items-end justify-center pb-12">
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-8 py-6 rounded-xl shadow-md text-center transform hover:-translate-y-2 transition-transform border border-border">
              <p className="font-bold text-2xl mb-1 text-foreground">
                {t.socialProof.fastDelivery}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {t.socialProof.deliveryTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { t, isRTL } = useI18n();
  const testimonials = [
    {
      text: t.testimonials.t1.text,
      name: t.testimonials.t1.name,
      loc: t.testimonials.t1.loc,
      bg: "bg-blue-50 dark:bg-blue-900/10",
    },
    {
      text: t.testimonials.t2.text,
      name: t.testimonials.t2.name,
      loc: t.testimonials.t2.loc,
      bg: "bg-green-50 dark:bg-green-900/10",
    },
    {
      text: t.testimonials.t3.text,
      name: t.testimonials.t3.name,
      loc: t.testimonials.t3.loc,
      bg: "bg-orange-50 dark:bg-orange-900/10",
    },
  ];

  return (
    <section
      className="py-24 bg-white dark:bg-zinc-950 border-t border-border/40 relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container px-4 mx-auto text-center relative z-10">
        <h2 className="text-4xl font-black mb-16 tracking-tighter">
          {t.testimonials.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div
              key={i}
              className={cn(
                "p-10 rounded-xl border border-transparent hover:border-border/60 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-zinc-900 relative group hover:-translate-y-2",
                isRTL ? "text-right" : "text-left",
              )}
            >
              <Quote
                className={cn(
                  "absolute top-8 w-12 h-12 text-muted-foreground/10",
                  isRTL ? "left-8 rotate-180" : "right-8",
                )}
              />
              <div
                className={cn(
                  "flex gap-1 text-yellow-400 mb-6",
                  isRTL ? "justify-start" : "justify-start",
                )}
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-lg font-medium text-foreground/90 mb-8 leading-relaxed relative z-10">
                &quot;{test.text}&quot;
              </p>
              <div
                className={cn(
                  "flex items-center gap-4 border-t border-border/50 pt-6",
                  isRTL ? "flex-row" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0",
                    test.bg,
                  )}
                >
                  {test.name.charAt(0)}
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <div className="font-bold text-lg">{test.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {test.loc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

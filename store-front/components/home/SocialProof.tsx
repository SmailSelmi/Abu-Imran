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
      className="py-12 md:py-24 bg-white dark:bg-zinc-950 overflow-hidden relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container px-4 mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div
          className={cn("flex-1 space-y-6", isRTL ? "text-right" : "text-left")}
        >
          <span className="inline-block py-1.5 px-4 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold border border-blue-500/10">
            {t.socialProof.nationalCoverage}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            {t.socialProof.deliveryTitle}{" "}
            <span className="text-blue-600">
              {highlightedWilayas.length > 0 ? highlightedWilayas.length : "58"}{" "}
              {t.socialProof.wilaya}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
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
                className="px-4 py-2 bg-muted/50 border border-blue-500/10 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm transition-all cursor-default"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> {w}
              </span>
            ))}
            <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold border border-green-200 dark:border-green-800 cursor-pointer hover:bg-green-200 transition-colors">
              {t.common.more}
            </span>
          </div>
        </div>
        <div className="flex-1 relative h-[500px] w-full bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-blue-500/20 overflow-hidden transition-all duration-500 flex items-center justify-center p-8">
          <AlgeriaMap
            className="w-full h-full opacity-90"
            highlightedWilayas={
              highlightedWilayas.length > 0
                ? highlightedWilayas
                : ["16", "09", "42", "35", "31"]
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-black/20 to-transparent pointer-events-none flex items-end justify-center pb-6 md:pb-10">
            <div className="bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md px-6 py-4 md:px-10 md:py-6 rounded-xl md:rounded-2xl shadow-sm text-center border border-white/20">
              <p className="font-bold text-xl md:text-2xl mb-0.5 text-foreground leading-tight">
                {t.socialProof.fastDelivery}
              </p>
              <p className="text-xs md:text-sm font-semibold text-muted-foreground">
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
      image: "/images/testimonials/farmer_1.png",
    },
    {
      text: t.testimonials.t2.text,
      name: t.testimonials.t2.name,
      loc: t.testimonials.t2.loc,
      bg: "bg-green-50 dark:bg-green-900/10",
      image: "/images/testimonials/farmer_2.png",
    },
    {
      text: t.testimonials.t3.text,
      name: t.testimonials.t3.name,
      loc: t.testimonials.t3.loc,
      bg: "bg-orange-50 dark:bg-orange-900/10",
      image: "/images/testimonials/farmer_3.png",
    },
  ];

  return (
    <section
      className="py-12 md:py-24 bg-white dark:bg-zinc-950 border-t border-emerald-500/10 relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container px-4 mx-auto text-center relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-10 md:mb-16 tracking-tight">
          {t.testimonials.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((test, i) => (
            <div
              key={i}
              className={cn(
                "p-6 md:p-8 rounded-2xl border border-emerald-500/20 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-zinc-900/50 relative group",
                isRTL ? "text-right" : "text-left",
              )}
            >
              <Quote
                className={cn(
                  "absolute top-6 md:top-8 w-6 h-6 md:w-8 md:h-8 text-muted-foreground/15",
                  isRTL ? "left-6 md:left-8 rotate-180" : "right-6 md:right-8",
                )}
              />
              <div
                className={cn(
                  "flex gap-1 text-yellow-400 mb-6",
                  isRTL ? "justify-start" : "justify-start",
                )}
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-base md:text-lg font-medium text-foreground/90 mb-6 md:mb-8 leading-relaxed relative z-10">
                &quot;{test.text}&quot;
              </p>
              <div
                className={cn(
                  "flex items-center gap-4 border-t border-emerald-500/10 pt-6",
                  isRTL ? "flex-row" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden flex items-center justify-center bg-muted shrink-0",
                  )}
                >
                  {test.image ? (
                    <Image
                      src={test.image}
                      alt={test.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className={cn("w-full h-full flex items-center justify-center text-base md:text-lg font-bold", test.bg)}>
                      {test.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <div className="font-bold text-base md:text-lg">{test.name}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">
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

"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Egg, Bird, Thermometer, ArrowRight, Zap } from "lucide-react";
import { OrderDialog } from "@/components/OrderDialog";

export default function FeaturedCarousel() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: "eggs",
      name: "بيض مخصب",
      desc: "نسب خصب عالية لسلالات نقية",
      icon: Egg,
      color: "from-amber-400 to-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
    },
    {
      id: "chicks",
      name: "كتاكيت وفلاليس",
      desc: "محصنة وبصحة ممتازة (جميع الأعمار)",
      icon: Bird,
      color: "from-emerald-400 to-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "adults",
      name: "دجاج بالغ",
      desc: "أمهات وديكة جاهزة للإنتاج",
      icon: Bird,
      color: "from-blue-400 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "incubators",
      name: "فقاسات يدوية",
      desc: "سعات مختلفة (50-500 بيضة)",
      icon: Thermometer,
      color: "from-zinc-700 to-zinc-900",
      bg: "bg-zinc-100 dark:bg-zinc-800",
      text: "text-zinc-800 dark:text-zinc-200",
    },
  ];

  return (
    <section
      className="py-16 md:py-24 bg-white dark:bg-black overflow-hidden"
      dir="rtl"
    >
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="text-center md:text-start space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 mb-2">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-xs font-black uppercase tracking-widest opacity-80">
                اكتشف منتجاتنا
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
              تسوق حسب الفئة
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="cursor-pointer"
              onClick={() =>
                setSelectedCategory(
                  cat.id === "adults"
                    ? "chickens"
                    : cat.id === "incubators"
                      ? "machine"
                      : cat.id,
                )
              }
            >
              <div className="group block relative h-full">
                <div className="h-full p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-border/40 transition-all duration-500 hover:border-emerald-500/30 group-hover:-translate-y-1">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${cat.bg} border border-border/40 flex items-center justify-center ${cat.text} mb-6 transition-transform duration-500`}
                  >
                    <cat.icon className="w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-black tracking-tighter transition-colors group-hover:text-emerald-600 uppercase">
                      {cat.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground font-medium italic opacity-70 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity">
                    اطلب الآن{" "}
                    <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <OrderDialog
        category={selectedCategory || "eggs"}
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";
import { CATEGORY_DATA, BREED_FAMILIES } from "@/lib/constants";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  families?: Database["public"]["Tables"]["families"]["Row"] | null;
  breeds?: Database["public"]["Tables"]["breeds"]["Row"] | null;
};

interface ShopClientProps {
  initialProducts: Product[];
  initialCategory?: string;
}

const CATEGORIES = Object.entries(CATEGORY_DATA).map(([id, data]) => ({
  id,
  name_ar: data.name_ar,
  icon: data.icon,
  image: data.image,
  color:
    id === "eggs"
      ? "bg-amber-500"
      : id === "chicks"
        ? "bg-emerald-500"
        : id === "chickens"
          ? "bg-blue-500"
          : "bg-zinc-800",
}));

export default function ShopClient({
  initialProducts: _initialProducts, // Marked as unused
  initialCategory,
}: ShopClientProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory || null,
  );

  const [activeBreed, setActiveBreed] = useState<string | null>(null);

  const handleOrder = (categoryId: string, breed?: string) => {
    router.push(`/order/${categoryId}${breed ? `?breed=${breed}` : ""}`);
  };

  const activeCategoryData = selectedCategory ? CATEGORY_DATA[selectedCategory] : null;
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);

  return (
    <div className="space-y-10 md:space-y-16">
      <AnimatePresence mode="wait">
        {!selectedCategory && (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-12"
          >
            {/* Category Hub Hero */}
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <Badge
                variant="outline"
                className="text-emerald-600 dark:text-emerald-400 border-emerald-500/10 bg-emerald-50/50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-lg font-bold uppercase tracking-widest text-[10px]"
              >
                سوق الجودة الفلاحية
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                تسوق <span className="text-emerald-600">مباشرة</span> من المزرعة
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto font-medium">
                اختر الفئة لتصفح سلالاتنا النادرة ومنتجات المزرعة المختارة. جودة مضمونة ومعايير تربية عالمية.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {CATEGORIES.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => handleOrder(cat.id)}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-sm transition-all duration-700 hover:shadow-xl hover:-translate-y-1">
                    <Image
                      src={cat.image}
                      alt={cat.name_ar}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      priority={idx < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end gap-3 z-10">
                      <div className="space-y-1">
                        <p className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-none">
                          {cat.name_ar}
                        </p>
                        <p className="text-[10px] md:text-xs font-black text-emerald-400 italic" dir="ltr">
                          {CATEGORY_DATA[cat.id].priceRange}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-emerald-400 tracking-widest pt-1">
                        <span>عرض السلالات</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
      )}
      </AnimatePresence>

      {/* Service Highlights */}
      <div className="space-y-8 md:space-y-12 py-8 md:py-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">لماذا تختار <span className="text-emerald-600">أبو عمران؟</span></h2>
          <p className="text-muted-foreground font-medium text-sm md:text-base max-w-lg mx-auto opacity-70">نلتزم بأعلى معايير الجودة لضمان نجاحكم في تربية سلالات الدجاج النادرة</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center gap-4 group">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-emerald-600/5 flex items-center justify-center text-emerald-600 shrink-0 transition-all duration-500 group-hover:bg-emerald-600 group-hover:text-white">
            <Truck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg tracking-tight">توصيل سريع وطني</h4>
            <p className="text-muted-foreground font-medium text-sm opacity-80">
              نوصل لجميع ولايات الجزائر الـ 58.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-4 group">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-emerald-600/5 flex items-center justify-center text-emerald-600 shrink-0 transition-all duration-500 group-hover:bg-emerald-600 group-hover:text-white">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg tracking-tight">سلالات موثقة الجينات</h4>
            <p className="text-muted-foreground font-medium text-sm opacity-80">
              تربية مضبوطة لأقصى أداء إنتاجي.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-4 group">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-emerald-600/5 flex items-center justify-center text-emerald-600 shrink-0 transition-all duration-500 group-hover:bg-emerald-600 group-hover:text-white">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg tracking-tight">طلب آمن ومضمون</h4>
            <p className="text-muted-foreground font-medium text-sm opacity-80">
              تأكيد مباشر عبر الهاتف بعد كل طلب.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center gap-4 group">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-emerald-600/5 flex items-center justify-center text-emerald-600 shrink-0 transition-all duration-500 group-hover:bg-emerald-600 group-hover:text-white">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg tracking-tight">دعم فني متخصص</h4>
            <p className="text-muted-foreground font-medium text-sm opacity-80">
              مرافقة تقنية لضمان نجاح مشروعكم.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

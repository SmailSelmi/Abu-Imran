"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Truck,
  ChevronLeft,
  Minus,
  Plus,
  Sparkles,
  Scale,
  Thermometer,
  Zap,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { CATEGORY_DATA } from "@/lib/constants";
import { Database } from "@/types/supabase";
import { OrderDialog } from "@/components/OrderDialog";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductContentProps {
  initialProduct: Product;
  variants: Product[];
  slug: string;
}

export default function ProductContent({
  initialProduct,
  variants,
  slug,
}: ProductContentProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<Product>(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const handleOrderNow = () => {
    if (!selectedVariant) return;
    if ((selectedVariant.stock || 0) < 1) {
      toast.error("نفدت الكمية!");
      return;
    }
    setIsOrderDialogOpen(true);
  };

  const isMachine = variants[0]?.category === "machine";

  return (
    <div className="min-h-screen bg-background font-sans pb-32 pt-32 md:pt-40">
      <div className="container px-4 mx-auto max-w-7xl">
        <Link
          href="/#shop"
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-emerald-600 mb-12 transition-all group"
        >
          <ChevronLeft className="w-4 h-4 me-2 group-hover:-translate-x-1 transition-transform" />
          العودة للمتجر
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column: Visuals */}
          <div className="space-y-8 sticky top-32">
            <motion.div
              layoutId={`image-${slug}`}
              className="relative aspect-square bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-border/50 shadow-sm"
            >
              {selectedVariant?.image_url ? (
                <Image
                  src={selectedVariant.image_url}
                  alt={selectedVariant.name_en}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No Image Available
                </div>
              )}
              <div className="absolute inset-0 bg-black/5" />

              {selectedVariant?.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-md">
                  <span className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-lg border border-white/20 shadow-sm">
                    نفدت الكمية
                  </span>
                </div>
              )}

              <div className="absolute bottom-6 left-6">
                <Badge className="bg-emerald-600 text-white border-transparent px-3 py-1 rounded-lg font-bold uppercase tracking-widest text-[9px] shadow-md">
                  Premium Grade
                </Badge>
              </div>
            </motion.div>

            {!isMachine && variants.length > 1 && (
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">خيارات متوفرة لهذه السلالة</p>
                <div className="grid grid-cols-4 gap-4">
                  {variants
                    .sort((a, b) => {
                       const order = { eggs: 1, chicks: 2, chickens: 3, machine: 4 };
                       return (order[a.category as keyof typeof order] || 99) - (order[b.category as keyof typeof order] || 99);
                    })
                    .map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-500 group/var ${selectedVariant?.id === v.id ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm scale-110 z-10" : "border-border/40 opacity-50 hover:opacity-100 hover:border-emerald-500/30"}`}
                      >
                        {v.image_url && (
                          <Image
                            src={v.image_url}
                            alt={v.name_en}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover/var:bg-transparent transition-colors" />
                        <div className="absolute inset-x-0 bottom-0 py-1 bg-black/60 backdrop-blur-sm text-[8px] font-bold text-white text-center">
                          {v.category === "eggs" ? "بيض" : v.category === "chicks" ? "كتكوت" : "دجاج"}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Info & Actions */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="text-emerald-600 border-emerald-200 bg-emerald-50 px-3 py-1 font-black uppercase text-[10px] tracking-widest rounded-full"
                >
                  {selectedVariant?.subcategory || "Premium Selection"}
                </Badge>
                {selectedVariant?.stock &&
                  selectedVariant.stock < 10 &&
                  selectedVariant.stock > 0 && (
                    <Badge
                      variant="destructive"
                      className="animate-pulse text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black"
                    >
                      كمية محدودة
                    </Badge>
                  )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                {selectedVariant?.name || selectedVariant?.name_en}
              </h1>

              <div className="flex items-baseline gap-2 pt-2">
                <div className="text-2xl md:text-3xl font-bold text-emerald-600 tracking-tight italic" dir="ltr">
                  {CATEGORY_DATA[selectedVariant?.category || 'eggs'].priceRange}
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                منتج مختار بعناية من مزرعة أبو عمران — جودة مضمونة وسلالات موثقة.
              </p>
            </div>

            {/* Technical Specs Layout */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2">
                <Scale className="w-5 h-5 text-emerald-600 opacity-60" />
                <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  نوع المنتج
                </h5>
                <p className="text-sm font-bold italic">
                  {selectedVariant?.category === "eggs" ? "بيض مخصب" : 
                   selectedVariant?.category === "chicks" ? "كتاكيت" : 
                   selectedVariant?.category === "chickens" ? "دجاج بالغ" : "عتاد"}
                </p>
              </div>
              <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2">
                <Layers className="w-5 h-5 text-emerald-600 opacity-60" />
                <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  السلالة
                </h5>
                <p className="text-sm font-bold italic">{selectedVariant?.name || "سلالة أصلية"}</p>
              </div>
              {isMachine && (
                <>
                  <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2">
                    <Zap className="w-5 h-5 text-emerald-600 opacity-60" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      استهلاك الكهرباء
                    </h5>
                    <p className="text-sm font-bold italic">موفر للطاقة</p>
                  </div>
                  <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2">
                    <Thermometer className="w-5 h-5 text-emerald-600 opacity-60" />
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      التحكم في الحرارة
                    </h5>
                    <p className="text-sm font-bold italic">رقمي دقيق</p>
                  </div>
                </>
              )}
            </div>

            {/* Direct Order Component */}
            <div className="relative group/order">
              <div className="relative bg-white dark:bg-zinc-950 border border-border/50 rounded-2xl p-8 md:p-10 shadow-sm overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <ShoppingBag className="w-20 h-20" />
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-md">
                        1X
                      </span>
                      طلب مباشر
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/10">
                        <div className="w-10 h-10 bg-emerald-600/10 text-emerald-600 rounded-lg flex items-center justify-center">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            توصيل للباب
                          </p>
                          <p className="text-xs font-semibold">
                            58 ولاية
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/80 bg-muted/20">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black uppercase tracking-widest">
                            مؤمّن
                          </p>
                          <p className="text-xs font-bold italic opacity-60">
                            ضمان النجاح
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-dashed border-border flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-muted-foreground uppercase tracking-[0.3em]">
                        اختر الكمية
                      </span>
                      <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-xl border border-border shadow-inner">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 hover:bg-white hover:text-emerald-600 rounded-lg shadow-sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="w-10 text-center font-black text-xl tabular-nums italic">
                          {quantity}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 hover:bg-white hover:text-emerald-600 rounded-lg shadow-sm"
                          disabled={quantity >= (selectedVariant?.stock || 100)}
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="lg"
                      onClick={handleOrderNow}
                      className="w-full h-16 rounded-xl shadow-sm hover:shadow-md transition-all font-bold text-xl bg-emerald-600 hover:bg-emerald-700 text-white group/btn"
                      disabled={(selectedVariant?.stock || 0) < 1}
                    >
                      تأكيد الطلب
                    </Button>

                    <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 flex items-center justify-center gap-2">
                      <Sparkles className="w-3 h-3 text-emerald-500" /> الدفع
                      عند الاستلام
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrderDialog
        isOpen={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
        product={selectedVariant}
        quantity={quantity}
      />
    </div>
  );
}

"use client";
import { useState } from "react";
import { Check, Info, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string; // Changed from number to string (UUID)
  name_en: string;
  subcategory: string;
  price: number;
  image_url?: string;
  stock?: number;
}

interface SmartBreedSelectorProps {
  onSelect: (breed: Product) => void;
  selectedId: string | undefined; // Changed from number
  products: Product[]; // New prop
}

export function SmartBreedSelector({
  onSelect,
  selectedId,
  products,
}: SmartBreedSelectorProps) {
  const [filter, setFilter] = useState<string>("all");

  // Filter products based on subcategory (if needed) or just display passed products
  // Assuming 'products' passed here are already filtered by category (livestock) from parent
  const filteredBreeds = products.filter((product) => {
    if (filter === "all") return true;
    return product.subcategory === filter;
  });

  // Extract unique subcategories for filter buttons
  const subcategories = Array.from(new Set(products.map((p) => p.subcategory)));

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-xl w-fit mx-auto lg:mx-0 border-white/20">
        <button
          onClick={() => setFilter("all")}
          className={clsx(
            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
            filter === "all"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          All
        </button>
        {subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => setFilter(sub)}
            className={clsx(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all capitalize",
              filter === sub
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBreeds.map((breed) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            key={breed.id}
            onClick={() => {
              if (breed.stock !== 0) {
                onSelect(breed);
              }
            }}
            className={clsx(
              "relative flex flex-row group border rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-card p-2 md:p-3",
              breed.stock === 0
                ? "opacity-75 cursor-not-allowed grayscale-[0.3]"
                : "cursor-pointer hover:shadow-lg hover:shadow-emerald-500/10",
              selectedId === breed.id
                ? "border-emerald-500 ring-1 ring-emerald-500/50 shadow-md bg-emerald-50/30 dark:bg-emerald-500/5"
                : "border-border/50 hover:border-emerald-500/30",
            )}
          >
            {/* Image Thumbnail */}
            <div className="w-28 h-28 md:w-32 md:h-32 shrink-0 relative rounded-xl bg-muted overflow-hidden border border-border/50">
              {breed.image_url ? (
                <Image
                  src={breed.image_url}
                  alt={breed.name_en}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No Image
                </div>
              )}

              {/* Stock Badges */}
              {breed.stock === 0 ? (
                <Badge
                  variant="destructive"
                  className="absolute top-2 start-2 bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-black uppercase shadow-lg border border-white/10"
                >
                  نفدت الكمية
                </Badge>
              ) : breed.stock !== undefined &&
                breed.stock < 10 &&
                breed.stock > 0 ? (
                <Badge variant="destructive" className="absolute top-3 start-3">
                  Low Stock
                </Badge>
              ) : null}

                <div className="absolute inset-0 bg-emerald-600/10 backdrop-blur-[2px] flex items-center justify-center rounded-xl bg-blend-overlay">
                  <div className="bg-emerald-600 text-white rounded-full p-2.5 shadow-xl shadow-emerald-600/30 scale-110">
                    <Check className="w-6 h-6" strokeWidth={4} />
                  </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col justify-between flex-grow ps-4 md:ps-5 py-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="min-w-0 pr-2">
                  <h3 className="font-black text-lg md:text-xl text-foreground leading-tight truncate">
                    {breed.name_en}
                  </h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-widest mt-0.5 md:mt-1 truncate">
                    {breed.subcategory}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between pt-2">
                <div className="flex flex-col">
                  <span className="text-xl md:text-2xl font-black text-amber-500 tracking-tighter leading-none">
                    {breed.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-black text-muted-foreground mt-0.5">
                    د.ج
                  </span>
                </div>
                {breed.stock === 0 ? (
                  <Badge
                    variant="secondary"
                    className="h-9 md:h-10 px-4 md:px-6 rounded-xl font-bold bg-muted text-muted-foreground/50 opacity-50 cursor-not-allowed whitespace-nowrap"
                  >
                    غير متوفر
                  </Badge>
                ) : (
                  <Badge
                    variant={selectedId === breed.id ? "default" : "secondary"}
                    className={clsx(
                      "h-9 md:h-10 px-4 md:px-6 rounded-xl font-black transition-all whitespace-nowrap",
                      selectedId === breed.id
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                        : "bg-muted/50 text-foreground hover:bg-muted",
                    )}
                  >
                    {selectedId === breed.id ? "تم الاختيار" : "اختيار"}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

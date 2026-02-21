"use client";
import { Check, Thermometer, Zap } from "lucide-react";
import { clsx } from "clsx";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name_en: string;
  price: number;
  image_url?: string;
  stock?: number;
}

interface IncubatorSelectorProps {
  onSelect: (incubator: Product) => void;
  selectedId: string | undefined;
  products: Product[];
}

export function IncubatorSelector({
  onSelect,
  selectedId,
  products,
}: IncubatorSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((incubator) => (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            y: -8,
            boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.15)",
          }}
          whileTap={{ scale: 0.98 }}
          key={incubator.id}
          onClick={() => onSelect(incubator)}
          className={clsx(
            "relative group cursor-pointer border rounded-xl overflow-hidden transition-all duration-300 bg-background",
            selectedId === incubator.id
              ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
              : "border-border/50 hover:border-blue-400/50",
          )}
        >
          <div className="aspect-square relative bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-8">
            {incubator.image_url ? (
              <Image
                src={incubator.image_url}
                alt={incubator.name_en}
                fill
                className="object-cover mix-blend-multiply"
              />
            ) : (
              <Thermometer className="w-20 h-20 text-blue-200" />
            )}

            {selectedId === incubator.id && (
              <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center">
                <div className="bg-blue-600 text-white rounded-full p-3 shadow-md transform scale-110">
                  <Check className="w-8 h-8" strokeWidth={3} />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 text-center">
            <Badge
              variant="outline"
              className="mb-3 border-blue-200 text-blue-700 bg-blue-50"
            >
              Automatic
            </Badge>
            <h3 className="font-bold text-lg mb-2">{incubator.name_en}</h3>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>High Efficiency</span>
            </div>

            <div className="pt-4 border-t border-dashed w-full">
              <span className="font-mono text-xl font-bold text-blue-600 block">
                {incubator.price.toLocaleString()}{" "}
                <span className="text-xs text-muted-foreground">DA</span>
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

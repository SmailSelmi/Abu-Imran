"use client";
import { motion } from "framer-motion";
import { LucideIcon, Sparkles, ShoppingBag, Egg, Star, Truck, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  "shopping-bag": ShoppingBag,
  egg: Egg,
  star: Star,
  truck: Truck,
  heart: Heart,
  zap: Zap,
};

interface SectionDividerProps {
  iconName?: string;
  icon?: LucideIcon; // Keep for backward compatibility if needed, but discouraged in RSC
  className?: string;
}

export function SectionDivider({ iconName, icon, className }: SectionDividerProps) {
  const Icon = (iconName ? ICON_MAP[iconName] : icon) || Sparkles;

  return (
    <div className={cn("relative py-12 flex items-center justify-center overflow-hidden", className)}>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border/50 shadow-sm"
      >
        <Icon className="h-5 w-5 text-emerald-600/80" />
      </motion.div>
    </div>
  );
}

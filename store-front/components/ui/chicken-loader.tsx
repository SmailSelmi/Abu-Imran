"use client";
import { motion } from "framer-motion";

interface ChickenLoaderProps {
  /**
   * 'dashboard' = white/orange for dark backgrounds
   * 'store' = emerald/zinc for consistent store branding
   */
  mode?: "dashboard" | "store";
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

// Chicken Footprint SVG
const ChickenFootprint = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 4L12 14 M12 14L6 20 M12 14L18 20"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

export default function ChickenLoader({
  mode = "store",
  size = "md",
  showText = true,
}: ChickenLoaderProps) {
  const colorClass =
    mode === "dashboard" ? "text-orange-500" : "text-emerald-600";

  const sizeClass =
    size === "sm" ? "w-4 h-4" : 
    size === "md" ? "w-6 h-6" :
    size === "lg" ? "w-10 h-10" : "w-16 h-16";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        repeat: Infinity,
        repeatDelay: 0.5,
      },
    },
  };

  const footprintVariants: any = {
    hidden: { opacity: 0, scale: 0.3, y: 10, filter: "blur(4px)" },
    show: { 
      opacity: [0, 1, 1, 0.4], 
      scale: [0.3, 1.1, 1, 0.9], 
      y: 0, 
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    },
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-6",
      size === "xl" ? "min-h-[300px]" : "py-4"
    )}>
      <motion.div
        className="flex gap-2 md:gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            variants={footprintVariants}
            className={cn(
              colorClass,
              i % 2 === 0 ? "transform -rotate-12 mt-2" : "transform rotate-12 mb-2"
            )}
          >
            <ChickenFootprint className={sizeClass} />
          </motion.div>
        ))}
      </motion.div>

      {showText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-1"
        >
          <p className={cn(
            "text-sm font-black tracking-widest uppercase italic animate-pulse",
            mode === "dashboard" ? "text-zinc-400" : "text-emerald-600/80"
          )}>
            جاري المعالجة...
          </p>
          <div className="w-12 h-1 bg-emerald-500/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

import { cn } from "@/lib/utils";

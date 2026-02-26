"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function LogoLoader({ className, size = "md" }: LogoLoaderProps) {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <motion.div
        className={cn("relative", sizeMap[size])}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Image
          src="/AbuImranLogo.svg"
          alt="Loading..."
          fill
          priority
          className="object-contain dark:invert dark:brightness-200"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-center gap-2"
      >
        <p className="text-sm font-black tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 animate-pulse">
          جاري التحميل...
        </p>
        <div className="w-16 h-1 bg-emerald-500/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}

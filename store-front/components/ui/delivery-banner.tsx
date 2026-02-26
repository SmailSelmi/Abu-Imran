"use client";

import { motion } from "framer-motion";

export function DeliveryBanner() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 h-10 bg-emerald-600 dark:bg-emerald-700 text-white py-2 px-4 z-[70] overflow-hidden flex items-center justify-center"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs md:text-sm font-bold tracking-tight">
        <span className="text-lg leading-none">🇩🇿</span>
        <p className="flex items-center gap-2">
           التوصيل متوفر لـ 58 ولاية جزائرية حصرياً
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </p>
      </div>
      
      {/* Decorative shine effect */}
      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
          delay: 1
        }}
        className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
      />
    </motion.div>
  );
}

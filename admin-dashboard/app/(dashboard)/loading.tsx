"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-emerald-500 rounded-full blur-sm opacity-50" />
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-emerald-600 font-black tracking-tighter text-xl animate-pulse"
      >
        جاري التحميل...
      </motion.p>
    </div>
  );
}

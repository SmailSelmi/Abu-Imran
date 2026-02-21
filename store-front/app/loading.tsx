"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col items-center justify-center">
      <div className="relative scale-150">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 bg-emerald-600 rounded-full" />
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-emerald-600 font-black tracking-[0.2em] text-xs uppercase"
      >
        L O A D I N G
      </motion.p>
    </div>
  );
}

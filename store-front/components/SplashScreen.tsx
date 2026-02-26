"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bird } from "lucide-react";
import Image from "next/image";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Slightly longer for the exit animation to feel natural

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 overflow-hidden"
        >
          {/* Ambient Background Gradient */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_70%)]"
          />

          {/* Animated Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 100,
              delay: 0.2,
            }}
            className="relative mb-12"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
              {/* Pulsing Aura */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl"
              />

              {/* Logo with slight hover-like float */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-24 h-24 md:w-28 md:h-28"
              >
                <Image
                  src="/AbuImranLogo.svg"
                  alt="Abu Imran Logo"
                  fill
                  className="object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.2)] dark:brightness-0 dark:invert"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Branded Text with Reveal */}
          <div className="text-center space-y-4 mb-16 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl font-black tracking-tighter text-emerald-950 dark:text-white"
            >
              أبو عمران
            </motion.h1>
            
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 120, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-sm font-bold text-emerald-800 dark:text-emerald-400/80 italic tracking-widest"
            >
              لدجاج الزينة
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

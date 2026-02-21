"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface ChickenLoaderProps {
  mode?: "dashboard" | "store";
  size?: "sm" | "md" | "lg";
}

export default function ChickenLoader({
  mode = "store",
  size = "md",
}: ChickenLoaderProps) {
  const sizeValue = size === "sm" ? 32 : size === "lg" ? 96 : 64;

  const textClass = mode === "dashboard" ? "text-zinc-400" : "text-zinc-500";

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full gap-6">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
        style={{ width: sizeValue, height: sizeValue }}
      >
        <Image
          src="/icon0.svg"
          alt="Loading..."
          fill
          className="object-contain dark:brightness-0 dark:invert"
        />
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <p
          className={`text-sm font-black tracking-widest uppercase animate-pulse ${textClass}`}
        >
          جاري التحميل...
        </p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

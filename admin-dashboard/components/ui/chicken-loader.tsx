'use client';
import { motion } from "framer-motion";

interface ChickenLoaderProps {
  /**
   * 'dashboard' = white/orange for dark backgrounds
   * 'store' = black/orange for white backgrounds
   */
  mode?: "dashboard" | "store"; 
  size?: "sm" | "md" | "lg";
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
      d="M12 2L12 15 M12 15L5 22 M12 15L19 22"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ChickenLoader({ mode = "store", size = "md" }: ChickenLoaderProps) {
  const colorClass = mode === "dashboard" ? "text-orange-500" : "text-orange-600";
  
  const sizeClass = 
    size === "sm" ? "w-4 h-4" : 
    size === "lg" ? "w-10 h-10" : "w-6 h-6";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, 
        repeat: Infinity,     
        repeatDelay: 1        
      }
    }
  };

  const footprintVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 10 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full gap-4">
      <motion.div
        className="flex gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={footprintVariants} className={`transform -rotate-12 mt-2 ${colorClass}`}>
          <ChickenFootprint className={sizeClass} />
        </motion.div>

        <motion.div variants={footprintVariants} className={`transform rotate-12 mb-2 ${colorClass}`}>
          <ChickenFootprint className={sizeClass} />
        </motion.div>

        <motion.div variants={footprintVariants} className={`transform -rotate-12 mt-2 ${colorClass}`}>
          <ChickenFootprint className={sizeClass} />
        </motion.div>
        
        <motion.div variants={footprintVariants} className={`transform rotate-12 mb-2 ${colorClass}`}>
          <ChickenFootprint className={sizeClass} />
        </motion.div>
      </motion.div>

      <p className={`text-xs font-medium animate-pulse ${mode === 'dashboard' ? 'text-zinc-400' : 'text-zinc-500'}`}>
        Fetching Fresh Data...
      </p>
    </div>
  );
}

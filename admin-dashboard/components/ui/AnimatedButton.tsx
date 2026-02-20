"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type AnimatedButtonProps = React.ComponentProps<typeof Button> & {
  className?: string;
};

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-20 blur-md transition-all duration-500" />
        <Button
          ref={ref}
          className={cn(
            "relative transition-all duration-300 font-black tracking-tight", 
            className
          )}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

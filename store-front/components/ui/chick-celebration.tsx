"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
}

export default function ChickCelebration({ isVisible }: { isVisible: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isVisible) {
      const emojis = ["🐥", "🥚", "✨", "🐣", "🐥"];
      const newParticles: Particle[] = Array.from({ length: 40 }).map((_, i) => ({
        id: Date.now() + i,
        x: 50, // center %
        y: 70, // bottomish %
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: Math.random() * 20 + 20,
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 40,
          y: -Math.random() * 40 - 20,
        },
      }));
      setParticles(newParticles);

      // Cleanup after 3 seconds
      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ 
              opacity: 0, 
              scale: 0, 
              x: `${p.x}vw`, 
              y: `${p.y}vh`,
              rotate: 0 
            }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0, 1.2, 1, 0.8],
              x: `${p.x + p.velocity.x}vw`,
              y: `${p.y + p.velocity.y}vh`,
              rotate: p.rotation + 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2.5, 
              ease: "easeOut",
            }}
            style={{ 
              position: "absolute",
              fontSize: p.size,
              left: 0,
              top: 0
            }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bird } from 'lucide-react'
import Image from 'next/image'

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-zinc-950"
        >
            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                {/* Outer Glow Ring */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl"
                />
                
                {/* Logo Image */}
                <div className="relative z-10 w-24 h-24 md:w-28 md:h-28">
                  <Image 
                    src="/logo-official.png" 
                    alt="Abu Imran Logo" 
                    fill 
                    className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  />
                </div>
              </div>
            </motion.div>

          <div className="loader mb-8 opacity-50"></div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl font-black tracking-tighter text-emerald-950 dark:text-white"
          >
            أبو عمران
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.8 }}
            className="mt-2 text-[10px] font-black uppercase tracking-[0.5em] text-emerald-900 dark:text-emerald-500"
          >
            Premium Genetics
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

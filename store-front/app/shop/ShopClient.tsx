'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Egg, Bird, Drill, ShieldCheck, Truck, Sparkles, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database } from '@/types/supabase'
import { OrderDialog } from '@/components/OrderDialog'

type Product = Database['public']['Tables']['products']['Row'] & {
  families?: Database['public']['Tables']['families']['Row'] | null
  breeds?: Database['public']['Tables']['breeds']['Row'] | null
}

interface ShopClientProps {
  initialProducts: Product[]
}

const CATEGORIES = [
    { id: 'eggs', name: 'Hatching Eggs', name_ar: 'بيض مخصب', icon: Egg, color: 'bg-amber-500', image: 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771339479/03-fertilized-eggs_kbgqer.jpg' },
    { id: 'chicks', name: 'Baby Chicks', name_ar: 'كتاكيت', icon: Bird, color: 'bg-emerald-500', image: 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619701/Australorp_Chicks_n30igr.webp' },
    { id: 'chickens', name: 'Livestock', name_ar: 'دجاج بالغ', icon: Bird, color: 'bg-blue-500', image: 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771619857/Plymouth-Rock-Barry-chiken-silver-abu-imran_gofobu.jpg' },
    { id: 'machine', name: 'Equipment', name_ar: 'عتاد وفقاسات', icon: Drill, color: 'bg-zinc-800', image: 'https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771620999/633635719_122133448574999263_4497762700132453201_n_qizqv4.jpg' },
]

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="space-y-24">
      {/* Category Hub Hero */}
      <section className="space-y-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">
            <Sparkles className="w-4 h-4 me-2" />
            Premium Agriculture Marketplace
          </Badge>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]"
          >
            Direct <span className="text-emerald-600 italic">Farm</span> Access
          </motion.h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium opacity-60 max-w-2xl mx-auto leading-relaxed">
            Select an industry below to place your order directly with Abu Imran Farm. Standardized quality, guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", damping: 20 }}
              className="group cursor-pointer"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="relative h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden border-4 border-transparent hover:border-emerald-500/20 shadow-2xl transition-all duration-700">
                <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                    priority={idx < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end gap-6 z-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`w-20 h-20 ${cat.color} rounded-[2rem] flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                    >
                        <cat.icon className="w-10 h-10" />
                    </motion.div>
                    
                    <div className="space-y-2">
                        <p className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">{cat.name_ar}</p>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter opacity-80 uppercase">{cat.name}</h3>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-black uppercase text-emerald-400 tracking-widest pt-4 group-hover:gap-6 transition-all">
                        <span>Place Order Now</span>
                        <Zap className="w-4 h-4 fill-current animate-pulse" />
                    </div>
                </div>

                {/* Glassy hover effect */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-24 border-y border-border/40">
        <div className="flex flex-col items-center text-center gap-6 group">
            <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                <Truck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
                <h4 className="font-black text-2xl tracking-tight">Express Logistics</h4>
                <p className="text-muted-foreground font-medium italic opacity-60">Delivering to all 58 Wilayas across Algeria.</p>
            </div>
        </div>
        <div className="flex flex-col items-center text-center gap-6 group">
            <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
                <h4 className="font-black text-2xl tracking-tight">Verified Genetics</h4>
                <p className="text-muted-foreground font-medium italic opacity-60">Controlled breeding for maximum performance.</p>
            </div>
        </div>
        <div className="flex flex-col items-center text-center gap-6 group">
            <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
                <h4 className="font-black text-2xl tracking-tight">Secure Checkout</h4>
                <p className="text-muted-foreground font-medium italic opacity-60">Direct ordering with phone confirmation.</p>
            </div>
        </div>
      </div>

      <OrderDialog 
        category={selectedCategory || 'eggs'} 
        isOpen={!!selectedCategory} 
        onClose={() => setSelectedCategory(null)} 
      />
    </div>
  )
}

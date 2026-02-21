'use client'
import { useState } from 'react'
import { Check, Info, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface Product {
    id: string; // Changed from number to string (UUID)
    name_en: string;
    subcategory: string;
    price: number;
    image_url?: string;
    stock?: number;
}

interface SmartBreedSelectorProps {
  onSelect: (breed: Product) => void;
  selectedId: string | undefined; // Changed from number
  products: Product[]; // New prop
}

export function SmartBreedSelector({ onSelect, selectedId, products }: SmartBreedSelectorProps) {
  const [filter, setFilter] = useState<string>('all')

  // Filter products based on subcategory (if needed) or just display passed products
  // Assuming 'products' passed here are already filtered by category (livestock) from parent
  const filteredBreeds = products.filter(product => {
      if (filter === 'all') return true
      return product.subcategory === filter
  })
  
  // Extract unique subcategories for filter buttons
  const subcategories = Array.from(new Set(products.map(p => p.subcategory)))

  return (
    <div className="space-y-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-xl w-fit mx-auto lg:mx-0 border-white/20">
        <button
            onClick={() => setFilter('all')}
            className={clsx(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                filter === 'all' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"
            )}
        >
            All
        </button>
        {subcategories.map(sub => (
            <button
                key={sub}
                onClick={() => setFilter(sub)}
                className={clsx(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all capitalize",
                    filter === sub ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                )}
            >
                {sub}
            </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBreeds.map((breed) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            key={breed.id}
            onClick={() => {
                if (breed.stock !== 0) {
                    onSelect(breed)
                }
            }}
            className={clsx(
              "relative group border rounded-xl overflow-hidden transition-all duration-300 bg-background",
              breed.stock === 0 ? "opacity-75 cursor-not-allowed grayscale-[0.3]" : "cursor-pointer",
              selectedId === breed.id 
                ? "border-green-500 ring-2 ring-green-500/20 shadow-md" 
                : "border-border/50 hover:border-green-500/50"
            )}
          >
            {/* Image Placeholder if url missing */}
            <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                {breed.image_url ? (
                     <Image 
                        src={breed.image_url} 
                        alt={breed.name_en} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                        unoptimized
                     />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                )}
                
                {/* Stock Badges */}
                {breed.stock === 0 ? (
                    <Badge variant="destructive" className="absolute top-3 start-3 bg-red-600 text-white font-black uppercase shadow-lg border-2 border-white/20">نفدت الكمية</Badge>
                ) : breed.stock !== undefined && breed.stock < 10 && breed.stock > 0 ? (
                    <Badge variant="destructive" className="absolute top-3 start-3">Low Stock</Badge>
                ) : null}
                
                {selectedId === breed.id && (
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-primary text-white rounded-full p-4 shadow-md scale-125">
                            <Check className="w-8 h-8" strokeWidth={4} />
                        </div>
                    </div>
                )}
            </div>
            
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-foreground leading-tight mb-1">{breed.name_en}</h3>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{breed.subcategory}</p>
                    </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-dashed border-border/50 flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-black text-foreground">{breed.price.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-muted-foreground ms-1">DA</span>
                    </div>
                    {breed.stock === 0 ? (
                        <Badge variant="secondary" className="h-10 px-6 rounded-xl font-bold bg-muted text-muted-foreground/50 opacity-50 cursor-not-allowed">
                            غير متوفر
                        </Badge>
                    ) : (
                        <Badge variant={selectedId === breed.id ? "default" : "secondary"} className={clsx("h-10 px-6 rounded-xl font-bold transition-colors", selectedId === breed.id ? "bg-primary text-white" : "bg-muted/50")}>
                            {selectedId === breed.id ? "Selected" : "Select"}
                        </Badge>
                    )}
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Truck, ChevronLeft, Minus, Plus, Sparkles, Scale, Thermometer, Zap, Layers, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/supabase'
import { OrderDialog } from '@/components/OrderDialog'

type Product = Database['public']['Tables']['products']['Row']

interface ProductContentProps {
    initialProduct: Product;
    variants: Product[];
    slug: string;
}

export default function ProductContent({ initialProduct, variants, slug }: ProductContentProps) {
  const [selectedVariant, setSelectedVariant] = useState<Product>(initialProduct)
  const [quantity, setQuantity] = useState(1)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)

  const handleOrderNow = () => {
    if (!selectedVariant) return
    if ((selectedVariant.stock || 0) < 1) {
        toast.error('نفدت الكمية!')
        return
    }
    setIsOrderDialogOpen(true)
  }

  const isMachine = variants[0]?.category === 'machine'

  return (
    <div className="min-h-screen bg-background font-sans pb-32 pt-24">
      <div className="container px-4 mx-auto max-w-7xl">
        <Link href="/shop" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-emerald-600 mb-12 transition-all group">
            <ChevronLeft className="w-4 h-4 me-2 group-hover:-translate-x-1 transition-transform" />
            العودة للمتجر
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left Column: Visuals */}
            <div className="space-y-8 sticky top-32">
                <motion.div 
                    layoutId={`image-${slug}`}
                    className="relative aspect-[4/4] bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-border/40 shadow-sm"
                >
                    {selectedVariant?.image_url ? (
                        <Image src={selectedVariant.image_url} alt={selectedVariant.name_en} fill className="object-cover" priority />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">No Image Available</div>
                    )}
                    <div className="absolute inset-0 bg-black/5 opacity-60" />
                    
                    {selectedVariant?.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-md">
                            <span className="bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-xl -rotate-2 border-2 border-white/20 shadow-sm">نفدت الكمية</span>
                        </div>
                    )}
                    
                    <div className="absolute bottom-6 left-6">
                        <Badge className="bg-emerald-600 text-white border-transparent px-4 py-1 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg">
                           <Sparkles className="w-3 h-3 me-2" /> Premium Grade
                        </Badge>
                    </div>
                </motion.div>

                {!isMachine && variants.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {variants.map(v => (
                            <button 
                                key={v.id}
                                onClick={() => setSelectedVariant(v)}
                                className={`relative aspect-square rounded-xl overflow-hidden border transition-all duration-500 ${selectedVariant?.id === v.id ? 'border-emerald-500 shadow-sm scale-105' : 'border-border/40 opacity-40 hover:opacity-100 grayscale hover:grayscale-0'}`}
                            >
                                {v.image_url && <Image src={v.image_url} alt={v.name_en} fill className="object-cover" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Info & Actions */}
            <div className="space-y-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 px-3 py-1 font-black uppercase text-[10px] tracking-widest rounded-full">
                            {selectedVariant?.subcategory || 'Premium Selection'}
                        </Badge>
                        {selectedVariant?.stock && selectedVariant.stock < 10 && selectedVariant.stock > 0 && (
                            <Badge variant="destructive" className="animate-pulse text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-black">
                                كمية محدودة
                            </Badge>
                        )}
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-foreground leading-[0.9] tracking-tighter">
                        {selectedVariant?.name || selectedVariant?.name_en}
                    </h1>
                    
                    <div className="flex items-baseline gap-3 pt-2">
                        <span className="text-5xl font-black text-emerald-600 tracking-tighter tabular-nums italic">
                            {(selectedVariant?.price || 0).toLocaleString()}
                        </span>
                        <span className="text-lg text-muted-foreground font-black opacity-40">DA</span>
                    </div>

                    <p className="text-lg text-muted-foreground font-medium italic opacity-70 leading-relaxed max-w-xl">
                        منتج مختار بعناية من مزرعة أبو عمران — جودة مضمونة وسلالات موثقة.
                    </p>
                </div>

                {/* Technical Specs Layout */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2">
                        <Scale className="w-5 h-5 text-emerald-600 opacity-60" />
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">جودة ممتازة</h5>
                        <p className="text-sm font-bold italic">الدرجة الأولى</p>
                    </div>
                    <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2">
                        <Layers className="w-5 h-5 text-emerald-600 opacity-60" />
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">نوع السلالة</h5>
                        <p className="text-sm font-bold italic">نسب أصيل</p>
                    </div>
                    {isMachine && (
                      <>
                        <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2">
                            <Zap className="w-5 h-5 text-emerald-600 opacity-60" />
                             <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">استهلاك الكهرباء</h5>
                             <p className="text-sm font-bold italic">موفر للطاقة</p>
                        </div>
                        <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2">
                            <Thermometer className="w-5 h-5 text-emerald-600 opacity-60" />
                             <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">التحكم في الحرارة</h5>
                             <p className="text-sm font-bold italic">رقمي دقيق</p>
                        </div>
                      </>
                    )}
                </div>

                {/* Direct Order Component */}
                <div className="relative group/order">
                    <div className="relative bg-white dark:bg-zinc-950 border border-border/40 rounded-xl p-8 md:p-12 shadow-sm overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShoppingBag className="w-24 h-24" />
                        </div>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black tracking-tight italic flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shadow-lg rotate-3 group-hover/order:rotate-0 transition-transform">1X</span>
                                     طلب مباشر
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/80 bg-muted/20">
                                        <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-lg">
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black uppercase tracking-widest">توصيل للباب</p>
                                            <p className="text-xs font-bold italic opacity-60">58 ولاية</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border/80 bg-muted/20">
                                        <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black uppercase tracking-widest">مؤمّن</p>
                                            <p className="text-xs font-bold italic opacity-60">ضمان النجاح</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-dashed border-border flex flex-col gap-8">
                                <div className="flex items-center justify-between">
                                     <span className="font-black text-xs text-muted-foreground uppercase tracking-[0.3em]">اختر الكمية</span>
                                    <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-xl border border-border shadow-inner">
                                        <Button 
                                            type="button" variant="ghost" size="icon" 
                                            className="h-10 w-10 hover:bg-white hover:text-emerald-600 rounded-lg shadow-sm"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Button>
                                        <div className="w-10 text-center font-black text-xl tabular-nums italic">{quantity}</div>
                                        <Button 
                                            type="button" variant="ghost" size="icon" 
                                            className="h-10 w-10 hover:bg-white hover:text-emerald-600 rounded-lg shadow-sm"
                                            disabled={quantity >= (selectedVariant?.stock || 100)}
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Button 
                                    type="button" 
                                    size="lg" 
                                    onClick={handleOrderNow}
                                    className="w-full h-20 rounded-xl shadow-sm hover:shadow hover:-translate-y-1 transition-all duration-500 font-black text-2xl bg-emerald-600 hover:bg-emerald-700 text-white overflow-hidden group/btn"
                                    disabled={(selectedVariant?.stock || 0) < 1}
                                >
                                         <span className="flex items-center justify-between w-full px-4">
                                             <span>تأكيد الطلب</span>
                                             <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-black italic shadow-inner group-hover/btn:scale-110 transition-transform">{(selectedVariant?.price || 0) * quantity} دج</span>
                                         </span>
                                </Button>
                                
                                 <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 flex items-center justify-center gap-2">
                                     <Sparkles className="w-3 h-3 text-emerald-500" /> الدفع عند الاستلام
                                 </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <OrderDialog 
        isOpen={isOrderDialogOpen} 
        onClose={() => setIsOrderDialogOpen(false)} 
        product={selectedVariant}
        quantity={quantity}
      />
    </div>
  )
}

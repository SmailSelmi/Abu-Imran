'use client'
import { motion } from 'framer-motion'
import { ArrowUpRight, ShieldCheck, Target } from 'lucide-react'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/I18nContext'
import { cn } from '@/lib/utils'

import { Database } from '@/types/supabase'

type ProductWithBreed = Database['public']['Tables']['products']['Row'] & {
    breed: Database['public']['Tables']['breeds']['Row'] | null
}

interface PortfolioSectionProps {
    initialProducts?: ProductWithBreed[]
}

const FALLBACK_BREEDS = [
    {
        id: 'brahma',
        name: 'Brahma Pura',
        color: 'gold',
        image: '/brahma_chicken_elite_1771591463166.png',
        stats: { genetics: '99%', purity: 'Elite' }
    },
    {
        id: 'sebright',
        name: 'Sebright Royal',
        color: 'silver',
        image: '/sebright_chicken_elite_1771591477248.png',
        stats: { genetics: '98%', purity: 'Champion' }
    },
    {
        id: 'eggs',
        name: 'Premium Eggs',
        color: 'emerald',
        image: '/hatching_eggs_premium_1771591503549.png',
        stats: { genetics: 'Export', purity: 'High-Hatch' }
    }
]

export default function PortfolioSection({ initialProducts = [] }: PortfolioSectionProps) {
    const { t, isRTL } = useI18n()

    // Map DB products to UI structure, fallback to premium static data if none
    const displayBreeds = initialProducts.length > 0 
        ? initialProducts.map(p => ({
            id: p.id,
            name: p.name || (isRTL ? p.breed?.name_ar : p.breed?.name_en) || p.name_en,
            color: p.category === 'eggs' ? 'emerald' : 'gold',
            image: p.image_url || '/placeholder.png',
            stats: { 
                genetics: p.category === 'eggs' ? 'Export' : '99%', 
                purity: p.category === 'eggs' ? t.portfolio.purityHighHatch : t.portfolio.purityElite 
            }
        }))
        : FALLBACK_BREEDS.map(b => ({
            ...b,
            name: b.id === 'brahma' ? t.portfolio.brahma : 
                  b.id === 'sebright' ? t.portfolio.sebright : 
                  t.portfolio.eggs,
            stats: {
                ...b.stats,
                purity: b.id === 'brahma' ? t.portfolio.purityElite :
                        b.id === 'sebright' ? t.portfolio.purityChampion :
                        t.portfolio.purityHighHatch
            }
        }))


    return (
        <section className="py-32 bg-white dark:bg-black overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 gap-12">
                    <div className="max-w-3xl space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4"
                        >
                            <span className="w-12 h-px bg-emerald-500" />
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em]">
                                {t.portfolio.badge}
                            </span>
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-zinc-900 dark:text-zinc-100"
                        >
                            {t.portfolio.titlePrefix} <br /> 
                            <span className="text-primary italic ps-4">{t.portfolio.titleAccent}</span>
                        </motion.h2>

                    </div>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="max-w-xs space-y-4"
                    >
                        <p className="text-muted-foreground font-bold text-lg italic opacity-40 leading-relaxed">
                            {t.portfolio.description}
                        </p>
                        <div className="h-1 w-20 bg-emerald-500/20 rounded-full" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayBreeds.map((breed, i) => (
                        <motion.div 
                            key={breed.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-700 group-hover:rounded-[2rem] group-hover:scale-[0.98]">
                                <Image
                                    src={breed.image} 
                                    alt={breed.name} 
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                                
                                <div className="absolute inset-0 p-12 flex flex-col justify-end text-white space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center border-white/20 shadow-2xl">
                                            <ShieldCheck className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="px-5 py-2 rounded-full border border-white/20 bg-primary/20 backdrop-blur-md">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                                {breed.stats.purity}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h3 className="text-5xl font-black tracking-tighter uppercase leading-none italic">
                                            {breed.name}
                                        </h3>
                                        <div className="h-1.5 w-12 bg-primary rounded-full group-hover:w-full transition-all duration-700" />
                                    </div>


                                    <div className="flex items-center justify-between group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <div className="flex gap-8">
                                           <div className="space-y-1">
                                               <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">{t.portfolio.genetics}</p>
                                               <p className="text-sm font-black italic">
                                                   {breed.id === 'eggs' ? 'Export' : '99%'}
                                               </p>
                                           </div>
                                        </div>
                                        <div className="w-14 h-14 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-transform delay-100 group-hover:shadow-primary/30">
                                            <ArrowUpRight className={cn("w-7 h-7 transition-transform", isRTL ? "rotate-180" : "group-hover:rotate-45")} />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Target className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-black tracking-tight">{t.portfolio.standards}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">{t.portfolio.quality}</p>
                        </div>
                    </div>
                    <div className="w-px h-12 bg-border hidden md:block" />
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-amber-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xl font-black tracking-tight">{t.portfolio.protection}</p>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">{t.portfolio.purity}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

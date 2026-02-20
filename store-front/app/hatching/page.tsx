'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Calendar, Egg, Users, 
    CheckCircle, ShieldCheck, ChevronRight, 
    Thermometer, Activity, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useI18n } from '@/lib/i18n/I18nContext'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'
import { Database } from '@/types/supabase'
import { useSearchParams } from 'next/navigation'

function HatchingPageContent() {

    const { t, isRTL, locale } = useI18n()
    const supabase = createClient()
    const [breeds, setBreeds] = useState<Database['public']['Tables']['breeds']['Row'][]>([])
    const [config, setConfig] = useState({ max_capacity: 500, price_per_egg: 50, duration_days: 21 })
    const [loading, setLoading] = useState(true)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    
    const searchParams = useSearchParams()
    
    const [selectedBreed, setSelectedBreed] = useState<string>(searchParams.get('breed') || '')
    const [eggCount, setEggCount] = useState<number>(Number(searchParams.get('count')) || 10)
    const [startDate, setStartDate] = useState<string>(searchParams.get('date') || new Date().toISOString().split('T')[0])


    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const [breedRes, configRes] = await Promise.all([
                    supabase.from('breeds').select('*'),
                    supabase.from('app_settings').select('value').eq('key', 'hatching_config').single()
                ])
                
                if (breedRes.data) setBreeds(breedRes.data as any[])
                if (configRes.data) setConfig(configRes.data.value as any)
            } catch (err) {
                console.error('Error loading hatching data:', err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const totalPrice = eggCount * config.price_per_egg
    const endDate = new Date(new Date(startDate).getTime() + config.duration_days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setBookingLoading(true)

        const formData = new FormData(e.currentTarget)
        const customerPhone = formData.get('phone') as string

        const supabase = createClient()
        try {
            const bookingPayload = {
                p_customer_name: formData.get('name') as string,
                p_phone_number: customerPhone,
                p_wilaya: formData.get('wilaya') as string,
                p_address: formData.get('address') as string,
                p_breed_id: selectedBreed || null,
                p_egg_count: eggCount,
                p_start_date: startDate,
                p_end_date: endDate,
                p_total_price: totalPrice,
                p_notes: `Breed: ${selectedBreed ? breeds.find(b => b.id === selectedBreed)?.[`name_${locale}`] || 'ID:' + selectedBreed : 'Custom'}`
            }

            // @ts-ignore - Bypass stale types for new RPC
            const { data: rpcData, error: rpcErr } = await (supabase as any).rpc('place_hatching_booking', bookingPayload)

            if (rpcErr) throw rpcErr

            if (rpcData && rpcData.success) {
                setSuccess(true)
                toast.success(isRTL ? 'تم تسجيل حجزك بنجاح!' : 'Booking recorded!')
            } else {
                throw new Error(rpcData?.error || 'Booking failed')
            }
        } catch (err: any) {
            toast.error(isRTL ? 'فشل الحجز: ' + err.message : err.message || 'Booking failed')
        } finally {
            setBookingLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-32">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-xl p-8 md:p-12 max-w-xl w-full text-center space-y-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 start-0 w-full h-2 bg-emerald-600" />
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-5xl shadow-inner border-4 border-white dark:border-zinc-900">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-foreground tracking-tighter">
                            {isRTL ? 'تم تأكيد الحجز!' : 'Reservation Processed!'}
                        </h2>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                            {isRTL 
                                ? <>لقد قمنا بحجز مكان لـ <span className="text-foreground font-black">{eggCount} بيضة</span>. يرجى إحضارها إلى المزرعة في <span className="text-emerald-600 font-black">{startDate}</span>.</>
                                : <>We've reserved space for <span className="text-foreground font-black">{eggCount} eggs</span>. Please bring them to the farm on <span className="text-emerald-600 font-black">{startDate}</span>.</>
                            }
                        </p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-6 text-end space-y-2 border border-border">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                             <span>{isRTL ? 'تاريخ التفقيس المتوقع' : 'Estimated Hatching Date'}</span>
                             <span className="text-[14px] text-foreground">{endDate}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                             <span>{isRTL ? 'رسوم الخدمة' : 'Service Fee'}</span>
                             <span className="text-[14px] text-emerald-600 tabular-nums">{totalPrice} {isRTL ? 'د.ج' : 'DA'}</span>
                         </div>
                    </div>
                    <Button onClick={() => window.location.href = '/'} className="w-full text-xl h-16 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-black transition-all shadow-md shadow-emerald-500/20">
                        {t.common.home}
                    </Button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Hero Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
                    <div className="space-y-8 text-center lg:text-end">
                        <Badge className="bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20 border-none px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em]">
                            {t.hatching.badge}
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.95] drop-shadow-sm">
                            {t.hatching.title}<br />
                            <span className="text-emerald-600 italic">{t.hatching.titleAccent}</span>
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            {t.hatching.description}
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            <div className="flex items-center gap-3 bg-card border border-border/50 px-5 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                                    <Thermometer className="w-5 h-5 text-emerald-600" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight">{t.hatching.precision}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-card border border-border/50 px-5 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight">{t.hatching.oxygen}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-card border border-border/50 px-5 py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                                    <Clock className="w-5 h-5 text-amber-600" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight">{t.hatching.cycle}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="relative aspect-square glass-card rounded-xl flex items-center justify-center p-12 overflow-hidden group border-2 border-emerald-500/10 shadow-[0_0_100px_rgba(16,185,129,0.05)]">
                           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />
                           <motion.div 
                             animate={{ 
                                y: [0, -20, 0],
                                rotate: [0, 2, -2, 0]
                             }}
                             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                             className="relative z-10 w-4/5 h-4/5 flex items-center justify-center"
                           >
                                <Icon 
                                    src="https://cdn.lordicon.com/lpddubrl.json" 
                                    size={300} 
                                    trigger="loop"
                                    colors={{ primary: '#059669', secondary: '#10b981' }}
                                    className="opacity-90"
                                />
                           </motion.div>
                           
                           {/* Floating Capacity Badge */}
                           <motion.div 
                             initial={{ y: 50, opacity: 0 }}
                             animate={{ y: 0, opacity: 1 }}
                             className="absolute bottom-8 end-8 md:bottom-12 md:end-12 bg-white dark:bg-zinc-900 px-8 py-6 rounded-xl shadow-md border border-border/50 flex flex-col gap-1 items-center ring-4 ring-emerald-500/5"
                           >
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                                    <Users className="w-6 h-6 text-emerald-600" />
                                </div>
                                <span className="text-4xl font-black tracking-tighter tabular-nums">{config.max_capacity}</span>
                                <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t.hatching.spots}</span>
                           </motion.div>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 pt-12">
                    <div className="lg:col-span-1 space-y-6">
                         <div className="bg-emerald-600 text-white p-10 rounded-xl shadow-md shadow-emerald-600/20 space-y-10 relative overflow-hidden group">
                            <div className="absolute -top-12 -end-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                            <h3 className="text-3xl font-black tracking-tighter relative z-10">{t.hatching.howItWorks}</h3>
                            <div className="space-y-8 relative z-10">
                                {[
                                    { step: 1, text: t.hatching.step1 },
                                    { step: 2, text: t.hatching.step2 },
                                    { step: 3, text: t.hatching.step3 },
                                    { step: 4, text: t.hatching.step4 }
                                ].map((s) => (
                                    <div key={s.step} className="flex gap-5 group/item">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-sm shrink-0 border border-white/20 group-hover/item:bg-white/30 transition-colors">
                                            {s.step}
                                        </div>
                                        <p className="text-sm font-medium leading-[1.6] opacity-90">{s.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-8 border-t border-white/10 flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.hatching.serviceFee}</p>
                                    <div className="text-4xl font-black tabular-nums">{config.price_per_egg} {isRTL ? 'د.ج' : 'DA'} <span className="text-sm opacity-60 font-medium">{t.hatching.perEgg}</span></div>
                                </div>
                                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <ShieldCheck className="w-8 h-8 text-white/80" />
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-card border border-border/50 rounded-xl p-8 md:p-16 shadow-md relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.02)]">
                            <div className="absolute top-0 start-0 w-48 h-48 bg-emerald-500/5 rounded-br-full -z-10" />
                            <h2 className="text-4xl font-black tracking-tighter mb-12 flex items-center gap-5">
                                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                    <Egg className="w-8 h-8 text-emerald-600" />
                                </div>
                                {t.hatching.reserve}
                            </h2>

                            <form onSubmit={handleBooking} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ms-1">{t.hatching.selectBreed}</Label>
                                        <select 
                                          value={selectedBreed}
                                          onChange={e => setSelectedBreed(e.target.value)}
                                          className="w-full h-16 bg-muted/40 border-2 border-transparent rounded-xl px-6 font-black transition-all focus:border-emerald-500/30 focus:bg-background focus:ring-0 appearance-none"
                                        >
                                            <option value="">{t.hatching.customBreed}</option>
                                            {breeds.map(b => (
                                                <option key={b.id} value={b.id}>{b[`name_${locale}`] || b.name_en}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ms-1">{t.hatching.eggCount}</Label>
                                        <div className="flex gap-4 items-center">
                                            <Input 
                                                type="number" required min="1" max={config.max_capacity}
                                                value={eggCount}
                                                onChange={e => setEggCount(Number(e.target.value))}
                                                className="h-16 bg-muted/40 border-2 border-transparent rounded-xl px-6 font-black text-xl focus:border-emerald-500/20 focus:bg-background transition-all" 
                                            />
                                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap opacity-60">
                                                / {config.max_capacity} {t.hatching.max}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ms-1">{t.hatching.dropDate}</Label>
                                        <div className="relative">
                                            <Input 
                                                type="date" required 
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                                className="h-16 bg-muted/40 border-2 border-transparent rounded-xl pe-12 font-black transition-all focus:border-emerald-500/20 focus:bg-background" 
                                            />
                                            <Calendar className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 opacity-60" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ms-1">{t.hatching.fullName}</Label>
                                        <Input name="name" required placeholder="..." className="h-16 bg-muted/40 border-2 border-transparent rounded-xl px-6 font-black focus:border-emerald-500/20 focus:bg-background transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ms-1">{t.hatching.phone}</Label>
                                        <Input name="phone" required type="tel" placeholder="05 / 06 / 07 ..." className="h-16 bg-muted/40 border-2 border-transparent rounded-xl px-6 font-black focus:border-emerald-500/20 focus:bg-background transition-all" />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ms-1">{t.hatching.wilaya}</Label>
                                        <Input name="wilaya" required placeholder="..." className="h-16 bg-muted/40 border-2 border-transparent rounded-xl px-6 font-black focus:border-emerald-500/20 focus:bg-background transition-all" />
                                    </div>
                                </div>

                                <div className="pt-12 border-t-2 border-border border-dashed">
                                     <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="space-y-2 text-center md:text-end">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{t.hatching.estimatedCost}</p>
                                            <h4 className="text-5xl md:text-6xl font-black text-emerald-600 tabular-nums tracking-tighter italic">
                                                {totalPrice.toLocaleString()} <span className="text-2xl not-italic opacity-80">{isRTL ? 'د.ج' : 'DA'}</span>
                                            </h4>
                                        </div>
                                        <Button 
                                            type="submit" 
                                            disabled={bookingLoading}
                                            className="h-20 w-full md:w-auto px-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-2xl shadow-md shadow-emerald-600/30 group transition-all"
                                        >
                                            {bookingLoading ? t.hatching.processing : (
                                                <span className="flex items-center gap-3">
                                                    {t.hatching.confirm}
                                                    <ChevronRight className={cn("w-6 h-6 group-hover:translate-x-1 transition-transform", isRTL && "rotate-180 group-hover:-translate-x-1")} />
                                                </span>
                                            )}
                                        </Button>
                                     </div>
                                     <p className="text-center md:text-end text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-8 flex items-center gap-3 opacity-40 justify-center md:justify-start">
                                         <ShieldCheck className="w-4 h-4 text-emerald-500" /> {t.hatching.shield}
                                     </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function HatchingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background pt-32 flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div></div>}>
            <HatchingPageContent />
        </Suspense>
    )
}

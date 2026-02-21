'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Customer } from '@/types/orders'
import { Search, MapPin, Phone, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Link from 'next/link'
import ChickenLoader from "@/components/ui/chicken-loader"
import { Icon } from '@/components/ui/Icon'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Partial<Customer>[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'spent' | 'orders' | 'reliability'>('spent')
  const supabase = createClient()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('customers')
      .select('id, full_name, phone, notes, tags, total_spent, total_orders, reliability_score')
      .order('total_spent', { ascending: false })

    
    if (error) {
        console.error('Error fetching customers:', error)
        toast.error('Failed to load customers.')
        setCustomers((data as unknown as Partial<Customer>[]) || [])
    }
    setLoading(false)
  }

  const getCustomerTier = (spent: number = 0) => {
      if (spent >= 500000) return { label: 'بلاتيني', color: 'bg-indigo-600 text-white shadow-indigo-500/20', icon: '💎' };
      if (spent >= 150000) return { label: 'ذهبي', color: 'bg-amber-500 text-white shadow-amber-500/20', icon: '⭐' };
      if (spent >= 50000) return { label: 'فضي', color: 'bg-slate-400 text-white shadow-slate-400/20', icon: '🥈' };
      return { label: 'برونزي', color: 'bg-orange-600/80 text-white shadow-orange-600/10', icon: '🥉' };
  }

  const getReliabilityLevel = (score: number) => {
      if (score >= 90) return { label: 'موثوق', color: 'text-emerald-600 bg-emerald-100', icon: 'https://cdn.lordicon.com/lomfljuq.json' }
      if (score < 70) return { label: 'تحذير', color: 'text-red-600 bg-red-100', icon: 'https://cdn.lordicon.com/tdrtiskw.json' }
      return { label: 'عادي', color: 'text-muted-foreground bg-muted', icon: 'https://cdn.lordicon.com/bgebyztw.json' }
  }

  const filteredCustomers = customers
    .filter(c => 
        c.full_name?.toLowerCase().includes(search.toLowerCase()) || 
        c.phone?.includes(search) || 
        c.notes?.toLowerCase().includes(search.toLowerCase()) ||
        c.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
        if (sortBy === 'spent') return (b.total_spent || 0) - (a.total_spent || 0)
        if (sortBy === 'orders') return (b.total_orders || 0) - (a.total_orders || 0)
        if (sortBy === 'reliability') return (b.reliability_score || 0) - (a.reliability_score || 0)
        return 0
    })

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><ChickenLoader mode="dashboard" /></div>

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Icon src="https://cdn.lordicon.com/pdsourfn.json" trigger="loop" size={32} />
                </div>
                <h1 className="text-4xl font-black tracking-tighter">قاعدة بيانات الزبائن</h1>
            </div>
            <p className="text-muted-foreground font-bold text-lg max-w-xl">إدارة العلاقات مع العملاء وتتبع القيم التراكمية (CLV) وموثوقية الطلبات.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-card rounded-xl shadow-sm border border-border/50 shrink-0">
                {(['spent', 'orders', 'reliability'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setSortBy(type)}
                        className={clsx(
                            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            sortBy === type ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        {type === 'spent' ? 'الأكثر إنفاقاً' : type === 'orders' ? 'عدد الطلبات' : 'الموثوقية'}
                    </button>
                ))}
            </div>

            <div className="relative flex-1 sm:w-[400px]">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground opacity-50" />
                <Input 
                    placeholder="ابحث بالاسم، الهاتف، أو الوسوم..." 
                    className="pr-12 h-14 rounded-xl border-none bg-white dark:bg-card shadow-sm focus:ring-emerald-500/10 transition-all font-black" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredCustomers.map((customer) => {
              const rel = getReliabilityLevel(customer.reliability_score || 0);
              const tier = getCustomerTier(customer.total_spent || 0);
              return (
                  <Link href={`/customers/${customer.id}`} key={customer.id} className="block group">
                      <Card className="h-full border border-border/40 shadow-sm group-hover:shadow-sm transition-all duration-500 rounded-xl overflow-hidden bg-white dark:bg-card cursor-pointer relative">
                          <div className={clsx("absolute top-0 right-0 left-0 h-1.5 opacity-30", tier.color.split(' ')[0])} />
                          
                          <CardHeader className="p-7 pb-4">
                              <div className="flex items-start justify-between mb-4">
                                  <div className="h-16 w-16 rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden shadow-inner relative">
                                      <Icon src={rel.icon} trigger="hover" size={40} />
                                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center text-xs">
                                          {tier.icon}
                                      </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2 text-right">
                                      <Badge className={clsx(
                                          "rounded-xl border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 shadow-md",
                                          tier.color
                                      )}>
                                          فئة {tier.label}
                                      </Badge>
                                      <Badge className={clsx(
                                          "rounded-xl border-none font-black text-[9px] uppercase tracking-widest px-3 py-1",
                                          rel.color
                                      )}>
                                          {rel.label}
                                      </Badge>
                                  </div>
                              </div>
                              <div className="min-w-0">
                                  <CardTitle className="text-2xl font-black truncate group-hover:text-emerald-600 transition-colors tracking-tighter">{customer.full_name}</CardTitle>
                                  <CardDescription className="flex items-center gap-1 font-bold text-sm tracking-tight opacity-70 mt-1">
                                      <Phone className="h-3 w-3" /> {customer.phone}
                                  </CardDescription>
                              </div>
                          </CardHeader>
                          
                          <CardContent className="px-7 pb-7">
                              <div className="space-y-6">
                                  <div className="grid grid-cols-3 gap-3">
                                      <div className="text-center p-3 bg-muted/20 rounded-xl border border-transparent hover:border-emerald-500/10 transition-colors">
                                          <div className="text-xl font-black tracking-tighter">{customer.total_orders || 0}</div>
                                          <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">طلبيات</div>
                                      </div>
                                      <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-500/10">
                                          <div className="text-[17px] font-black tracking-tighter text-emerald-600 truncate">{(customer.total_spent || 0).toLocaleString()}</div>
                                          <div className="text-[10px] font-black uppercase text-emerald-800/50 dark:text-emerald-400/50 tracking-widest">LTV</div>
                                      </div>
                                      <div className="text-center p-3 bg-muted/20 rounded-xl border border-transparent hover:border-emerald-500/10 transition-colors">
                                          <div className="text-xl font-black tracking-tighter">{customer.reliability_score || 0}%</div>
                                          <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">ثقة</div>
                                      </div>
                                  </div>

                                  <div className="flex flex-wrap gap-1.5">
                                      {customer.tags?.map(tag => (
                                          <Badge key={tag} variant="secondary" className="px-2 py-0 h-5 text-[9px] font-black border-none bg-muted rounded-md uppercase opacity-80">
                                              #{tag}
                                          </Badge>
                                      ))}
                                      {customer.tags?.length === 0 && (
                                          <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">بدون وسوم</span>
                                      )}
                                  </div>

                                  {customer.notes && (
                                      <div className="bg-orange-50 dark:bg-orange-500/5 p-4 rounded-xl text-[12px] text-orange-800 dark:text-orange-200 font-bold border border-orange-100 dark:border-orange-500/10 line-clamp-2 italic leading-relaxed">
                                          "{customer.notes}"
                                      </div>
                                  )}

                                  <div className="flex items-center justify-between pt-2">
                                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden me-4">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${customer.reliability_score || 0}%` }}
                                            className={clsx(
                                                "h-full rounded-full",
                                                (customer.reliability_score || 0) >= 90 ? "bg-emerald-500" : (customer.reliability_score || 0) >= 70 ? "bg-amber-500" : "bg-red-500"
                                            )} 
                                          />
                                      </div>
                                      <span className="text-[10px] font-black text-muted-foreground">SCORE</span>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  </Link>
              );
          })}
          {filteredCustomers.length === 0 && (
              <div className="col-span-full text-center py-24 bg-muted/10 rounded-xl border-2 border-dashed border-muted">
                  <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <Icon src="https://cdn.lordicon.com/dxjqvkzv.json" trigger="loop" size={64} />
                  </div>
                  <h3 className="text-2xl font-black opacity-30">لا توجد بيانات مطابقة</h3>
                  <p className="text-muted-foreground font-black mt-2">جرب البحث بكلمات مختلفة للعثور على الزبون.</p>
              </div>
          )}
      </div>
    </div>
  )
}


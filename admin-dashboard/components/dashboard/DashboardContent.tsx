'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, ArrowUpRight, 
  ShoppingCart, Users, Activity, TrendingUp, Truck, DollarSign,
  Printer, Download
} from "lucide-react"
import Link from 'next/link'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { 
    PerformanceMetrics, 
    type RevenueDataPoint, 
    type ProductSalePoint, 
    type CategoryRevenuePoint 
} from '@/components/analytics/PerformanceMetrics'
import type { Database } from '@/types/supabase'

const AlgeriaMap = dynamic(() => import('@/components/ui/AlgeriaMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] animate-pulse bg-muted rounded-xl" />
})

type Order = Database['public']['Tables']['orders']['Row']

export interface DashboardStats {
  revenue: number
  activeOrders: number
  criticalStock: number
  activeUniqueCustomers: number
  totalCustomers: number
  avgOrderValue: number
  topBreed: string
  revenueChange: number
  ordersChange: number
}

export interface Alert {
  type: 'critical' | 'warning'
  message: string
  link?: string
  label: string
}

export interface Forecast {
  name: string
  daysLeft: number
  stock: number | null
}

export interface AnalyticsData {
  revenueData: RevenueDataPoint[]
  topProducts: ProductSalePoint[]
  categoryData: CategoryRevenuePoint[]
  wilayaData: Record<string, number>
}

interface DashboardContentProps {
  stats: DashboardStats
  alerts: Alert[]
  forecasts: Forecast[]
  recentActivity: Order[]
  analyticsData: AnalyticsData
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function DashboardContent({ 
  stats, 
  alerts, 
  forecasts, 
  recentActivity, 
  analyticsData 
}: DashboardContentProps) {
  const supabase = createClient()

  const exportDailyCSV = async () => {
    const today = new Date().toISOString().split('T')[0]
    const { data: orders, error } = await supabase
        .from('orders')
        .select('id, customer_name, phone_number, product_name, product_variant, quantity, total_amount, status')
        .gte('created_at', today)
    
    if (error || !orders) {
        toast.error('فشل في جلب طلبات اليوم')
        return
    }

    if (orders.length === 0) {
        toast.info('لا توجد طلبات مسجلة اليوم.')
        return
    }

    const headers = ['رقم الطلب', 'الزبون', 'الهاتف', 'المنتج', 'النوع', 'الكمية', 'المجموع', 'الحالة']
    const rows = orders.map((o) => [
        `#${o.id.slice(0, 8)}`,
        o.customer_name || 'N/A',
        o.phone_number || 'N/A',
        o.product_name,
        o.product_variant,
        o.quantity,
        o.total_amount,
        o.status
    ])

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `mazra3a_report_${today}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase">لوحة التحكم</h1>
           <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm mt-1">المزرعة • مركز التحكم والعمليات</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1 sm:flex-none rounded-2xl border-2 font-black uppercase text-[10px] sm:text-xs tracking-widest px-2 sm:px-6 h-10 sm:h-11 hover:bg-zinc-100 dark:bg-zinc-800 transition-all border-zinc-200"
            >
                <Printer className="w-4 h-4 ms-1.5" /> <span className="hidden sm:inline">طباعة التقرير</span>
                <span className="sm:hidden">طباعة</span>
            </Button>
            <Button
                onClick={exportDailyCSV}
                className="flex-1 sm:flex-none rounded-2xl bg-zinc-900 dark:bg-zinc-100 dark:bg-zinc-800 text-zinc-100 dark:text-zinc-900 font-black uppercase text-[10px] sm:text-xs tracking-widest px-2 sm:px-6 h-10 sm:h-11 hover:scale-105 transition-all shadow-sm"
            >
                <Download className="w-4 h-4 ms-1.5" /> <span className="hidden sm:inline">تصدير CSV</span>
                <span className="sm:hidden">تصدير</span>
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12 md:grid-rows-1">
        {/* Total Revenue */}
        <motion.div variants={item} className="md:col-span-8 md:row-span-1">
            <Card className="h-full border-none shadow-premium bg-gradient-to-br from-primary to-primary/80 text-white relative overflow-hidden rounded-3xl p-4 md:p-6 group">
                <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <DollarSign className="w-64 h-64" />
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">إجمالي الإيرادات</span>
                        <div className="text-5xl font-black tracking-tighter mt-2">{stats.revenue.toLocaleString()} <span className="text-xl opacity-70 italic font-sans">د.ج</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs text-white font-black bg-white/20 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2">
                            <ArrowUpRight className="h-4 w-4" /> {stats.revenueChange}%
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">مقارنة بالأسبوع الماضي</span>
                    </div>
                </div>
            </Card>
        </motion.div>


        {/* Active Orders */}
        <motion.div variants={item} className="md:col-span-4 md:row-span-1">
            <Card className="h-full border border-border/40 shadow-sm bg-white dark:bg-zinc-950 rounded-3xl relative overflow-hidden p-4 md:p-6 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -me-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex flex-row items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-50">الطلبات النشطة</span>
                        <div className="p-3 bg-primary/5 dark:bg-primary/10 rounded-2xl text-primary shadow-sm group-hover:rotate-12 transition-transform">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                    </div>
                    <div>
                        <div className="text-5xl font-black tracking-tighter tabular-nums">{stats.activeOrders}</div>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                                />
                            </div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">تجهيز</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>


        {/* Top Breed */}
        <motion.div variants={item} className="md:col-span-3 md:row-span-1">
            <Card className="h-full border-none shadow-premium bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-3xl relative overflow-hidden p-4 md:p-6 group">
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex flex-row items-center justify-between">
                         <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">الأكثر مبيعاً</span>
                         <TrendingUp className="h-5 w-5 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                        <div className="text-2xl font-black tracking-tight truncate uppercase text-zinc-900 dark:text-zinc-100">{stats.topBreed}</div>
                        <div className="mt-2 flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                             <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">أداء ممتاز</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>


        {/* Average Order Value */}
        <motion.div variants={item} className="md:col-span-3 md:row-span-1">
            <Card className="h-full border-none shadow-premium bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-3xl relative overflow-hidden p-4 md:p-6 group">
               <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex flex-row items-center justify-between">
                         <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">متوسط قيمة الطلب</span>
                         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-primary" />
                         </div>
                    </div>
                    <div>
                        <div className="text-3xl font-black tracking-tighter tabular-nums text-zinc-900 dark:text-zinc-100">{stats.avgOrderValue.toLocaleString()} <span className="text-sm opacity-40">د.ج</span></div>
                        <p className="text-[10px] text-primary/40 mt-2 font-black uppercase tracking-widest">لكل عملية ناجحة</p>
                    </div>
                </div>
            </Card>
        </motion.div>


        {/* Customers Stats */}
        <motion.div variants={item} className="md:col-span-3 md:row-span-1">
            <Card className="h-full border-none shadow-premium bg-white dark:bg-zinc-900 rounded-3xl relative overflow-hidden p-4 md:p-6 group border border-zinc-100 dark:border-zinc-800/50">
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex flex-row items-center justify-between">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-50">الزبائن</span>
                        <Users className="h-5 w-5 text-primary opacity-40" />
                    </div>
                    <div>
                        <div className="text-4xl font-black tracking-tighter">{stats.totalCustomers}</div>
                        <div className="mt-3 flex -space-x-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-muted flex items-center justify-center text-[10px] font-black overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30" />
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[8px] font-black text-primary">+{stats.activeUniqueCustomers}</div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>


        {/* Low Stock Alert */}
        <motion.div variants={item} className="md:col-span-3 md:row-span-1">
            <Card className="h-full border-none shadow-premium bg-red-50/50 dark:bg-red-950/10 border-2 border-red-100/20 rounded-3xl relative overflow-hidden p-4 md:p-6 group">
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex flex-row items-center justify-between">
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">تنبيه المخزون</span>
                        <AlertTriangle className="h-5 w-5 text-red-500 animate-bounce" />
                    </div>
                    <div>
                        <div className="text-5xl font-black tracking-tighter text-red-600">{stats.criticalStock}</div>
                        <Link href="/inventory/breeds" className="mt-4 flex items-center justify-between group/link">
                            <span className="text-[10px] font-black text-red-900/40 uppercase tracking-widest group-hover/link:text-red-900 transition-colors">إدارة المخزون</span>
                            <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center group-hover/link:translate-x-1 transition-transform">
                                <ArrowUpRight className="w-3 h-3 text-red-600" />
                            </div>
                        </Link>
                    </div>
                </div>
            </Card>
        </motion.div>
      </div>

      {/* Advanced Analytics */}
      <motion.div variants={item}>
         <PerformanceMetrics 
            revenueData={analyticsData.revenueData}
            orderTrends={analyticsData.revenueData} 
            topProducts={analyticsData.topProducts}
            categoryData={analyticsData.categoryData}
         />
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12 pb-20">
        {/* Live Activity */}
        <motion.div variants={item} className="lg:col-span-12 xl:col-span-7">
             <Card className="h-full border border-border/40 shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-950 overflow-hidden">
                <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-black tracking-tighter flex items-center gap-3">
                            <Activity className="w-8 h-8 text-emerald-500" /> النشاط المباشر
                        </CardTitle>
                        <CardDescription className="font-bold text-lg opacity-40 mt-1">تتبع التدفق الفوري للإنتاج</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-10 pt-6">
                    <div className="space-y-4">
                        {recentActivity.map((order, i) => (
                            <motion.div 
                                key={order.id} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="relative flex items-center gap-6 p-4 rounded-3xl border border-dashed border-border/60 hover:border-emerald-500/30 hover:bg-emerald-50/5 transition-all group"
                            >
                                <div className="text-center min-w-[70px]">
                                    <p className="text-[10px] font-black uppercase text-muted-foreground opacity-40 tracking-widest">{order.created_at ? format(new Date(order.created_at), 'HH:mm') : '--:--'}</p>
                                    <p className="text-xs font-black text-emerald-600 uppercase">{order.created_at ? format(new Date(order.created_at), 'MMM dd') : '--- --'}</p>
                                </div>
                                <div className="w-[2px] h-10 bg-muted rounded-full" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg font-black truncate text-zinc-900 dark:text-zinc-100 uppercase group-hover:text-emerald-600 transition-colors tracking-tight">{order.product_name}</p>
                                        <div className={clsx(
                                            "shrink-0 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 whitespace-nowrap",
                                            order.status === 'pending' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700' : 
                                            order.status === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-500/20 text-red-700' :
                                            'bg-blue-100 dark:bg-blue-500/20 text-blue-700'
                                        )}>
                                            <div className={clsx("w-1.5 h-1.5 rounded-full", 
                                                order.status === 'pending' ? 'bg-amber-500 animate-pulse' : 
                                                order.status === 'delivered' ? 'bg-emerald-500' :
                                                order.status === 'cancelled' ? 'bg-red-500' :
                                                'bg-blue-500'
                                            )} />
                                            {order.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-widest">بواسطة {order.customer_name || 'Anonymous'}</span>
                                    </div>
                                </div>
                                <div className="text-left font-sans">
                                    <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">+{Number(order.total_amount).toLocaleString()}</p>
                                    <p className="text-[9px] font-black opacity-30 text-right uppercase">د.ج</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Forecasts & Map */}
        <motion.div variants={item} className="lg:col-span-12 xl:col-span-5 space-y-8">
            <div className="grid gap-6">
                <Card className="border-none shadow-premium rounded-[2.5rem] bg-indigo-50/50 dark:bg-indigo-950/10 border-2 border-indigo-100/20 p-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm">
                                <TrendingUp className="w-6 h-6 text-indigo-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-100 tracking-tight">التنبؤات</h3>
                                <p className="text-[10px] text-indigo-600/50 font-black uppercase tracking-widest">توقعات الطلب القادم</p>
                            </div>
                         </div>
                    </div>
                    <div className="space-y-3">
                        {forecasts.map((f, i) => (
                            <div key={i} className="flex justify-between items-center bg-white/80 dark:bg-zinc-900/40 p-5 rounded-[2rem] shadow-sm border border-indigo-100/30 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 font-black text-xs">
                                        {f.name.slice(0, 1)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-indigo-900 dark:text-indigo-100 group-hover:text-indigo-600 transition-colors uppercase">{f.name}</p>
                                        <p className="text-[10px] text-indigo-700/40 font-bold uppercase tracking-widest">المخزون: {f.stock}</p>
                                    </div>
                                </div>
                                <div className={clsx(
                                    "px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-sm border-none shadow-indigo-500/10",
                                    f.daysLeft <= 2 ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'
                                )}>
                                    {f.daysLeft === 0 ? 'اليوم' : `${f.daysLeft} أيام`}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-4">
                    {alerts.map((alert, i) => (
                        <Card 
                            key={i} 
                            className={clsx(
                                "border-none shadow-premium rounded-full p-2 pl-8 pr-4 flex items-center gap-4",
                                alert.type === 'critical' ? 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100' : 'bg-orange-50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-100'
                            )}
                        >
                            <div className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                alert.type === 'critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                            )}>
                                <AlertTriangle className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-sm truncate uppercase tracking-tight">{alert.message}</p>
                            </div>
                            {alert.link && (
                                <Link href={alert.link} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white transition-colors">
                                    <ArrowUpRight className="w-4 h-4 opacity-40" />
                                </Link>
                            )}
                        </Card>
                    ))}
                </div>

                <Card className="border border-border/40 shadow-sm rounded-[2.5rem] bg-white dark:bg-zinc-950 overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                            <Truck className="w-6 h-6 text-blue-500" /> التوزيع الجغرافي
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 h-[350px]">
                        <AlgeriaMap 
                            data={analyticsData.wilayaData}
                            className="w-full h-full"
                        />
                    </CardContent>
                </Card>
            </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

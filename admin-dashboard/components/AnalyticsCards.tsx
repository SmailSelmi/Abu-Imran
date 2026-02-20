'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

export function AnalyticsCards() {
  const supabase = createClient()
  const [stats, setStats] = useState({
      totalRevenue: 0,
      activeOrders: 0,
      lowStock: 0,
      totalProducts: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
        // 1. Orders Stats
        const { data: orders } = await supabase.from('orders').select('*')
        
        let revenue = 0
        let active = 0
        
        if (orders) {
            orders.forEach((o: any) => {
                const price = Number(o.total_amount || o.price) || 0 
                revenue += price
                if (o.status === 'pending' || o.status === 'shipped') active++
            })
        }

        // 2. Product Stats
        const { data: products } = await supabase.from('products').select('stock')
        let stockAlerts = 0
        
        if (products) {
            products.forEach((p: any) => {
                if (Number(p.stock || 0) < 10) stockAlerts++
            })
        }

        setStats({
            totalRevenue: revenue,
            activeOrders: active,
            lowStock: stockAlerts,
            totalProducts: products?.length || 0
        })
    }

    fetchStats()
    
    // Simple polling for updates
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-widest opacity-60">إجمالي الإيرادات</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tight">{stats.totalRevenue.toLocaleString()} <span className="text-sm opacity-60 font-sans">د.ج</span></div>
          <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">
            +20.1% من الشهر الماضي
          </p>
        </CardContent>
      </Card>
      </motion.div>
      
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-widest opacity-60">الطلبات النشطة</CardTitle>
          <ShoppingBag className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tight">{stats.activeOrders}</div>
          <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">
            {stats.activeOrders > 0 ? 'تتطلب اهتماماً' : 'الكل سليم'}
          </p>
        </CardContent>
      </Card>
      </motion.div>
      
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-widest opacity-60">تنبيهات انخفاض المخزون</CardTitle>
          <TrendingUp className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tight">{stats.lowStock}</div>
          <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">
            منتجات بأقل من 10 قطع
          </p>
        </CardContent>
      </Card>
      </motion.div>

      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-widest opacity-60">إجمالي المنتجات</CardTitle>
          <Package className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tight">{stats.totalProducts}</div>
          <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">
            نشط في الكتالوج
          </p>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  )
}

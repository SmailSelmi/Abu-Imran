"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { format, subDays, startOfDay, endOfDay } from "date-fns"

export function RevenueChart() {
  const [data, setData] = useState<{ date: string; total: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const today = new Date()
      const startDate = subDays(today, 7) // Last 7 days

      let query = supabase
        .from('orders')
        .select('created_at, total_amount, category')
        .gte('created_at', startOfDay(startDate).toISOString())
        .neq('status', 'cancelled')

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data: orders } = await query
      const ordersData = (orders || []) as any[]

      // Group by day
      const grouped = new Map<string, number>()
      
      // Initialize last 7 days with 0
      for (let i = 6; i >= 0; i--) {
          const d = subDays(today, i)
          grouped.set(format(d, 'MMM dd'), 0)
      }

      ordersData.forEach(order => {
          const dateStr = format(new Date(order.created_at), 'MMM dd')
          const amount = order.total_amount || 0
          if (grouped.has(dateStr)) {
              grouped.set(dateStr, (grouped.get(dateStr) || 0) + amount)
          }
      })

      const chartData = Array.from(grouped.entries()).map(([date, total]) => ({
          date,
          total
      }))

      setData(chartData)
      setLoading(false)
    }

    fetchData()
  }, [selectedCategory])

  if (loading) return <div className="h-[350px] flex items-center justify-center text-muted-foreground">Loading chart...</div>

  return (
    <Card className="col-span-4 shadow-lg border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Revenue Overview</CardTitle>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
           {['all', 'eggs', 'chicks', 'machine'].map((cat) => (
             <button
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${selectedCategory === cat ? 'bg-background shadow-sm text-emerald-600' : 'text-muted-foreground'}`}
             >
               {cat === 'all' ? 'الكل' : cat === 'eggs' ? 'بيض' : cat === 'chicks' ? 'صيصان' : 'عتاد'}
             </button>
           ))}
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <XAxis 
                    dataKey="date" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}DA`} 
                />
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                />
                <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

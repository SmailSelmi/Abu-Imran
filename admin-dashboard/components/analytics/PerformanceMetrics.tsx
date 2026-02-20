'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Package, Users } from 'lucide-react'
import { clsx } from 'clsx'

export interface RevenueDataPoint {
    name: string
    revenue: number
}

export interface ProductSalePoint {
    name: string
    sales: number
}

export interface CategoryRevenuePoint {
    name: string
    value: number
}

interface MetricsProps {
    revenueData: RevenueDataPoint[]
    orderTrends: RevenueDataPoint[]
    topProducts: ProductSalePoint[]
    categoryData?: CategoryRevenuePoint[]
}


export const PerformanceMetrics = ({ revenueData, orderTrends, topProducts, categoryData }: MetricsProps) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend Area Chart */}
                <Card className="border-none shadow-2xl rounded-xl bg-white dark:bg-card overflow-hidden ring-1 ring-border/50">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-black tracking-tighter">إحصائيات المبيعات</CardTitle>
                                <CardDescription className="font-bold text-base opacity-60">تتبع الإيرادات وحجم النمو المالي</CardDescription>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shadow-inner">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis 
                                    orientation="right"
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                                    tickFormatter={(value) => `${value.toLocaleString()}`}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '1.5rem', 
                                        border: 'none', 
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                        fontWeight: 900,
                                        fontSize: '14px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    itemStyle={{ color: '#059669' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#10b981" 
                                    strokeWidth={5}
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Products Bar Chart */}
                <Card className="border-none shadow-2xl rounded-xl bg-white dark:bg-card overflow-hidden ring-1 ring-border/50">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-black tracking-tighter">المنتجات الأكثر طلباً</CardTitle>
                                <CardDescription className="font-bold text-base opacity-60">تحليل أداء المخزون والطلب</CardDescription>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-inner">
                                <Package className="w-7 h-7" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }}
                                    width={120}
                                    orientation="right"
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                    contentStyle={{ 
                                        borderRadius: '1.5rem', 
                                        border: 'none', 
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                        fontWeight: 900,
                                        fontSize: '14px'
                                    }}
                                />
                                <Bar 
                                    dataKey="sales" 
                                    fill="#6366f1" 
                                    radius={[10, 0, 0, 10]} 
                                    barSize={32}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown Row */}
            {categoryData && categoryData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categoryData.map((cat, i) => (
                        <Card key={i} className="border-none shadow-xl rounded-xl bg-white dark:bg-card p-10 group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden ring-1 ring-border/50">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-current to-transparent opacity-[0.03]" style={{ color: cat.name === 'eggs' ? '#f97316' : cat.name === 'chicks' ? '#10b981' : '#a855f7' }} />
                             
                             <div className="flex items-center justify-between mb-8">
                                <div className={clsx(
                                    "w-14 h-14 rounded-xl flex items-center justify-center shadow-inner ring-4 ring-current/5",
                                    cat.name === 'eggs' ? 'bg-orange-100 text-orange-600' :
                                    cat.name === 'chicks' ? 'bg-emerald-100 text-emerald-600' :
                                    'bg-purple-100 text-purple-600'
                                )}>
                                    <DollarSign className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-40">{cat.name} Revenue</span>
                             </div>
                             <div className="space-y-1">
                                <div className="text-4xl font-black tracking-tighter tabular-nums">
                                    {cat.value.toLocaleString()} <span className="text-xs font-black opacity-30 ml-1">DA</span>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Total Net Income</p>
                             </div>
                             <div className="mt-8 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.5, delay: i * 0.2 }}
                                    className={clsx(
                                        "h-full rounded-full",
                                        cat.name === 'eggs' ? 'bg-orange-500' :
                                        cat.name === 'chicks' ? 'bg-emerald-500' :
                                        'bg-purple-500'
                                    )} 
                                />
                             </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

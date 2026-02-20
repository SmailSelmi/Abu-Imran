import { createClient } from '@/utils/supabase/server'
import { subDays, format } from 'date-fns'
import DashboardContent, { 
    type DashboardStats, 
    type Alert, 
    type Forecast, 
    type AnalyticsData 
} from '@/components/dashboard/DashboardContent'
import type { Database } from '@/types/supabase'

export const dynamic = 'force-dynamic'

type Order = Database['public']['Tables']['orders']['Row']
type Product = Database['public']['Tables']['products']['Row']

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Fetch Data on the Server
  const [ordersRes, productsRes, customersRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('products').select('*'),
      supabase.from('customers').select('id', { count: 'exact', head: true })
  ])

  const orders = (ordersRes.data || []) as Order[]
  const products = (productsRes.data || []) as Product[]
  const totalCustomers = customersRes.count || 0

  // 2. Process Analytics on the Server
  const revenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
  
  const activeOrders = orders.filter(o => ['pending', 'shipped'].includes(o.status || '')).length
  
  const lowStockThreshold = 10
  const lowStockItems = products.filter(p => (Number(p.stock) || 0) < lowStockThreshold)
  
  const sevenDaysAgo = subDays(new Date(), 7)
  const recentOrders = orders.filter(o => o.created_at && new Date(o.created_at) > sevenDaysAgo)
  const uniqueCustomers = new Set(recentOrders.map(o => o.customer_id).filter(Boolean))

  // Revenue Trends (Last 7 Days)
  const groupedRevenue = new Map<string, number>()
  const productSales = new Map<string, number>()

  for (let i = 6; i >= 0; i--) {
      groupedRevenue.set(format(subDays(new Date(), i), 'MMM dd'), 0)
  }

  orders.filter(o => o.status !== 'cancelled').forEach(o => {
      if (!o.created_at) return
      const dateStr = format(new Date(o.created_at), 'MMM dd')
      if (groupedRevenue.has(dateStr)) {
          groupedRevenue.set(dateStr, (groupedRevenue.get(dateStr) || 0) + (Number(o.total_amount) || 0))
      }

      const pName = o.product_name || 'Generic Product'
      productSales.set(pName, (productSales.get(pName) || 0) + 1)
  })

  const revenueData = Array.from(groupedRevenue.entries()).map(([name, revenue]) => ({ name, revenue }))
  const topProducts = Array.from(productSales.entries())
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)

  // Category Breakdown
  const categoryRevenue = new Map<string, number>()
  orders.filter(o => o.status !== 'cancelled').forEach(o => {
      const cat = o.category || 'livestock'
      categoryRevenue.set(cat, (categoryRevenue.get(cat) || 0) + (Number(o.total_amount) || 0))
  })
  const categoryData = Array.from(categoryRevenue.entries()).map(([name, value]) => ({ name, value }))

  // Wilaya Disribution
  const wilayaStats: Record<string, number> = {}
  orders.forEach(o => {
      const wValue = o.wilaya_address?.split(',').pop()?.trim() || '16'
      const wId = wValue.match(/^\d+$/) ? wValue.padStart(2, '0') : '16'
      wilayaStats[wId] = (wilayaStats[wId] || 0) + 1
  })

  // Alerts
  const alerts: Alert[] = []
  if (lowStockItems.length > 0) {
      alerts.push({
          type: 'critical',
          message: `${lowStockItems.length} livestock items have low stock`,
          link: '/inventory/breeds',
          label: 'نقص المخزون'
      })
  }
  
  const pendingLong = orders.filter(o => 
      o.status === 'pending' && 
      o.created_at &&
      new Date(o.created_at).getTime() < Date.now() - 86400000
  ).length
  
  if (pendingLong > 0) {
      alerts.push({
          type: 'warning',
          message: `${pendingLong} orders delayed`,
          link: '/orders',
          label: 'طلبيات متأخرة'
      })
  }

  // Forecasts
  const forecasts: Forecast[] = []
  products.forEach(p => {
      const productOrdersCount = orders.filter(o => 
          (o.product_name === p.name_en || o.product_name === p.name) && 
          o.created_at &&
          new Date(o.created_at) > sevenDaysAgo
      ).length
      const dailyRate = productOrdersCount / 7
      if (dailyRate > 0) {
          const daysLeft = Math.floor((p.stock || 0) / dailyRate)
          if (daysLeft < 7) {
              forecasts.push({ name: p.name_en || p.name || 'Unknown', daysLeft, stock: p.stock })
          }
      }
  })

  const avgOrderValue = orders.length > 0 ? Math.round(revenue / orders.filter(o => o.status !== 'cancelled').length) : 0
  const topBreedName = topProducts.length > 0 ? topProducts[0].name : 'N/A'

  const stats: DashboardStats = {
      revenue,
      activeOrders,
      criticalStock: lowStockItems.length,
      activeUniqueCustomers: uniqueCustomers.size,
      totalCustomers,
      avgOrderValue,
      topBreed: topBreedName,
      revenueChange: 12,
      ordersChange: 5
  }

  const analyticsData: AnalyticsData = {
      revenueData,
      topProducts,
      categoryData,
      wilayaData: wilayaStats
  }

  return (
    <div className="p-8 pb-10">
      <DashboardContent 
        stats={stats}
        alerts={alerts}
        forecasts={forecasts.sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 3)}
        recentActivity={orders.slice(0, 10)}
        analyticsData={analyticsData}
      />
    </div>
  )
}

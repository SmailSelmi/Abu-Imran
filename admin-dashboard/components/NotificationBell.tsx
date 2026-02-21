'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Bell, X, ShoppingCart, Egg, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { ar } from 'date-fns/locale'
import Link from 'next/link'

type NotifType = 'order' | 'hatching'

interface Notification {
  id: string
  customer_name: string
  total_amount: number
  product_name: string
  created_at: string
  read: boolean
  type: NotifType
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()
  const panelRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Load recent orders + hatching bookings on mount
  useEffect(() => {
    const loadRecent = async () => {
      const [ordersRes, bookingsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id, customer_name, total_amount, product_name, created_at')
          .order('created_at', { ascending: false })
          .limit(8),
        supabase
          .from('hatching_bookings')
          .select('id, customer_id, total_price, egg_count, created_at, customers(full_name)')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      const orderNotifs: Notification[] = (ordersRes.data || []).map(o => ({
        id: o.id,
        customer_name: o.customer_name || 'زبون',
        total_amount: o.total_amount || 0,
        product_name: o.product_name || 'منتج',
        created_at: o.created_at || new Date().toISOString(),
        read: true,
        type: 'order',
      }))

      const hatchingNotifs: Notification[] = (bookingsRes.data || []).map((b: any) => ({
        id: b.id,
        customer_name: b.customers?.full_name || 'زبون',
        total_amount: b.total_price || 0,
        product_name: `حجز تفقيس — ${b.egg_count} بيضة`,
        created_at: b.created_at || new Date().toISOString(),
        read: true,
        type: 'hatching',
      }))

      // Merge and sort by date
      const all = [...orderNotifs, ...hatchingNotifs].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setNotifications(all)
    }
    loadRecent()
  }, [])

  // Subscribe to new orders
  useEffect(() => {
    const ordersChannel = supabase
      .channel('notif-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const order = payload.new as any

        // Play cashier sound
        const audio = new Audio('/cashier.mp3')
        audio.play().catch(e => console.error("Audio play blocked", e))

        const n: Notification = {
          id: order.id,
          customer_name: order.customer_name || 'زبون',
          total_amount: order.total_amount || 0,
          product_name: order.product_name || 'طلبية جديدة',
          created_at: order.created_at || new Date().toISOString(),
          read: false,
          type: 'order',
        }
        setNotifications(prev => [n, ...prev].slice(0, 20))
      })
      .subscribe()

    // Subscribe to new hatching bookings
    const hatchingChannel = supabase
      .channel('notif-hatching')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'hatching_bookings' }, (payload) => {
        const booking = payload.new as any

        // Play cashier sound
        const audio = new Audio('/cashier.mp3')
        audio.play().catch(e => console.error("Audio play blocked", e))

        const n: Notification = {
          id: booking.id,
          customer_name: 'زبون جديد',
          total_amount: booking.total_price || 0,
          product_name: `حجز تفقيس — ${booking.egg_count || '?'} بيضة`,
          created_at: booking.created_at || new Date().toISOString(),
          read: false,
          type: 'hatching',
        }
        setNotifications(prev => [n, ...prev].slice(0, 20))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(hatchingChannel)
    }
  }, [supabase])

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllRead() }}
        className="relative w-10 h-10 rounded-xl bg-white dark:bg-card border border-border/50 shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-emerald-500/30 transition-all"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-12 w-80 bg-card border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
              <span className="text-sm font-black">الإشعارات</span>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto divide-y divide-border/30">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm font-bold opacity-50">
                  لا توجد إشعارات
                </div>
              ) : (
                notifications.map((n) => (
                  <Link
                    href={n.type === 'order' ? `/orders?id=${n.id}` : `/hatching?id=${n.id}`}
                    key={`${n.type}-${n.id}`}
                    onClick={() => {
                        setNotifications(prev => prev.map(p => p.id === n.id ? { ...p, read: true } : p))
                        setIsOpen(false)
                    }}
                    className={`px-4 py-3 flex gap-3 items-start transition-colors ${!n.read ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'hover:bg-muted/30'}`}
                  >
                    {/* Icon differs by type */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.type === 'hatching' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                      {n.type === 'hatching'
                        ? <Egg className="w-4 h-4 text-amber-600" />
                        : <ShoppingCart className="w-4 h-4 text-emerald-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className={`text-sm truncate ${!n.read ? 'font-black' : 'font-bold'}`}>{n.customer_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{n.product_name}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${n.type === 'hatching' ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {(n.total_amount || 0).toLocaleString()} دج
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 opacity-60">
                          <Clock className="w-3 h-3" />
                          {n.created_at ? formatDistanceToNow(new Date(n.created_at) > new Date() ? new Date() : new Date(n.created_at), { addSuffix: true, locale: ar }) : ''}
                        </span>
                      </div>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />}
                  </Link>
                ))
              )}
            </div>

            <div className="border-t border-border/50 p-2">
              <button
                onClick={markAllRead}
                className="w-full text-xs font-black text-muted-foreground hover:text-foreground py-1.5 rounded-lg hover:bg-muted/50 transition-colors"
              >
                تحديد الكل كمقروء
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

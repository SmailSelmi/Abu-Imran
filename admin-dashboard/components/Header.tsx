'use client'
import { Search } from "lucide-react"
import { MobileSidebar } from "@/components/Sidebar"
import { SystemHealth } from "@/components/SystemHealth"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useI18n } from "@/lib/i18n/I18nContext"
import { NotificationBell } from "@/components/NotificationBell"

export function Header() {
  const { t } = useI18n()

  return (
    <header className="hidden md:flex h-16 items-center justify-between gap-6 border-b border-border/40 bg-white/70 px-6 lg:px-8 backdrop-blur-2xl sticky top-0 z-40 ring-1 ring-border/50">

      <div className="flex items-center gap-4 flex-1">
        <MobileSidebar />
        <div className="max-w-xl flex-1 hidden md:block">
            <div className="relative group">
                <Search className="absolute end-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-600 transition-all duration-300 pointer-events-none" />
                <input
                    type="text"
                    placeholder={t.header.searchPlaceholder}
                    className="w-full h-10 rounded-xl bg-muted/30 border border-transparent focus:border-emerald-500/20 pe-10 ps-4 text-sm font-bold focus:bg-background focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none placeholder:opacity-40"
                />
            </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden xl:block">
            <SystemHealth />
        </div>

        <div className="h-8 w-px bg-border/40" />

        <NotificationBell />
      </div>
    </header>
  )
}

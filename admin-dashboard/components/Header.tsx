'use client'
import { Bell, Search } from "lucide-react"
import { MobileSidebar } from "@/components/Sidebar"
import { SystemHealth } from "@/components/SystemHealth"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useI18n } from "@/lib/i18n/I18nContext"
import { Locale } from "@/lib/i18n/translations"
import { cn } from "@/lib/utils"

export function Header() {
  const { t, locale, setLocale, isRTL } = useI18n()

  const languages: { code: Locale; label: string }[] = [
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
  ]
  return (
    <header className="flex h-24 items-center justify-between gap-8 border-b border-border/40 bg-white/70 dark:bg-zinc-950/70 px-8 lg:px-12 backdrop-blur-2xl sticky top-0 z-40 ring-1 ring-border/50">
      
      <div className="flex items-center gap-6 flex-1">
        <MobileSidebar />
        <div className="max-w-2xl flex-1 hidden md:block">
            <div className="relative group">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-all duration-300 pointer-events-none" />
                <input 
                    type="text" 
                    placeholder={t.header.searchPlaceholder} 
                    className="w-full h-14 rounded-xl bg-muted/30 border border-transparent focus:border-emerald-500/20 pr-14 pl-6 text-sm font-black focus:bg-background focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none placeholder:opacity-40"
                />
            </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden xl:flex items-center gap-1 p-1 bg-muted/50 dark:bg-zinc-900/50 rounded-xl border border-border/50">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all relative z-10",
                        locale === lang.code 
                            ? "text-white" 
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {locale === lang.code && (
                        <motion.div 
                            layoutId="active-lang-admin"
                            className="absolute inset-0 bg-emerald-600 rounded-lg -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    {lang.code}
                </button>
            ))}
        </div>

        <div className="hidden xl:block">
            <SystemHealth />
        </div>
        
        <div className="h-10 w-[1px] bg-border/40" />
        
        <ThemeToggle />

        <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-4 rounded-xl bg-muted/30 hover:bg-emerald-500/10 transition-all text-muted-foreground hover:text-emerald-600 ring-1 ring-transparent hover:ring-emerald-500/20"
        >
            <Bell className="w-6 h-6" />
            <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3.5 right-3.5 w-3 h-3 bg-red-600 rounded-full border-4 border-white dark:border-zinc-950 shadow-sm" 
            />
        </motion.button>
      </div>
    </header>
  )
}

'use client'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut,
  Egg, Bird, Thermometer, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";

// Replaced by inline links inside components
// const sidebarLinks = [...];

export function Sidebar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { t } = useI18n();

  const links = [
    { name: t.sidebar.overview, href: "/", icon: LayoutDashboard },
    { name: t.sidebar.orders, href: "/orders", icon: ShoppingCart },
    { name: t.sidebar.hatching, href: "/hatching", icon: Egg },
    { name: t.sidebar.inventory, href: "/inventory/breeds", icon: Package },
    { name: t.sidebar.customers, href: "/customers", icon: Users },
    { name: "الإحصائيات", href: "/analytics", icon: LayoutDashboard },
    { name: t.sidebar.settings, href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside 
      className={cn(
        "hidden lg:flex flex-col border-r bg-card/40 backdrop-blur-2xl border-border sticky top-0 h-screen z-50 transition-all duration-500 ease-in-out shrink-0 ring-1 ring-border/50 shadow-2xl",
        isCollapsed ? "w-24" : "w-80",
        className
      )}
    >
      <div className={cn("h-24 flex items-center border-b border-border/40", isCollapsed ? "justify-center px-0" : "px-8")}>
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-16 h-16 p-1 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 group-hover:rotate-6 relative">
            <Image 
                src="https://res.cloudinary.com/dyi0jxi3g/image/upload/v1771716272/AbuImranLogo_1_aejo3r.svg" 
                alt="Logo" 
                fill 
                className="object-contain"
            />
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex flex-col"
            >
              <span className="font-black text-2xl tracking-tighter leading-none whitespace-nowrap">{t.sidebar.brand}</span>
              <span className="text-emerald-500 font-black tracking-[0.3em] text-[10px] uppercase opacity-60 mt-1">{t.sidebar.managementPortal}</span>
            </motion.div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-10 space-y-8 px-4 custom-scrollbar">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] px-4"
          >
            {t.sidebar.mainControl}
          </motion.div>
        )}
        <motion.nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <motion.div key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-4 py-4 rounded-xl text-sm font-black transition-all duration-300 group overflow-hidden border border-transparent",
                    isCollapsed ? "justify-center px-2" : "px-5",
                    isActive
                      ? "text-emerald-600 shadow-2xl shadow-emerald-500/10 bg-white dark:bg-zinc-900 border-border/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {isActive && (
                      <motion.div 
                          layoutId="active-sidebar-line"
                          className="absolute right-0 w-1.5 h-10 bg-emerald-600 rounded-l-full shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                      />
                  )}
                  <div className={cn(
                      "p-2 rounded-xl transition-all duration-300",
                      isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-transparent text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                  )}>
                    <Icon className="h-5 w-5 shrink-0" />
                  </div>
                  {!isCollapsed && (
                    <span className="flex-1 whitespace-nowrap tracking-tight">{link.name}</span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>
      </div>

      <div className={cn("p-6 border-t border-border/40 bg-muted/5", isCollapsed ? "px-2" : "px-6")}>
         {!isCollapsed ? (
             <div className="bg-card rounded-xl p-5 shadow-inner border border-border/40 relative overflow-hidden group">
                 <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/20 shrink-0 border-2 border-white ring-4 ring-emerald-500/5" />
                    <div className="overflow-hidden space-y-0.5">
                        <p className="text-sm font-black text-foreground truncate uppercase tracking-tighter">{t.sidebar.adminUser}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest opacity-70">{t.sidebar.role}</p>
                    </div>
                 </div>
                 <button 
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3.5 text-xs font-black text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/10 hover:border-red-500 shadow-sm"
                 >
                    <LogOut className="h-4 w-4" />
                    {t.sidebar.logout}
                 </button>
             </div>
         ) : (
             <div className="flex flex-col gap-6 items-center">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/20 border-2 border-white" />
                 <button onClick={handleLogout} className="text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white p-3.5 rounded-xl transition-all border border-red-500/10">
                     <LogOut className="h-5 w-5" />
                 </button>
             </div>
         )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-24 h-6 w-6 rounded-full border bg-background shadow-md lg:flex hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <PanelLeftOpen className="h-3 w-3" /> : <PanelLeftClose className="h-3 w-3" />}
      </Button>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const { t, isRTL } = useI18n();

  const links = [
    { name: t.sidebar.overview, href: "/", icon: LayoutDashboard },
    { name: t.sidebar.orders, href: "/orders", icon: ShoppingCart },
    { name: t.sidebar.inventory, href: "/inventory/breeds", icon: Package },
    { name: t.sidebar.customers, href: "/customers", icon: Users },
    { name: "الإحصائيات", href: "/analytics", icon: LayoutDashboard },
    { name: t.sidebar.settings, href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side={isRTL ? "right" : "left"} className={cn("w-72 p-0 border-border bg-card/95 backdrop-blur-xl", isRTL ? "border-l" : "border-r")}>
        <div className="h-20 flex items-center px-8 border-b border-border/50">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 font-black text-2xl tracking-tighter text-emerald-600">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0 relative overflow-hidden p-1">
                <Image 
                    src="/logo-official.png" 
                    alt="Logo" 
                    fill 
                    className="object-contain p-1"
                />
            </div>
            <span>{t.sidebar.brand}</span>
            </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-8 space-y-2 px-4">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4 mb-4 opacity-50">{t.sidebar.menu}</div>
            <nav className="space-y-1">
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                    "relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-black transition-all duration-300 group overflow-hidden",
                    isActive
                        ? "text-emerald-600 shadow-lg shadow-emerald-500/10 bg-emerald-50 dark:bg-emerald-950/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    {isActive && (
                        <div className="absolute right-0 w-1 h-8 bg-emerald-600 rounded-l-full" />
                    )}
                    <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-emerald-600" : "text-muted-foreground group-hover:text-foreground")} />
                    <span className="flex-1">{link.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-emerald-600 opacity-50" />}
                </Link>
                );
            })}
            </nav>
        </div>

         <div className="p-6 border-t border-border/50 bg-muted/10 m-4 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-green-600 shadow-lg shadow-green-500/20" />
                 <div>
                     <p className="text-sm font-black text-foreground">{t.sidebar.adminUser}</p>
                     <p className="text-xs text-muted-foreground">{t.sidebar.role}</p>
                 </div>
              </div>
              <button 
                 onClick={handleLogout}
                 className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200"
              >
                 <LogOut className="h-4 w-4" />
                 {t.sidebar.logout}
              </button>
         </div>
      </SheetContent>
    </Sheet>
  );
}

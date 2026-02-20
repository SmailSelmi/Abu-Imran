'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Egg, Box } from 'lucide-react';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function BottomNav() {
  const pathname = usePathname();
  const { t, isRTL } = useI18n();

  const navItems = [
    { href: '/', label: t.common.home, icon: Home },
    { href: '/shop', label: 'المتجر', icon: ShoppingBag }, 
    { href: '/hatching', label: t.common.hatchingService, icon: Egg },
    { href: '/shop?category=machine', label: 'العتاد', icon: Box },
  ];

  return (
    <div 
      className="fixed bottom-0 start-0 end-0 z-50 xl:hidden pb-safe"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="glass-card border-none rounded-t-2xl px-2 py-2 flex items-center justify-around drop-shadow-lg bg-background/80 backdrop-blur-xl border-t border-border/50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComp = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all",
                isActive ? "text-emerald-600" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-emerald-600/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative z-10">
                <IconComp className={cn("w-5 h-5 mb-1", isActive && "fill-emerald-600/20")} />
              </div>
              <span className="text-[10px] font-black tracking-tighter truncate w-full text-center z-10 relative">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

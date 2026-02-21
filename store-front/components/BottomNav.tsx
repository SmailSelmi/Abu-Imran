'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Egg, Box, ArrowLeft } from 'lucide-react';
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
      <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-border/40 px-2 pt-2 pb-3 flex items-center justify-around gap-1">
        {/* 4 nav icons */}
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));
          const IconComp = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all shrink-0',
                isActive ? 'text-emerald-600' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-emerald-600/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10">
                <IconComp className={cn('w-5 h-5 mb-0.5', isActive && 'fill-emerald-600/20')} />
              </div>
              <span className="text-[9px] font-black tracking-tight truncate w-full text-center z-10 relative leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* CTA: Full-height Order Now */}
        <Link
          href="/shop"
          className="flex-1 min-w-0 max-w-[110px]"
        >
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm h-12 rounded-2xl shadow-sm transition-colors px-3"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">{t.common.orderNow}</span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}

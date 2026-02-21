"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Package,
  Settings,
  BarChart2,
  Egg,
  Users,
} from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "الرئيسية", href: "/", icon: Home, isActive: pathname === "/" },
    {
      name: "الطلبات",
      href: "/orders",
      icon: ShoppingCart,
      isActive: pathname.startsWith("/orders"),
    },
    {
      name: "الحضانة",
      href: "/hatching",
      icon: Egg,
      isActive: pathname.startsWith("/hatching"),
    },
    {
      name: "المخزون",
      href: "/inventory/breeds",
      icon: Package,
      isActive: pathname.startsWith("/inventory"),
    },
    {
      name: "الزبائن",
      href: "/customers",
      icon: Users,
      isActive: pathname.startsWith("/customers"),
    },
    {
      name: "تحليلات",
      href: "/analytics",
      icon: BarChart2,
      isActive: pathname.startsWith("/analytics"),
    },
    {
      name: "الإعدادات",
      href: "/settings",
      icon: Settings,
      isActive: pathname.startsWith("/settings"),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none no-print">
      <div className="bg-white/90 backdrop-blur-xl border border-zinc-200/50 rounded-3xl shadow-2xl p-2 flex overflow-x-auto snap-x scrollbar-hide pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative min-w-[72px] flex-1 flex flex-col items-center justify-center gap-1.5 py-2 tap-highlight-transparent snap-center"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl -m-2 opacity-50"
                  />
                )}
                <Icon
                  className={clsx(
                    "w-6 h-6 z-10 relative transition-all duration-300",
                    isActive
                      ? "text-emerald-600 scale-110"
                      : "text-zinc-500 scale-100 opacity-60",
                  )}
                />
              </div>
              <span
                className={clsx(
                  "text-[9px] font-black uppercase tracking-widest z-10 transition-colors duration-300",
                  isActive
                    ? "text-emerald-700 dark:text-emerald-500"
                    : "text-zinc-500 opacity-60",
                )}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

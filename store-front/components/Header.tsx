'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Egg, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Locale } from '@/lib/i18n/translations';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import { NAV_LINKS, LANGUAGES } from '@/lib/constants';


export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t, locale, setLocale, isRTL } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = NAV_LINKS(t);
  const languages = LANGUAGES;


  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 start-0 end-0 z-50 transition-all duration-700',
          isScrolled
            ? 'glass-card border-none mt-4 mx-4 md:mx-8 rounded-[2rem] py-3 shadow-2xl shadow-emerald-900/10'
            : 'bg-transparent py-8'
        )}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            className="flex items-center gap-4 group shrink-0"
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className={cn(
                "relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/10 backdrop-blur-xl text-white shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ring-2 ring-white/10 group-hover:ring-emerald-500/30 overflow-hidden p-2",
                isRTL ? "ms-0" : "me-0" // Ensure logo doesn't shift unexpectedly in RTL
            )}>
              <Image 
                src="/logo-official.png" 
                alt="Abu Imran Logo" 
                fill
                className="object-contain p-2 transition-all duration-500"
              />
            </div>
            <span className={cn(
                "font-black text-2xl lg:text-3xl tracking-tighter transition-all duration-500",
                isScrolled ? "text-emerald-950 dark:text-white" : "text-white"
            )}>
              {t.common.brand}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => {
              const [isHovered, setIsHovered] = useState(false);
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={cn(
                    'text-sm font-black tracking-tight transition-all flex items-center gap-2.5 px-4 py-2.5 rounded-2xl relative group',
                    isActive
                      ? 'text-emerald-600 bg-emerald-50/50'
                      : isScrolled ? 'text-muted-foreground hover:text-emerald-600 hover:bg-muted/50' : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  <Icon 
                    src={link.icon} 
                    parentHover={isHovered} 
                    size={22} 
                    colors={{ 
                        primary: isActive ? '#059669' : (isScrolled ? '#10b981' : '#ffffff'), 
                        secondary: '#ffffff' 
                    }} 
                  />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3 md:gap-6">
            {/* Desktop Lang + Cart */}
            <div className="hidden md:flex items-center gap-2">
                 <div className="flex items-center gap-1.5 p-1.5 bg-muted/30 dark:bg-zinc-900/30 rounded-2xl border border-white/5 backdrop-blur-md">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setLocale(lang.code)}
                            className={cn(
                                "px-4 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all relative z-10",
                                locale === lang.code 
                                    ? "text-white" 
                                    : (isScrolled ? "text-muted-foreground hover:text-emerald-600" : "text-white/60 hover:text-white")
                            )}
                        >
                            {locale === lang.code && (
                                <motion.div 
                                    layoutId="active-lang"
                                    className="absolute inset-0 bg-emerald-600 rounded-xl -z-10 shadow-lg shadow-emerald-600/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            {lang.code}
                        </button>
                    ))}
                </div>
            </div>

            <ThemeToggle className={cn(
                "hidden md:flex h-11 w-11 rounded-2xl transition-all duration-500",
                isScrolled 
                    ? "text-foreground bg-muted/50 border border-border hover:bg-muted" 
                    : "text-white bg-white/10 border border-white/20 hover:bg-white/30 backdrop-blur-md shadow-lg shadow-black/5"
            )} />



            <Link href="/shop" className="hidden md:flex">
                <Button className="rounded-2xl h-12 px-8 font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 transition-all duration-500 hover:scale-105 active:scale-95 group">
                    {t.common.orderNow}
                    <ArrowRight className={cn("ms-2 w-4 h-4 transition-transform", isRTL ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1")} />
                </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "xl:hidden rounded-2xl h-12 w-12",
                isScrolled ? "text-foreground bg-muted/50" : "text-white bg-white/10 hover:bg-white/20"
              )}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                  "fixed inset-y-0 z-[61] w-full max-w-sm bg-background border-border p-8 shadow-md xl:hidden flex flex-col pt-24",
                  isRTL ? "end-0 border-s" : "start-0 border-e"
              )}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 start-6 rounded-full bg-muted/50 hover:bg-muted h-12 w-12"
              >
                <X className="w-6 h-6" />
              </Button>

              <div className="flex flex-col gap-6">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-5 text-2xl font-black transition-all p-3 rounded-xl",
                        pathname === link.href ? "bg-emerald-600/10 text-emerald-600" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <div className="w-10 h-10 shrink-0">
                         <Icon src={link.icon} trigger="loop" size={32} colors={{ primary: '#10b981', secondary: '#10b981' }} />
                      </div>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto space-y-8 pt-8 border-t border-border">
                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Language / لغة</p>
                    <div className="flex flex-wrap gap-2">
                        {languages.map((lang) => (
                            <Button
                                key={lang.code}
                                variant={locale === lang.code ? "default" : "outline"}
                                size="sm"
                                onClick={() => setLocale(lang.code)}
                                className={cn(
                                    "flex-1 rounded-xl font-black h-12",
                                    locale === lang.code ? "bg-emerald-600 text-white" : ""
                                )}
                            >
                                {lang.label}
                            </Button>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col gap-4">

                    
                    <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black h-16 text-xl shadow-md shadow-emerald-500/20 group">
                            {t.common.orderNow}
                        </Button>
                    </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

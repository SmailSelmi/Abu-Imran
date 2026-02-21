"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n/I18nContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const navLinks = NAV_LINKS(t);
  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 start-0 end-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-border/20 mt-3 mx-4 md:mx-8 rounded-[2rem] py-2 shadow-md shadow-emerald-900/5 dark:shadow-black/20"
            : isTransparent
              ? "bg-transparent py-5"
              : "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-sm shadow-emerald-900/5 dark:shadow-black/20 py-3",
        )}
      >
        <div className="container mx-auto px-5 flex items-center justify-between">
          <Link
            className="flex items-center gap-3 group shrink-0"
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/10 backdrop-blur-xl text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ring-2 ring-white/10 group-hover:ring-emerald-500/30 overflow-hidden p-1.5",
              )}
            >
              <Image
                src="/icon0.svg"
                alt="أبو عمران"
                fill
                priority
                sizes="44px"
                className="object-contain transition-all duration-500 dark:brightness-0 dark:invert"
              />
            </div>
            <span
              className={cn(
                "font-black text-xl lg:text-2xl tracking-tighter transition-all duration-500",
                isTransparent
                  ? "text-white"
                  : "text-emerald-950 dark:text-white",
              )}
            >
              {t.common.brand}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-6">
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
                    "text-sm font-bold tracking-tight transition-all flex items-center gap-2 px-3 py-2 rounded-xl relative group",
                    isActive
                      ? "text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20"
                      : isTransparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-muted-foreground hover:text-emerald-600 hover:bg-muted/50",
                  )}
                >
                  <Icon
                    src={link.icon}
                    parentHover={isHovered}
                    size={18}
                    colors={{
                      primary: isActive
                        ? "#059669"
                        : isTransparent
                          ? "#ffffff"
                          : "#10b981",
                      secondary: "#ffffff",
                    }}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle
              className={cn(
                "hidden md:flex h-9 w-9 rounded-xl transition-all duration-500",
                isTransparent
                  ? "text-white bg-white/10 border border-white/20 hover:bg-white/30 backdrop-blur-md shadow-lg"
                  : "text-foreground bg-muted/50 border border-border hover:bg-muted",
              )}
            />

            <Link href="/shop" className="hidden md:flex">
              <Button className="rounded-xl h-9 px-5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all duration-500 hover:scale-105 active:scale-95 group">
                {t.common.orderNow}
                <ArrowLeft className="me-1.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "xl:hidden rounded-xl h-10 w-10",
                isTransparent
                  ? "text-white bg-white/10 hover:bg-white/20"
                  : "text-foreground bg-muted/50 hover:bg-muted",
              )}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 end-0 z-[61] w-full max-w-sm bg-background border-s border-border p-8 shadow-md xl:hidden flex flex-col pt-24"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 end-6 rounded-full bg-muted/50 hover:bg-muted h-11 w-11"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="flex flex-col gap-5">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 text-xl font-bold transition-all p-3 rounded-xl",
                        pathname === link.href
                          ? "bg-emerald-600/10 text-emerald-600"
                          : "text-foreground hover:bg-muted",
                      )}
                    >

                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto space-y-4 pt-6 border-t border-border">
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 text-base shadow-md shadow-emerald-500/20">
                    {t.common.orderNow}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({
  link,
  pathname,
  isTransparent,
  t,
}: {
  link: any;
  pathname: string;
  isTransparent: boolean;
  t: any;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "text-sm font-bold tracking-tight transition-all flex items-center gap-2 px-3 py-2 rounded-xl relative group",
        isActive
          ? "text-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20"
          : isTransparent
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-muted-foreground hover:text-emerald-600 hover:bg-muted/50",
      )}
    >

      {link.label}
    </Link>
  );
}

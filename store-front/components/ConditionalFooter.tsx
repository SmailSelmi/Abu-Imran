"use client";

import { usePathname } from "next/navigation";

export function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOrderPage = pathname?.startsWith("/order") || pathname?.startsWith("/hatching");

  if (isOrderPage) return null;

  return <>{children}</>;
}

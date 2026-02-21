"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { BellRing } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export function RealtimeNotifications() {
  const supabase = createClient();
  const { t, locale } = useI18n();

  useEffect(() => {
    // Listen to inserts on the orders table
    const ordersChannel = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          console.log("New Order Received!", payload);
          const order = payload.new as any;
          toast.success(locale === "ar" ? "طلب جديد!" : "New Order Received!", {
            description:
              locale === "ar"
                ? `طلب جديد من ${order.customer_id ? "زبون مسجل" : "زبون جديد"} بقيمة ${order.total_amount} د.ج`
                : `New order received for ${order.total_amount} DA`,
            icon: <BellRing className="w-5 h-5 text-emerald-600" />,
            duration: 10000,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [locale]);

  return null;
}

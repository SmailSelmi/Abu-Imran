"use client";
import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  PerformanceMetrics,
  type RevenueDataPoint,
  type ProductSalePoint,
  type CategoryRevenuePoint,
} from "@/components/analytics/PerformanceMetrics";
import ChickenLoader from "@/components/ui/chicken-loader";
import { toast } from "sonner";
import { subDays, format, startOfDay, isAfter } from "date-fns";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    revenueData: RevenueDataPoint[];
    orderTrends: RevenueDataPoint[];
    topProducts: ProductSalePoint[];
    categoryData: CategoryRevenuePoint[];
  }>({
    revenueData: [],
    orderTrends: [],
    topProducts: [],
    categoryData: [],
  });

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all orders from the last 90 days for deep analytics
      // In a real production app, we might use an edge function or a materialized view
      const ninetyDaysAgo = subDays(new Date(), 90).toISOString();
      
      const { data: orders, error } = await supabase
        .from("orders")
        .select("total_amount, created_at, product_name, category, status")
        .gte("created_at", ninetyDaysAgo)
        .neq("status", "cancelled");

      if (error) throw error;

      if (!orders) return;

      // Grouping logic for Revenue Trends (Last 30 days)
      const revenueMap = new Map<string, number>();
      const trendsMap = new Map<string, number>();
      const productMap = new Map<string, number>();
      const categoryMap = new Map<string, number>();

      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

      orders.forEach((o) => {
        const amount = Number(o.total_amount) || 0;
        const date = new Date(o.created_at!);
        const dateKey = format(date, "yyyy-MM-dd");

        // Category breakdown
        const cat = o.category || "other";
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + amount);

        // Product sales
        const pName = o.product_name || "Unknown";
        productMap.set(pName, (productMap.get(pName) || 0) + 1);

        // Revenue & Trends for last 30 days
        if (isAfter(date, thirtyDaysAgo)) {
          revenueMap.set(dateKey, (revenueMap.get(dateKey) || 0) + amount);
          trendsMap.set(dateKey, (trendsMap.get(dateKey) || 0) + 1);
        }
      });

      // Prepare final data structures
      const revenueData: RevenueDataPoint[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = subDays(new Date(), i);
        const k = format(d, "yyyy-MM-dd");
        revenueData.push({
          name: format(d, "MMM dd"),
          revenue: revenueMap.get(k) || 0,
          date: k,
        });
      }

      const orderTrends: RevenueDataPoint[] = [];
      for (let i = 29; i >= 0; i--) {
        const d = subDays(new Date(), i);
        const k = format(d, "yyyy-MM-dd");
        orderTrends.push({
          name: format(d, "MMM dd"),
          revenue: trendsMap.get(k) || 0, // In this context "revenue" is "order count"
          date: k,
        });
      }

      const topProducts: ProductSalePoint[] = Array.from(productMap.entries())
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 8);

      const categoryData: CategoryRevenuePoint[] = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      setData({
        revenueData,
        orderTrends,
        topProducts,
        categoryData,
      });

    } catch (error) {
      console.error("Analytics Error:", error);
      toast.error("حدث خطأ أثناء تحميل الإحصائيات");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const init = async () => {
      await fetchData();
    };
    init();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <ChickenLoader mode="dashboard" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase">
            مركز البيانات والتحليلات
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm mt-1">
            رؤية شاملة لأداء المزرعة والنمو الاقتصادي
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchData()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            تحديث البيانات
          </button>
        </div>
      </div>

      <PerformanceMetrics
        revenueData={data.revenueData}
        orderTrends={data.orderTrends}
        topProducts={data.topProducts}
        categoryData={data.categoryData}
      />
    </div>
  );
}

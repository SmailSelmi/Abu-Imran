import { createClient } from "@/utils/supabase/server";
import { subDays, format } from "date-fns";
import DashboardContent, {
  type DashboardStats,
  type Alert,
  type Forecast,
  type AnalyticsData,
} from "@/components/dashboard/DashboardContent";
import type { Database } from "@/types/supabase";

export const dynamic = "force-dynamic";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

export default async function DashboardPage() {
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const supabase = await createClient();

  const [ordersRes, productsRes, customersRes] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, status, total_amount, created_at, customer_id, product_name, category, wilaya_address",
      )
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("products")
      .select("id, name, name_en, stock")
      .is("deleted_at", null),
    supabase.from("customers").select("id", { count: "exact", head: true }),
  ]);

  const orders = (ordersRes.data || []) as Order[];
  const products = (productsRes.data || []) as Product[];
  const totalCustomers = customersRes.count || 0;

  // 2. Process Analytics on the Server
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const activeOrders = orders.filter((o) =>
    ["pending", "shipped"].includes(o.status || ""),
  ).length;

  const lowStockThreshold = 10;
  const lowStockItems = products.filter(
    (p) => (Number(p.stock) || 0) <= lowStockThreshold,
  );

  const sevenDaysAgo = subDays(new Date(), 7);
  const fourteenDaysAgo = subDays(new Date(), 14);
  const recentOrders = orders.filter(
    (o) => o.created_at && new Date(o.created_at) > sevenDaysAgo,
  );
  const prevPeriodOrders = orders.filter(
    (o) =>
      o.created_at &&
      new Date(o.created_at) > fourteenDaysAgo &&
      new Date(o.created_at) <= sevenDaysAgo,
  );
  const uniqueCustomers = new Set(
    recentOrders.map((o) => o.customer_id).filter(Boolean),
  );

  // Revenue Trends (Last 7 Days)
  const groupedRevenue = new Map<string, number>();
  const productSales = new Map<string, number>();

  for (let i = 6; i >= 0; i--) {
    groupedRevenue.set(format(subDays(new Date(), i), "MMM dd"), 0);
  }

  orders
    .filter((o) => o.status !== "cancelled")
    .forEach((o) => {
      if (!o.created_at) return;
      const dateStr = format(new Date(o.created_at), "MMM dd");
      if (groupedRevenue.has(dateStr)) {
        groupedRevenue.set(
          dateStr,
          (groupedRevenue.get(dateStr) || 0) + (Number(o.total_amount) || 0),
        );
      }

      const pName = o.product_name || "Generic Product";
      productSales.set(pName, (productSales.get(pName) || 0) + 1);
    });

  const revenueData = Array.from(groupedRevenue.entries()).map(
    ([name, revenue]) => ({ name, revenue }),
  );
  const topProducts = Array.from(productSales.entries())
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Category Breakdown
  const categoryRevenue = new Map<string, number>();
  orders
    .filter((o) => o.status !== "cancelled")
    .forEach((o) => {
      const cat = o.category || "livestock";
      categoryRevenue.set(
        cat,
        (categoryRevenue.get(cat) || 0) + (Number(o.total_amount) || 0),
      );
    });
  const categoryData = Array.from(categoryRevenue.entries()).map(
    ([name, value]) => ({ name, value }),
  );

  // Wilaya distribution — map Arabic name → numeric code using lookup table
  const WILAYA_NAME_TO_ID: Record<string, string> = {
    أدرار: "01",
    الشلف: "02",
    الأغواط: "03",
    "أم البواقي": "04",
    باتنة: "05",
    بجاية: "06",
    بسكرة: "07",
    بشار: "08",
    البليدة: "09",
    البويرة: "10",
    تمنراست: "11",
    تبسة: "12",
    تلمسان: "13",
    تيارت: "14",
    "تيزي وزو": "15",
    الجزائر: "16",
    الجلفة: "17",
    جيجل: "18",
    سطيف: "19",
    سعيدة: "20",
    سكيكدة: "21",
    "سيدي بلعباس": "22",
    عنابة: "23",
    قالمة: "24",
    قسنطينة: "25",
    المدية: "26",
    مستغانم: "27",
    المسيلة: "28",
    معسكر: "29",
    ورقلة: "30",
    وهران: "31",
    البيض: "32",
    إليزي: "33",
    "برج بوعريريج": "34",
    بومرداس: "35",
    الطارف: "36",
    تندوف: "37",
    تيسمسيلت: "38",
    الوادي: "39",
    خنشلة: "40",
    "سوق أهراس": "41",
    تيبازة: "42",
    ميلة: "43",
    "عين الدفلى": "44",
    النعامة: "45",
    "عين تموشنت": "46",
    غرداية: "47",
    غليزان: "48",
    تيميمون: "49",
    "برج باجي مختار": "50",
    "أولاد جلال": "51",
    "بني عباس": "52",
    "عين صالح": "53",
    "عين قزام": "54",
    تقرت: "55",
    جانت: "56",
    المغير: "57",
    المنيعة: "58",
  };
  const wilayaStats: Record<string, number> = {};
  orders.forEach((o) => {
    // wilaya_address stores "detailedAddress, wilayaName"
    // o.wilaya_address comes from place_order: p_address + ', ' + p_wilaya
    // Try to extract wilaya name from the end of wilaya_address
    const rawWilaya = o.wilaya_address?.split(",").pop()?.trim() || "";
    const wId = WILAYA_NAME_TO_ID[rawWilaya] || "16";
    wilayaStats[wId] = (wilayaStats[wId] || 0) + 1;
  });

  // Alerts
  const alerts: Alert[] = [];
  if (lowStockItems.length > 0) {
    // Choose "منتجات" for 3-10, and "منتجاً" for 11-99
    const itemName =
      lowStockItems.length > 2 && lowStockItems.length <= 10
        ? "منتجات"
        : "منتجاً";
    alerts.push({
      type: "critical",
      message: `يوجد ${lowStockItems.length} ${itemName} بمخزون منخفض`,
      link: "/inventory/breeds",
      label: "نقص المخزون",
    });
  }

  const pendingLong = orders.filter(
    (o) =>
      o.status === "pending" &&
      o.created_at &&
      new Date(o.created_at).getTime() < now - 86400000,
  ).length;

  if (pendingLong > 0) {
    alerts.push({
      type: "warning",
      message: `${pendingLong} طلب متأخر يحتاج للمعالجة`,
      link: "/orders",
      label: "طلبيات متأخرة",
    });
  }

  // Forecasts
  const forecasts: Forecast[] = [];
  products.forEach((p) => {
    const productOrdersCount = orders.filter(
      (o) =>
        (o.product_name === p.name_en || o.product_name === p.name) &&
        o.created_at &&
        new Date(o.created_at) > sevenDaysAgo,
    ).length;
    const dailyRate = productOrdersCount / 7;
    if (dailyRate > 0) {
      const daysLeft = Math.floor((p.stock || 0) / dailyRate);
      if (daysLeft < 7) {
        forecasts.push({
          name: p.name_en || p.name || "Unknown",
          daysLeft,
          stock: p.stock,
        });
      }
    }
  });

  const avgOrderValue =
    orders.length > 0
      ? Math.round(
          revenue / orders.filter((o) => o.status !== "cancelled").length,
        )
      : 0;
  const topBreedName = topProducts.length > 0 ? topProducts[0].name : "N/A";

  // Compute real revenue & order change percentages (last 7d vs prior 7d)
  const recentRevenue = recentOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const prevRevenue = prevPeriodOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const revenueChange =
    prevRevenue > 0
      ? Math.round(((recentRevenue - prevRevenue) / prevRevenue) * 100)
      : recentRevenue > 0
        ? 100
        : 0;
  const ordersChange =
    prevPeriodOrders.length > 0
      ? Math.round(
          ((recentOrders.length - prevPeriodOrders.length) /
            prevPeriodOrders.length) *
            100,
        )
      : recentOrders.length > 0
        ? 100
        : 0;

  const stats: DashboardStats = {
    revenue,
    activeOrders,
    criticalStock: lowStockItems.length,
    activeUniqueCustomers: uniqueCustomers.size,
    totalCustomers,
    avgOrderValue,
    topBreed: topBreedName,
    revenueChange,
    ordersChange,
  };

  const analyticsData: AnalyticsData = {
    revenueData,
    topProducts,
    categoryData,
    wilayaData: wilayaStats,
  };

  return (
    <div className="p-3 md:p-8 pb-10">
      <DashboardContent
        stats={stats}
        alerts={alerts}
        forecasts={forecasts
          .sort((a, b) => a.daysLeft - b.daysLeft)
          .slice(0, 3)}
        recentActivity={orders.slice(0, 10)}
        analyticsData={analyticsData}
      />
    </div>
  );
}

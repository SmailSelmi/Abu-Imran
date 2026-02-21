"use client";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { clsx } from "clsx";
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isWithinInterval,
  parseISO,
} from "date-fns";

export interface RevenueDataPoint {
  name: string;
  revenue: number;
  date?: string;
}

export interface ProductSalePoint {
  name: string;
  sales: number;
}

export interface CategoryRevenuePoint {
  name: string;
  value: number;
}

interface MetricsProps {
  revenueData: RevenueDataPoint[];
  orderTrends: RevenueDataPoint[];
  topProducts: ProductSalePoint[];
  categoryData?: CategoryRevenuePoint[];
}

type TimeRange = "today" | "week" | "month" | "year" | "all" | "custom";

const TIME_FILTERS: { label: string; value: TimeRange }[] = [
  { label: "اليوم", value: "today" },
  { label: "هذا الأسبوع", value: "week" },
  { label: "هذا الشهر", value: "month" },
  { label: "هذا العام", value: "year" },
  { label: "الكل", value: "all" },
  { label: "مخصص", value: "custom" },
];

const CATEGORY_LABELS: Record<string, string> = {
  eggs: "البيض",
  chicks: "الكتاكيت",
  chickens: "الدجاج",
  machine: "الأجهزة",
};

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; bar: string }
> = {
  eggs: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-600",
    bar: "bg-orange-500",
  },
  chicks: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  chickens: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-600",
    bar: "bg-purple-500",
  },
  machine: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600",
    bar: "bg-blue-500",
  },
};

function getRangeStart(range: TimeRange): Date | null {
  const now = new Date();
  switch (range) {
    case "today":
      return startOfDay(now);
    case "week":
      return startOfWeek(now, { weekStartsOn: 6 });
    case "month":
      return startOfMonth(now);
    case "year":
      return startOfYear(now);
    default:
      return null;
  }
}

export const PerformanceMetrics = ({
  revenueData,
  orderTrends,
  topProducts,
  categoryData,
}: MetricsProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const filterData = (data: RevenueDataPoint[]): RevenueDataPoint[] => {
    if (!data) return data;
    if (timeRange === "all") return data;
    if (timeRange === "custom") {
      if (!customFrom && !customTo) return data;
      const from = customFrom ? new Date(customFrom) : new Date(0);
      const to = customTo ? new Date(customTo + "T23:59:59") : new Date();
      return data.filter((d) => {
        const date = d.date ? parseISO(d.date) : null;
        if (!date) return true;
        return isWithinInterval(date, { start: from, end: to });
      });
    }
    const rangeStart = getRangeStart(timeRange);
    if (!rangeStart) return data;
    const today = new Date();
    return data.filter((d) => {
      const date = d.date ? parseISO(d.date) : null;
      if (!date) return true;
      return isWithinInterval(date, { start: rangeStart, end: today });
    });
  };

  const filteredRevenue = useMemo(
    () => filterData(revenueData),
    [revenueData, timeRange, customFrom, customTo],
  );
  const filteredTrends = useMemo(
    () => filterData(orderTrends),
    [orderTrends, timeRange, customFrom, customTo],
  );

  const tooltipStyle = {
    borderRadius: "1rem",
    border: "none",
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.2)",
    fontWeight: 900,
    fontSize: "13px",
    backgroundColor: "var(--card, #fff)",
    color: "var(--foreground, #000)",
    backdropFilter: "blur(12px)",
  };

  const handleRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    setShowCustom(value === "custom");
  };

  return (
    <div className="space-y-8">
      {/* Time Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-black tracking-tight opacity-60">
          تحليل الأداء
        </h2>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/50 flex-wrap">
            {TIME_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleRangeChange(f.value)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-black transition-all whitespace-nowrap flex items-center gap-1",
                  timeRange === f.value
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {f.value === "custom" && <Calendar className="w-3 h-3" />}
                {f.label}
              </button>
            ))}
          </div>

          {/* Custom date range inputs */}
          {showCustom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 bg-muted/30 border border-border/50 rounded-xl px-3 py-2"
            >
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                من
              </label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="text-xs font-black bg-transparent border-none outline-none text-foreground"
              />
              <span className="text-muted-foreground/50 text-xs">—</span>
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                إلى
              </label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="text-xs font-black bg-transparent border-none outline-none text-foreground"
              />
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Area Chart */}
        <Card className="border border-border/40 shadow-sm rounded-xl bg-white dark:bg-card overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black tracking-tighter">
                  إحصائيات المبيعات
                </CardTitle>
                <CardDescription className="font-bold text-base opacity-60">
                  تتبع الإيرادات وحجم النمو المالي
                </CardDescription>
              </div>
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredRevenue}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="currentColor"
                  className="text-border/30"
                  opacity={0.4}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 900,
                    fill: "currentColor",
                    opacity: 0.4,
                  }}
                  dy={10}
                />
                <YAxis
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 900,
                    fill: "currentColor",
                    opacity: 0.4,
                  }}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={40}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number | undefined) => [
                    `${(value ?? 0).toLocaleString()} دج`,
                    "الإيرادات",
                  ]}
                  labelStyle={{ opacity: 0.6, fontWeight: 900 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  animationDuration={800}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#10b981",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products Bar Chart */}
        <Card className="border border-border/40 shadow-sm rounded-xl bg-white dark:bg-card overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black tracking-tighter">
                  المنتجات الأكثر طلباً
                </CardTitle>
                <CardDescription className="font-bold text-base opacity-60">
                  تحليل أداء المخزون والطلب
                </CardDescription>
              </div>
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600">
                <Package className="w-7 h-7" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="currentColor"
                  className="text-border/30"
                  opacity={0.4}
                />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fontWeight: 900,
                    fill: "currentColor",
                    opacity: 0.6,
                  }}
                  tickFormatter={(value) =>
                    typeof value === "string" && value.length > 15
                      ? value.substring(0, 15) + "..."
                      : value
                  }
                  width={110}
                  orientation="right"
                />
                <Tooltip
                  cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                  contentStyle={tooltipStyle}
                  formatter={(value: number | undefined) => [
                    (value ?? 0).toLocaleString(),
                    "المبيعات",
                  ]}
                />
                <Bar
                  dataKey="sales"
                  fill="#6366f1"
                  radius={[10, 0, 0, 10]}
                  barSize={28}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Row */}
      {categoryData && categoryData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.map((cat, i) => {
            const colors =
              CATEGORY_COLORS[cat.name] || CATEGORY_COLORS["machine"];
            const label = CATEGORY_LABELS[cat.name] || cat.name;

            return (
              <Card
                key={i}
                className="border border-border/40 shadow-sm rounded-xl bg-white dark:bg-card p-8 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner",
                      colors.bg,
                      colors.text,
                    )}
                  >
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-50">
                    {label}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black tracking-tighter tabular-nums">
                    {cat.value.toLocaleString()}{" "}
                    <span className="text-xs font-black opacity-30">دج</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                    إجمالي الإيرادات
                  </p>
                </div>
                <div className="mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 1.2,
                      delay: i * 0.15,
                      ease: "easeOut",
                    }}
                    className={clsx("h-full rounded-full", colors.bar)}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

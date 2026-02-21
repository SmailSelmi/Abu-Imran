"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Phone,
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle,
  Search,
  Edit,
  X,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import ChickenLoader from "@/components/ui/chicken-loader";
import { formatDistanceToNow } from "date-fns";
import type { OrderWithRelations } from "@/types/orders";
import { EditOrderDialog } from "@/components/orders/EditOrderDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

import useSWR from "swr";

const STATUS_LABELS: Record<string, string> = {
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغى",
  pending: "قيد الانتظار",
};

const supabase = createClient();

const fetcher = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        customers (
          *,
          customer_loyalty (
            level,
            tag_ar
          )
        ),
        order_items (
          *,
          products (
            name,
            breeds (
                name_ar
            )
          )
        ),
        products (
          name,
          breeds (
            name_ar
          )
        )
      `,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Join fetch failed, falling back:", error);
    const { data: simpleData } = await supabase
      .from("orders")
      .select(
        "id, status, total_amount, customer_name, phone_number, created_at, product_name, egg_count",
      )
      .order("created_at", { ascending: false })
      .limit(50);
    return (simpleData || []) as unknown as OrderWithRelations[];
  }
  return (data || []) as unknown as OrderWithRelations[];
};

export default function OrdersPage() {
  const {
    data: orders = [],
    error,
    isLoading: loading,
    mutate: fetchOrders,
  } = useSWR("admin_orders", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 60000,
    focusThrottleInterval: 30000,
  });

  const [filter, setFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [editingOrder, setEditingOrder] = useState<OrderWithRelations | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredOrders = (orders || []).filter((o) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "active"
          ? ["pending", "shipped"].includes(o.status || "pending")
          : ["delivered", "cancelled"].includes(o.status || "pending");
    const matchesSearch =
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone_number?.includes(search) ||
      o.id.toString().includes(search);
    return matchesFilter && matchesSearch;
  });

  const toggleSelect = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  // Translation mapping for generic terms
  const translateProduct = (name: string) => {
    const mapping: Record<string, string> = {
      "Baby Chicks": "كتاكيت",
      "Hatching Eggs": "بيض مخصب",
      Livestock: "دواجن بالغة",
      "Automatic 48 Eggs": "فقاسة 48 بيضة",
      "Automatic 96 Eggs": "فقاسة 96 بيضة",
      "Industrial 1000 Eggs": "فقاسة صناعية 1000 بيضة",
    };
    return mapping[name] || name;
  };

  const getProductNameAr = (order: any) => {
    // 1. Try product name from breeds join
    if (order.products?.breeds?.name_ar) return order.products.breeds.name_ar;
    // 2. Try product name direct
    if (order.products?.name) return order.products.name;
    // 3. Try translated product_name from order
    if (order.product_name) return translateProduct(order.product_name);
    return "المنتج";
  };

  const getItemNameAr = (item: any) => {
    if (item.products?.breeds?.name_ar) return item.products.breeds.name_ar;
    if (item.products?.name) return item.products.name;
    return translateProduct(item.product_name);
  };

  const markBulkStatus = async (
    status: "pending" | "shipped" | "delivered" | "cancelled",
  ) => {
    const statusLabels: Record<string, string> = {
      shipped: "تم الشحن",
      delivered: "تم التوصيل",
      cancelled: "ملغى",
      pending: "قيد الانتظار",
    };
    setConfirmConfig({
      title: `تحديث ${selectedOrders.length} طلبيات؟`,
      description: `سيتم تغيير حالة هذه الطلبيات إلى: ${statusLabels[status]}`,
      confirmText: `تأكيد`,
      variant: status === "cancelled" ? "destructive" : "default",
      onConfirm: async () => {
        const { error } = await (supabase as any)
          .from("orders")
          .update({ status: status as string })
          .in("id", selectedOrders);

        if (error) toast.error("فشل تحديث الطلبيات");
        else {
          toast.success("تم تحديث الطلبيات بنجاح");

          if (status === "delivered" || status === "cancelled") {
            const uniqueCustomerIds = Array.from(
              new Set(
                orders
                  .filter((o) => selectedOrders.includes(o.id))
                  .map((o) => o.customer_id)
                  .filter(Boolean),
              ),
            );
            if (uniqueCustomerIds.length > 0) {
              await Promise.all(
                uniqueCustomerIds.map((id) =>
                  recalculateReliability(id as string),
                ),
              );
            }
          }
          setSelectedOrders([]);
          fetchOrders();
        }
      },
    });
    setConfirmOpen(true);
  };

  const markBulkDelete = async () => {
    setConfirmConfig({
      title: `حذف ${selectedOrders.length} طلبيات؟`,
      description:
        "سيتم حذف هذه الطلبيات نهائياً. هذه العملية لا يمكن التراجع عنها.",
      confirmText: "حذف نهائي",
      variant: "destructive",
      onConfirm: async () => {
        const { error } = await supabase
          .from("orders")
          .delete()
          .in("id", selectedOrders);
        if (error) toast.error("فشل الحذف الجماعي");
        else toast.success("تم حذف الطلبيات بنجاح");
        setSelectedOrders([]);
        fetchOrders();
      },
    });
    setConfirmOpen(true);
  };

  useEffect(() => {
    // Premium Cashier Sound Effect
    audioRef.current = new Audio(
      "https://www.soundjay.com/misc/sounds/cash-register-05.mp3",
    );
    fetchOrders();

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        async (payload) => {
          console.log("Realtime Order Payload:", payload);
          if (payload.eventType === "INSERT") {
            const newOrder = payload.new as any;

            let productNameAr = newOrder.product_name;

            // If product_id exists, fetch Arabic breed/product name
            if (newOrder.product_id) {
              const { data: prodData } = await supabase
                .from("products")
                .select("name, breeds(name_ar)")
                .eq("id", newOrder.product_id)
                .single();

              if ((prodData as any)?.breeds?.name_ar) {
                productNameAr = (prodData as any).breeds.name_ar;
              } else if (prodData?.name) {
                productNameAr = prodData.name;
              } else {
                productNameAr = translateProduct(newOrder.product_name);
              }
            } else {
              productNameAr = translateProduct(newOrder.product_name);
            }

            toast.success(`طلب جديد! (${newOrder.customer_name})`, {
              description: `${productNameAr} - الكمية: ${newOrder.quantity}`,
              duration: 10000,
              icon: "💰",
            });

            try {
              // Play cashier sound
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current
                  .play()
                  .catch((e) => console.log("Audio play failed", e));
              }
            } catch (e) {
              console.error(e);
            }
          }
          fetchOrders();
        },
      )
      .subscribe((status) => {
        console.log("Order Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchOrders]);

  const updateStatus = async (
    id: string,
    newStatus: "pending" | "shipped" | "delivered" | "cancelled",
    customerId?: string | null,
  ) => {
    const promise = async () => {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus as string })
        .eq("id", id);
      if (error) throw new Error("فشل تحديث الحالة");

      if (
        customerId &&
        (newStatus === "delivered" || newStatus === "cancelled")
      ) {
        await recalculateReliability(customerId);
      }
      
      // Optimistic UI Update
      fetchOrders(
        (prev: any) =>
          prev?.map((o: any) =>
            o.id === id ? { ...o, status: newStatus } : o,
          ),
        { revalidate: false }
      );
      
      return `تم تحديث حالة الطلب إلى ${STATUS_LABELS[newStatus] || newStatus}`;
    };

    toast.promise(promise(), {
      loading: "جاري التحديث...",
      success: (data) => data,
      error: "فشل تحديث الحالة",
    });
  };

  const recalculateReliability = async (customerId: string) => {
    // Fetch ALL orders for this customer to calculate CLV and reliability
    const { data: oData } = await (supabase as any)
      .from("orders")
      .select("status, total_amount")
      .eq("customer_id", customerId);

    const orders = oData || [];
    if (orders.length === 0) return;

    // Reliability logic (Terminal Statuses only)
    const terminalOrders = orders.filter((o: any) =>
      ["delivered", "cancelled"].includes(o.status),
    );
    const deliveredCount = terminalOrders.filter(
      (o: any) => o.status === "delivered",
    ).length;
    const reliabilityScore =
      terminalOrders.length > 0
        ? Math.round((deliveredCount / terminalOrders.length) * 100)
        : 100;

    // Financial Metrics (LTV/CLV)
    const deliveredOrders = orders.filter((o: any) => o.status === "delivered");
    const totalSpent = deliveredOrders.reduce(
      (acc: number, curr: any) => acc + (Number(curr.total_amount) || 0),
      0,
    );
    const totalOrdersCount = orders.length;

    await (supabase as any)
      .from("customers")
      .update({
        reliability_score: reliabilityScore,
        total_spent: totalSpent,
        total_orders: totalOrdersCount,
      })
      .eq("id", customerId);
  };

  const deleteOrder = async (id: string) => {
    setConfirmConfig({
      title: "حذف الطلبية؟",
      description:
        "هل أنت متأكد من حذف هذه الطلبية؟ هذه العملية لا يمكن التراجع عنها.",
      confirmText: "حذف نهائي",
      variant: "destructive",
      onConfirm: async () => {
        const promise = async () => {
          const { error } = await supabase.from("orders").delete().eq("id", id);
          if (error) throw new Error("فشل الحذف");
          
          fetchOrders((prev: any) => prev?.filter((o: any) => o.id !== id), { revalidate: false });
          return "تم حذف الطلبية بنجاح";
        };
        
        toast.promise(promise(), {
          loading: "جاري الحذف...",
          success: (data) => data,
          error: "فشل الحذف",
        });
      },
    });
    setConfirmOpen(true);
  };

  const getStatusColor = (status: string | null) => {
    switch (status || "pending") {
      case "delivered":
        return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30";
      case "shipped":
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
      case "cancelled":
        return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30";
      default:
        return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30";
    }
  };

  const handleEdit = (order: OrderWithRelations) => {
    setEditingOrder(order);
    setIsDialogOpen(true);
  };

  const statusTranslations: Record<string, string> = {
    all: "الكل",
    active: "طلبات نشطة",
    archived: "طلبات مؤرشفة",
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <ChickenLoader mode="dashboard" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmConfig?.onConfirm || (() => {})}
        title={confirmConfig?.title || ""}
        description={confirmConfig?.description || ""}
        confirmText={confirmConfig?.confirmText}
        variant={confirmConfig?.variant}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            الطلبيات{" "}
            <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 text-sm font-black px-4 py-1 rounded-full">
              {filteredOrders.length}
            </span>
          </h1>
          <p className="text-muted-foreground">
            إدارة وتتبع إنتاج المزرعة في الوقت الحقيقي.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن طلب..."
              className="pr-10 bg-white dark:bg-card border-border/50 rounded-xl h-12 font-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-full md:w-auto overflow-x-auto border border-border/50">
            {["active", "archived", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-black rounded-xl capitalize transition-all whitespace-nowrap ${filter === f ? "bg-white dark:bg-card shadow-sm text-emerald-600" : "text-muted-foreground hover:text-foreground"}`}
              >
                {statusTranslations[f] || f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-zinc-950 border border-border/40 shadow-sm overflow-hidden relative">
        {selectedOrders.length > 0 && (
          <div className="absolute top-0 left-0 right-0 bg-emerald-600 text-white p-3 z-10 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="px-4 font-black flex items-center gap-3">
              <span className="bg-white text-emerald-600 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black">
                {selectedOrders.length}
              </span>
              طلب محدد
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl font-black"
                onClick={() => markBulkStatus("shipped")}
              >
                <Truck className="w-4 h-4 ms-2" /> شحن المحدد
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl font-black"
                onClick={() => markBulkStatus("delivered")}
              >
                <CheckCircle className="w-4 h-4 ms-2" /> توصيل المحدد
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setSelectedOrders([])}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground glass-card sticky top-0 z-10 border-b border-border/50">
              <tr>
                <th className="h-14 px-6 text-right align-middle w-[50px]">
                  <Checkbox
                    checked={
                      selectedOrders.length === filteredOrders.length &&
                      filteredOrders.length > 0
                    }
                    onCheckedChange={toggleAll}
                    className="rounded-md border-muted-foreground/30"
                  />
                </th>
                <th className="h-12 px-4 text-right align-middle text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  المعرف
                </th>
                <th className="h-12 px-4 text-right align-middle text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] min-w-[200px]">
                  الزبون
                </th>
                <th className="h-12 px-4 text-right align-middle text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] min-w-[250px]">
                  تفاصيل الشحن
                </th>
                <th className="h-12 px-4 text-right align-middle text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] w-[150px]">
                  المنتج
                </th>
                <th className="h-12 px-4 text-right align-middle text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  الإجمالي
                </th>
                <th className="h-12 px-4 text-right align-middle text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  الحالة
                </th>
                <th className="h-12 px-4 text-right align-middle text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  التاريخ
                </th>
                <th className="h-12 px-4 align-middle text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-left">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b border-border/30 transition-all duration-300 hover:bg-emerald-50/10 group ${selectedOrders.includes(order.id) ? "bg-emerald-50/20" : ""}`}
                >
                  <td className="p-6 align-middle">
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={() => toggleSelect(order.id)}
                      className="rounded-md border-muted-foreground/20"
                    />
                  </td>
                  <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                    #{order.id.toString().slice(0, 8)}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="space-y-1">
                      <div className="font-bold flex items-center gap-2">
                        {order.customers?.full_name || order.customer_name}
                        {order.customers?.reliability_score &&
                          order.customers.reliability_score >= 90 && (
                            <ShieldCheck className="h-3 w-3 text-green-500" />
                          )}
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${order.phone_number || ""}`}
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-mono"
                        >
                          <Phone className="h-3 w-3" /> {order.phone_number}
                        </a>
                        <a
                          href={`https://wa.me/${(order.phone_number || "").replace(/\s+/g, "")}`}
                          target="_blank"
                          className="p-1 bg-green-50 text-green-600 rounded-full hover:bg-green-100"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </a>
                      </div>
                      {(order.customers?.total_orders || 0) > 1 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 px-2 py-0 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 w-fit font-black"
                        >
                          زبون وفي
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="space-y-1 max-w-[300px]">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
                        <MapPin className="h-3 w-3" />{" "}
                        {order.delivery_zones?.name || "Algérie"}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {order.wilaya_address}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="space-y-2 max-w-[250px]">
                      {order.order_items && order.order_items.length > 0 ? (
                        <div className="space-y-1">
                          {order.order_items.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-[11px] font-bold"
                            >
                              <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] min-w-[20px] text-center">
                                x{item.quantity}
                              </span>
                              <span className="truncate">
                                {getItemNameAr(item)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="font-medium flex flex-col gap-0.5">
                          <span className="text-sm">
                            {getProductNameAr(order)}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                            {order.category} /{" "}
                            {order.product_variant || "Standard"}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-middle font-bold text-black dark:text-white">
                    {(order.total_amount || 0).toLocaleString()}{" "}
                    <span className="text-[10px] text-muted-foreground">
                      DA
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant="outline"
                      className={`capitalize rounded-full font-black px-3 py-1 ${getStatusColor(order.status)}`}
                    >
                      {STATUS_LABELS[order.status || "pending"] || order.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle text-xs text-muted-foreground">
                    {order.created_at
                      ? formatDistanceToNow(new Date(order.created_at), {
                          addSuffix: true,
                        })
                      : "N/A"}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(order)}
                        className="h-10 w-10 p-0"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      {order.status !== "delivered" &&
                        order.status !== "cancelled" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(order.id, "shipped")}
                              className="h-10 w-10 p-0 border-emerald-100 dark:border-emerald-500/20 text-emerald-600"
                              title="شحن"
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateStatus(
                                  order.id,
                                  "delivered",
                                  order.customer_id,
                                )
                              }
                              className="h-10 w-10 p-0 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20"
                              title="تم التوصيل"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                updateStatus(
                                  order.id,
                                  "cancelled",
                                  order.customer_id,
                                )
                              }
                              className="h-10 w-10 p-0 text-red-500 hover:bg-red-50 dark:bg-red-500/10"
                              title="إلغاء"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteOrder(order.id)}
                        className="h-10 w-10 p-0 text-red-500"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 opacity-20" />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">
                لا توجد طلبيات
              </h3>
              <p className="text-sm font-medium opacity-80 max-w-[250px]">
                لم يتم العثور على أي طلبيات تطابق بحثك أو الفلتر الحالي.
              </p>
            </div>
          )}
        </div>
      </div>

      {editingOrder && (
        <EditOrderDialog
          order={editingOrder}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}

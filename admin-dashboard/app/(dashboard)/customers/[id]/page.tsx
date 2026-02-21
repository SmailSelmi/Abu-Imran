"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Save,
  ShieldCheck,
  ShieldAlert,
  Package,
  Clock,
  MessageCircle,
  Tag,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import ChickenLoader from "@/components/ui/chicken-loader";
import { formatDistanceToNow } from "date-fns";
import type { Customer, OrderWithRelations } from "@/types/orders"; // Re-using existing types where possible

import { Icon } from "@/components/ui/Icon";
import { clsx } from "clsx";

export default function CustomerDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const supabase = createClient();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [reliability, setReliability] = useState(100);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (id) fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    setLoading(true);

    // Fetch Customer
    const { data: custData, error: custError } = await (supabase as any)
      .from("customers")
      .select(
        "id, full_name, phone, notes, tags, total_spent, total_orders, reliability_score, wilaya, commune",
      )
      .eq("id", id)
      .single();

    if (custError || !custData) {
      toast.error("Customer not found");
      router.push("/customers");
      return;
    }

    // Fetch Orders - Using standardized total_amount
    const { data: ordData, error: ordError } = await (supabase as any)
      .from("orders")
      .select(
        "id, product_name, category, created_at, total_amount, quantity, status",
      )
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

    setCustomer(custData as Customer);
    setNotes(custData.notes || "");
    setReliability(custData.reliability_score || 100);
    setTags(custData.tags || []);
    setOrders((ordData || []) as OrderWithRelations[]);

    setLoading(false);
  };

  const handleSave = async () => {
    const { error } = await (supabase as any)
      .from("customers")
      .update({ notes, reliability_score: reliability, tags })
      .eq("id", id);

    if (error) toast.error("Failed to save changes");
    else toast.success("Customer profile updated");
  };

  const getStatusColor = (status: string | null) => {
    switch (status || "pending") {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-700";
      case "cancelled":
        return "bg-red-100 dark:bg-red-500/20 text-red-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <ChickenLoader mode="dashboard" />
      </div>
    );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="rounded-full hover:bg-muted font-bold group"
        >
          <ArrowLeft className="me-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />{" "}
          قائمة الزبائن
        </Button>
        <div className="flex items-center gap-2">
          <Badge
            className={clsx(
              "px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border-none",
              reliability >= 90
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700",
            )}
          >
            {reliability >= 90 ? "Vetted Client" : "Watch List"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-emerald-200 dark:border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:bg-emerald-500/10 h-9 font-black"
            onClick={() => {
              const phone = customer?.phone?.replace(/\s/g, "");
              if (phone)
                window.open(
                  `https://wa.me/${phone.startsWith("0") ? "213" + phone.slice(1) : phone}`,
                  "_blank",
                );
            }}
          >
            <MessageCircle className="w-4 h-4 me-2" /> واتساب
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="border border-border/40 shadow-sm bg-white dark:bg-zinc-950 rounded-xl overflow-hidden group">
            <div className="h-24 bg-primary relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 bg-white dark:bg-card p-1.5 rounded-xl shadow-xl group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                    <Icon
                      src="https://cdn.lordicon.com/bgebyztw.json"
                      trigger="loop"
                      size={64}
                    />
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="pt-16 text-center space-y-6 pb-10">
              <div>
                <h2 className="text-3xl font-black tracking-tight">
                  {customer?.full_name}
                </h2>
                <p className="text-muted-foreground font-medium text-sm">
                  ID: #{customer?.id.toString().slice(0, 8)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 p-4 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Lifetime Value
                  </p>
                  <p className="text-xl font-black text-green-600">
                    {customer?.total_spent?.toLocaleString() || 0}{" "}
                    <span className="text-[10px]">DA</span>
                  </p>
                </div>
                <div className="bg-muted/40 p-4 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Frequency
                  </p>
                  <p className="text-xl font-black">
                    {customer?.total_orders || 0}{" "}
                    <span className="text-[10px]">Orders</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-left px-4">
                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover/item:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground leading-none mb-1">
                      DIRECT LINE
                    </p>
                    <span className="font-black text-sm">
                      {customer?.phone || "UNAVAILABLE"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground leading-none mb-1">
                      PRIMARY CLUSTER
                    </p>
                    <span className="font-black text-sm uppercase">
                      {customer?.wilaya}{" "}
                      {customer?.commune ? `/ ${customer.commune}` : ""}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-muted/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                    Customer Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-muted hover:bg-muted/80 text-muted-foreground border-none rounded-lg px-2 py-1 flex items-center gap-1 group/tag"
                      >
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer opacity-0 group-hover/tag:opacity-100 transition-opacity"
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                        />
                      </Badge>
                    ))}
                    <div className="flex items-center gap-1">
                      <Input
                        placeholder="Add..."
                        className="h-7 w-20 text-[10px] rounded-lg border-dashed bg-transparent p-2"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newTag) {
                            setTags([...tags, newTag]);
                            setNewTag("");
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Context */}
          <Card className="border border-border/40 shadow-sm rounded-xl bg-white dark:bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-lg font-black uppercase tracking-widest text-muted-foreground/60">
                إدارة المخاطر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest ms-1">
                  ملاحظات سلوكية
                </Label>
                <Textarea
                  placeholder="Describe interactions, preferences or flags..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] rounded-xl border-transparent bg-background focus:ring-primary/20"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest ms-1">
                  مؤشر الموثوقية ({reliability}%)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    value={reliability}
                    onChange={(e) => setReliability(Number(e.target.value))}
                    max={100}
                    min={0}
                    className="accent-primary h-2"
                  />
                  <div
                    className={clsx(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                      reliability >= 90
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white",
                    )}
                  >
                    {reliability >= 90 ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : (
                      <ShieldAlert className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>
              <Button
                className="w-full h-14 rounded-xl font-black text-lg shadow-sm bg-primary hover:bg-primary/90"
                onClick={handleSave}
              >
                <Save className="me-2 h-5 w-5" /> مزامنة الملف الشخصي
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activity Logs (Order History) */}
        <div className="lg:col-span-2">
          <Card className="h-full border border-border/40 shadow-sm rounded-xl bg-white dark:bg-zinc-950 relative overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-black flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Icon
                      src="https://cdn.lordicon.com/wxnxiano.json"
                      trigger="loop"
                      size={28}
                    />
                  </div>
                  Transaction History
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="font-bold rounded-lg px-3"
                >
                  {orders.length} TOTAL
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-muted/50">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-8 hover:bg-muted/10 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                  >
                    <div className="flex items-center gap-6">
                      <div
                        className={clsx(
                          "w-16 h-16 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform",
                          order.category === "machine"
                            ? "bg-purple-50 text-purple-600"
                            : "bg-orange-50 text-orange-600",
                        )}
                      >
                        <Icon
                          src={
                            order.category === "eggs"
                              ? "https://cdn.lordicon.com/hursldjj.json"
                              : order.category === "chicks"
                                ? "https://cdn.lordicon.com/rxufjlal.json"
                                : "https://cdn.lordicon.com/msoeawqm.json"
                          }
                          trigger="hover"
                          size={32}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xl font-black truncate">
                          {order.product_name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-black border-muted-foreground/20 px-1.5 py-0 leading-none h-4 uppercase"
                          >
                            {order.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {order.created_at
                              ? formatDistanceToNow(
                                  new Date(order.created_at),
                                  { addSuffix: true },
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:text-right md:flex-col md:items-end gap-2 w-full md:w-auto border-t md:border-none pt-4 md:pt-0">
                      <div>
                        <p className="text-2xl font-black tracking-tighter text-green-600">
                          {(order.total_amount || 0).toLocaleString()}{" "}
                          <span className="text-xs font-bold opacity-60">
                            DA
                          </span>
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground leading-none">
                          UNIT TYPE: x{order.quantity || 1}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={clsx(
                          "mt-1 capitalize rounded-xl px-3 py-0.5 font-bold tracking-widest text-[10px] border-none",
                          getStatusColor(order.status),
                        )}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="py-20 text-center space-y-4 opacity-50">
                    <Icon
                      src="https://cdn.lordicon.com/msoeawqm.json"
                      trigger="loop"
                      size={80}
                    />
                    <p className="text-xl font-black">
                      STAGNANT TRANSACTION LOG
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

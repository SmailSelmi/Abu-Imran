"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Phone,
  MapPin,
  Calendar,
  Egg,
  CheckCircle,
  Search,
  Edit,
  X,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ChickenLoader from "@/components/ui/chicken-loader";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function HatchingPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  } | null>(null);

  const supabase = createClient();

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filter === "all" ? true : b.status === filter;
    const matchesSearch =
      b.customers?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.customers?.phone?.includes(search);
    return matchesFilter && matchesSearch;
  });

  const fetchBookings = React.useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    const { data, error } = await supabase
      .from("hatching_bookings")
      .select(
        `
        *,
        customers (
          full_name,
          phone,
          wilaya
        ),
        breeds (
          name_en,
          name_ar
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (data) setBookings(data);
    if (error) {
      toast.error("Failed to fetch bookings");
      console.error(error);
    }
    if (showLoader) setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel("hatching-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "hatching_bookings" },
        (payload) => {
          console.log("Realtime Hatching Payload:", payload);
          toast.success("حجز حضانة جديد!", {
            description: `الزبون: ${(payload.new as any).customer_id}`, // We'd need to fetch name, but this verifies it works
            duration: 8000,
          });
          fetchBookings(false);
        },
      )
      .subscribe((status) => {
        console.log("Hatching Realtime Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchBookings]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("hatching_bookings")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Booking updated to ${newStatus}`);
      fetchBookings(false);
    }
  };

  const deleteBooking = async (id: string) => {
    setConfirmConfig({
      title: "Delete Booking?",
      description: "Are you sure you want to delete this hatching booking?",
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        const { error } = await supabase
          .from("hatching_bookings")
          .delete()
          .eq("id", id);
        if (error) toast.error("Delete failed");
        else toast.success("Booking deleted");
        fetchBookings(false);
      },
    });
    setConfirmOpen(true);
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
            حجوزات الحضانة{" "}
            <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 text-sm font-black px-4 py-1 rounded-full">
              {filteredBookings.length}
            </span>
          </h1>
          <p className="text-muted-foreground">
            تتبع وإدارة عمليات الحضانة والبيض.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن حجز..."
              className="pr-10 bg-white dark:bg-card border-border/50 rounded-xl h-12 font-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-card border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto px-4 pb-4 -mx-4 sm:px-0 sm:pb-0 sm:mx-0">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-muted/50 border-b border-border/50">
              <tr>
                <th className="h-12 px-4 text-right font-black">الزبون</th>
                <th className="h-12 px-4 text-right font-black">السلالة</th>
                <th className="h-12 px-4 text-right font-black">العدد</th>
                <th className="h-12 px-4 text-right font-black">الفترة</th>
                <th className="h-12 px-4 text-right font-black">السعر</th>
                <th className="h-12 px-4 text-right font-black">الحالة</th>
                <th className="h-12 px-4 text-left font-black">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-border/30 hover:bg-emerald-50/10"
                >
                  <td className="p-4">
                    <div className="font-bold">
                      {booking.customers?.full_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {booking.customers?.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700"
                    >
                      {booking.breeds?.name_ar || "سلالة مخصصة"}
                    </Badge>
                  </td>
                  <td className="p-4 font-bold">{booking.egg_count} بيضة</td>
                  <td className="p-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{" "}
                      {format(new Date(booking.start_date), "dd/MM/yyyy")}
                    </div>
                    <div className="flex items-center gap-1 opacity-60">
                      <Calendar className="w-3 h-3" />{" "}
                      {format(new Date(booking.end_date), "dd/MM/yyyy")}
                    </div>
                  </td>
                  <td className="p-4 font-bold">{booking.total_price} DA</td>
                  <td className="p-4">
                    <Badge
                      className={
                        booking.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-left">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(booking.id, "completed")}
                        className="h-10 w-10 p-0 text-green-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteBooking(booking.id)}
                        className="h-10 w-10 p-0 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

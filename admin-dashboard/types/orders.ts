import type { Database } from "./supabase";

export type Order = Database["public"]["Tables"]["orders"]["Row"];

export type OrderWithRelations = Order & {
  customers?: {
    full_name: string;
    reliability_score: number | null;
    total_orders: number | null;
    notes?: string | null;
    last_order_at?: string | null;
  } | null;
  delivery_zones?: {
    name: string;
    estimated_days: string | null;
  } | null;
  order_items?: Database["public"]["Tables"]["order_items"]["Row"][];
};

export type Customer = Database["public"]["Tables"]["customers"]["Row"];

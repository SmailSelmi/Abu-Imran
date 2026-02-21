export type Category = "eggs" | "chicks" | "chickens" | "machine";

export interface Breed {
  id: string;
  name_en: string;
  name_ar: string;
  slug?: string;
  category: Category;
  subcategory?: string;
  fertility_rate: number; // percentage
  growth_period_days?: number;
  price_eggs?: number;
  price_chick?: number;
  price_adult?: number;
  stock_eggs: number;
  stock_breakdown?: { [key: string]: number }; // e.g. { "1wk": 10, "2wk": 5 }
  next_batch_date?: string; // ISO Date string
  stock_adult: number;
  breeding_hens: number;
  breeding_roosters: number;
  created_at?: string;
}

export interface IncubatorModel {
  id: string;
  name_en: string;
  name_ar: string;
  capacity: number;
  price: number;
  stock: number;
  in_production: number;
  production_days: number;
  raw_materials: { [key: string]: number };
  created_at?: string;
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  wilaya: string;
  commune?: string;
  total_spent: number;
  total_orders: number;
  reliability_score: number;
  notes?: string;
  last_order_at?: string; // Changed from last_order_date to match DB
  created_at?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  wilayas: string[];
  base_fee: number;
  estimated_days: string;
}

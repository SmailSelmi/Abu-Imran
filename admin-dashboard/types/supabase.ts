export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      breeds: {
        Row: {
          color_variation_ar: string | null
          color_variation_en: string | null
          color_variation_fr: string | null
          created_at: string | null
          display_order: number | null
          family_id: string | null
          family_name_ar: string | null
          family_name_en: string | null
          family_name_fr: string | null
          id: string
          name_ar: string
          name_en: string | null
          name_fr: string | null
          product_types: string[] | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          color_variation_ar?: string | null
          color_variation_en?: string | null
          color_variation_fr?: string | null
          created_at?: string | null
          display_order?: number | null
          family_id?: string | null
          family_name_ar?: string | null
          family_name_en?: string | null
          family_name_fr?: string | null
          id?: string
          name_ar: string
          name_en?: string | null
          name_fr?: string | null
          product_types?: string[] | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          color_variation_ar?: string | null
          color_variation_en?: string | null
          color_variation_fr?: string | null
          created_at?: string | null
          display_order?: number | null
          family_id?: string | null
          family_name_ar?: string | null
          family_name_en?: string | null
          family_name_fr?: string | null
          id?: string
          name_ar?: string
          name_en?: string | null
          name_fr?: string | null
          product_types?: string[] | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "breeds_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          commune: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean | null
          last_order_at: string | null
          metadata: Json | null
          notes: string | null
          phone: string | null
          reliability_score: number | null
          tags: string[] | null
          total_orders: number | null
          total_spent: number | null
          wilaya: string | null
        }
        Insert: {
          address?: string | null
          commune?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          last_order_at?: string | null
          metadata?: Json | null
          notes?: string | null
          phone?: string | null
          reliability_score?: number | null
          tags?: string[] | null
          total_orders?: number | null
          total_spent?: number | null
          wilaya?: string | null
        }
        Update: {
          address?: string | null
          commune?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_order_at?: string | null
          metadata?: Json | null
          notes?: string | null
          phone?: string | null
          reliability_score?: number | null
          tags?: string[] | null
          total_orders?: number | null
          total_spent?: number | null
          wilaya?: string | null
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          base_fee: number | null
          created_at: string
          estimated_days: string | null
          id: string
          name: string
          wilayas: string[]
        }
        Insert: {
          base_fee?: number | null
          created_at?: string
          estimated_days?: string | null
          id?: string
          name: string
          wilayas?: string[]
        }
        Update: {
          base_fee?: number | null
          created_at?: string
          estimated_days?: string | null
          id?: string
          name?: string
          wilayas?: string[]
        }
        Relationships: []
      }
      families: {
        Row: {
          created_at: string | null
          description_ar: string | null
          description_en: string | null
          description_fr: string | null
          display_order: number | null
          id: string
          image: string | null
          name_ar: string
          name_en: string | null
          name_fr: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number | null
          id?: string
          image?: string | null
          name_ar: string
          name_en?: string | null
          name_fr?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_ar?: string | null
          description_en?: string | null
          description_fr?: string | null
          display_order?: number | null
          id?: string
          image?: string | null
          name_ar?: string
          name_en?: string | null
          name_fr?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hatching_bookings: {
        Row: {
          created_at: string | null
          customer_id: string | null
          egg_count: number
          end_date: string
          id: string
          incubator_id: string | null
          start_date: string
          status: string | null
          total_price: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          egg_count: number
          end_date: string
          id?: string
          incubator_id?: string | null
          start_date: string
          status?: string | null
          total_price?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          egg_count?: number
          end_date?: string
          id?: string
          incubator_id?: string | null
          start_date?: string
          status?: string | null
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hatching_bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hatching_bookings_incubator_id_fkey"
            columns: ["incubator_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          price_at_purchase: number
          product_id: string | null
          product_name: string
          quantity: number
          variant_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_at_purchase: number
          product_id?: string | null
          product_name: string
          quantity?: number
          variant_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          price_at_purchase?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          category: string | null
          color_variation: string | null
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          delivery_fee: number | null
          delivery_zone_id: string | null
          family_name: string | null
          id: string
          phone_number: string | null
          price: number | null
          product_id: string | null
          product_name: string | null
          product_variant: string | null
          quantity: number | null
          status: string | null
          subtotal: number | null
          total_amount: number | null
          wilaya_address: string | null
        }
        Insert: {
          category?: string | null
          color_variation?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          delivery_fee?: number | null
          delivery_zone_id?: string | null
          family_name?: string | null
          id?: string
          phone_number?: string | null
          price?: number | null
          product_id?: string | null
          product_name?: string | null
          product_variant?: string | null
          quantity?: number | null
          status?: string | null
          subtotal?: number | null
          total_amount?: number | null
          wilaya_address?: string | null
        }
        Update: {
          category?: string | null
          color_variation?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          delivery_fee?: number | null
          delivery_zone_id?: string | null
          family_name?: string | null
          id?: string
          phone_number?: string | null
          price?: number | null
          product_id?: string | null
          product_name?: string | null
          product_variant?: string | null
          quantity?: number | null
          status?: string | null
          subtotal?: number | null
          total_amount?: number | null
          wilaya_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_zone_id_fkey"
            columns: ["delivery_zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          breed_id: string | null
          category: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          family_id: string | null
          features: Json | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string | null
          name_en: string
          next_batch_date: string | null
          price: number | null
          sku: string | null
          slug: string | null
          specifications: Json | null
          stock: number | null
          stock_breakdown: Json | null
          subcategory: string | null
        }
        Insert: {
          breed_id?: string | null
          category?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          family_id?: string | null
          features?: Json | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string | null
          name_en: string
          next_batch_date?: string | null
          price?: number | null
          sku?: string | null
          slug?: string | null
          specifications?: Json | null
          stock?: number | null
          stock_breakdown?: Json | null
          subcategory?: string | null
        }
        Update: {
          breed_id?: string | null
          category?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          family_id?: string | null
          features?: Json | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string | null
          name_en?: string
          next_batch_date?: string | null
          price?: number | null
          sku?: string | null
          slug?: string | null
          specifications?: Json | null
          stock?: number | null
          stock_breakdown?: Json | null
          subcategory?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      place_order: {
        Args: {
          p_address: string
          p_cart_items: Json
          p_category: string
          p_customer_name: string
          p_phone_number: string
          p_product_id?: string
          p_product_name: string
          p_product_variant: string
          p_quantity: number
          p_total_amount: number
          p_wilaya: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

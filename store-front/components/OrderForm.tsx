"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { CATEGORY_DATA, WILAYAS } from "@/lib/constants";
import type { Database } from "@/types/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Truck, ShieldCheck, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Product = Database["public"]["Tables"]["products"]["Row"];

const orderSchema = z.object({
  name: z.string().min(3, "يجب أن يكون الاسم 3 أحرف على الأقل"),
  phone: z.string().regex(/^(05|06|07)[0-9]{8}$/, "رقم هاتف جزائري غير صحيح"),
  wilaya: z.string().min(1, "الولاية مطلوبة"),
  address: z.string().min(5, "العنوان التفصيلي مطلوب"),
  variant: z.string().min(1, "الاختيار مطلوب"),
  quantity: z.number().min(1, "الكمية يجب أن تكون 1 على الأقل"),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  category?: string;
  product?: Product | null;
  quantity?: number;
  defaultVariant?: string;
  onSuccess?: () => void;
  isFullPage?: boolean;
}

export function OrderForm({
  category = "eggs",
  product: initialProduct,
  quantity: externalQuantity,
  defaultVariant,
  onSuccess,
  isFullPage = false,
}: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const activeCategory = initialProduct?.category || category;
  const config = CATEGORY_DATA[activeCategory] || CATEGORY_DATA.eggs;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: externalQuantity || 1,
      variant: "",
      wilaya: "",
    },
  });

  const quantity = watch("quantity");

  useEffect(() => {
    reset({
      quantity: externalQuantity || 1,
      variant: defaultVariant || "",
      wilaya: "",
    });
  }, [reset, externalQuantity, defaultVariant]);

  const onSubmit = async (values: OrderFormData) => {
    setLoading(true);

    // Strictly use Arabic product name
    const productName = initialProduct?.name || config.name_ar;

    const payload: Database["public"]["Functions"]["place_order"]["Args"] = {
      p_customer_name: values.name,
      p_phone_number: values.phone,
      p_wilaya: values.wilaya,
      p_address: values.address,
      p_cart_items: {},
      p_product_name: productName,
      p_product_variant: values.variant,
      p_category: activeCategory,
      p_quantity: values.quantity,
      p_total_amount:
        (initialProduct?.price || config.basePrice) * values.quantity,
      p_product_id: initialProduct?.id || undefined,
    };

    try {
      const { data, error: orderErr } = await supabase.rpc(
        "place_order",
        payload,
      );
      if (orderErr) throw orderErr;

      const rpcData = data as { success: boolean; error?: string };

      if (rpcData && rpcData.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(rpcData?.error || "فشل إرسال الطلب");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-10 text-center space-y-6"
      >
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -start-2 bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg"
          >
            ✓
          </motion.div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tighter">
            تم تأكيد الطلب بنجاح!
          </h2>
          <p className="text-muted-foreground text-base font-medium opacity-70">
            سيتواصل معك فريقنا في أقرب وقت لتأكيد الشحن. شكراً لثقتكم.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex flex-col overflow-hidden",
        isFullPage ? "h-auto" : "h-full md:max-h-[85vh] md:flex-row"
      )}
    >
      {/* Product Preview Side */}
      <div className={cn(
        "bg-emerald-600 text-white p-6 md:p-10 space-y-6 md:space-y-10 relative overflow-hidden shrink-0 flex flex-col shadow-2xl",
        isFullPage ? "w-full lg:w-96 rounded-b-3xl lg:rounded-b-none lg:rounded-s-3xl" : "w-full md:w-80"
      )}>
        <div className="absolute -top-12 -end-12 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform duration-1000" />

        <div className="relative z-10 space-y-6 flex-grow">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20">
            <config.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tighter leading-tight italic">
              {config.name_ar}
            </h3>
          </div>

          <div className="aspect-square relative rounded-xl overflow-hidden border border-white/10 shadow-lg group hidden md:block">
            <Image
              src={config.image}
              alt={config.name_ar}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          <div className="space-y-3 pt-2 hidden md:block">
            <div className="p-3 rounded-lg bg-white/5 flex items-center gap-3">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                توصيل لجميع الولايات
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                جود ومضمونة 100%
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-4 md:pt-6 border-t border-white/10 mt-auto">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60">
              المجموع المقدر
            </p>
            <p className="text-3xl md:text-5xl font-black tracking-tighter text-amber-400 leading-none italic">
              {(config.basePrice * quantity).toLocaleString("ar-DZ")}{" "}
              <span className="text-base font-black not-italic opacity-80">د.ج</span>
            </p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto pb-32 md:pb-10 relative z-20">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            تفاصيل الطلب
          </h2>
          <p className="text-xs font-semibold text-muted-foreground opacity-70 uppercase tracking-widest">
            أدخل بياناتك بدقة لتجنب أي تأخير
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Variant & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                {config.variantLabel}
              </Label>
              <Controller
                name="variant"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="h-16 rounded-xl font-black text-lg bg-white dark:bg-zinc-900 border-2 border-border/50 focus-visible:ring-emerald-500 shadow-sm">
                      <SelectValue placeholder="اختر..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-border dark:bg-zinc-950">
                      {config.variants.map((v: string) => (
                        <SelectItem
                          key={v}
                          value={v}
                          className="font-semibold py-2"
                        >
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                الكمية
              </Label>
              <Input
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                className="h-16 rounded-xl font-black text-2xl border-2 border-emerald-500/20 text-center bg-white dark:bg-zinc-900 text-emerald-600 focus-visible:ring-emerald-500 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-dashed border-border/60">
            {/* Customer Info */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  الاسم الكامل
                </Label>
                <Input
                  {...register("name")}
                  placeholder="الاسم الكامل"
                  className="h-16 rounded-xl font-black text-lg bg-white dark:bg-zinc-900 border-2 border-border/50 focus-visible:ring-emerald-500 shadow-sm px-6"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  رقم الهاتف
                </Label>
                <Input
                  {...register("phone")}
                  placeholder="05 / 06 / 07 ..."
                  className="h-16 rounded-xl font-black text-lg bg-white dark:bg-zinc-900 border-2 border-border/50 focus-visible:ring-emerald-500 tracking-widest shadow-sm px-6 text-center"
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  الولاية
                </Label>
                <Controller
                  name="wilaya"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="h-16 rounded-xl font-black text-lg border-2 border-border/50 bg-white dark:bg-zinc-900 focus:ring-emerald-500 shadow-sm px-6">
                        <SelectValue placeholder="الولاية" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-2 dark:bg-zinc-950 max-h-[280px]">
                        {WILAYAS.map((w) => (
                          <SelectItem
                            key={w.id}
                            value={w.name}
                            className="font-bold"
                          >
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.wilaya && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.wilaya.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  العنوان / المدينة
                </Label>
                <Input
                  {...register("address")}
                  placeholder="العنوان التفصيلي للتوصيل"
                  className="h-16 rounded-xl font-black text-lg bg-white dark:bg-zinc-900 border-2 border-border/50 focus-visible:ring-emerald-500 shadow-sm px-6"
                />
                {errors.address && (
                  <p className="text-xs text-red-500 font-bold">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="h-20 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black text-2xl text-white shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all group"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="w-7 h-7 animate-spin" /> جاري الإرسال...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  تأكيد الطلب 
                  <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

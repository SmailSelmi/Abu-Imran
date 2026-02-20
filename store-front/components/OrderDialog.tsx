"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import AlgeriaMap from "@/components/ui/AlgeriaMap";
import { CATEGORY_DATA, WILAYAS } from "@/lib/constants";
import type { Database } from "@/types/supabase";
import { useI18n } from "@/lib/i18n/I18nContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Truck, ShieldCheck, X } from "lucide-react";
import Image from "next/image";


type Product = Database['public']['Tables']['products']['Row'];


const supabase = createClient();

const orderSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters / يجب أن يكون الاسم 3 أحرف على الأقل"),
  phone: z.string().regex(/^(05|06|07)[0-9]{8}$/, "Invalid Algerian phone number / رقم هاتف جزائري غير صحيح"),
  wilaya: z.string().min(1, "Wilaya is required / الولاية مطلوبة"),
  address: z.string().min(5, "Specific address is required / العنوان التفصيلي مطلوب"),
  variant: z.string().min(1, "Selection is required / الاختيار مطلوب"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

type OrderFormData = z.infer<typeof orderSchema>;

// Constants moved to @/lib/constants.ts


interface OrderDialogProps {
  category?: string;
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  quantity?: number;
}

export function OrderDialog({
  category = "eggs",
  isOpen,
  onClose,
  product: initialProduct,
  quantity: externalQuantity,
}: OrderDialogProps) {
  const { t, locale, isRTL } = useI18n();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Derived category if passed via product
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
      wilaya: "Alger (الجزائر)"
    }
  });

  const quantity = watch("quantity");
  const selectedWilaya = watch("wilaya");
  const selectedWilayaId = WILAYAS.find(w => w.name === selectedWilaya)?.id || "16";

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      reset({
        quantity: externalQuantity || 1,
        variant: "",
        wilaya: "Alger (الجزائر)"
      });
    }
  }, [isOpen, reset, externalQuantity]);

  const onSubmit = async (values: OrderFormData) => {
    setLoading(true);

    const payload: Database['public']['Functions']['place_order']['Args'] = {
      p_customer_name: values.name,
      p_phone_number: values.phone,
      p_wilaya: values.wilaya,
      p_address: values.address,
      p_cart_items: {},
      p_product_name: initialProduct?.[`name_${locale as 'en' | 'ar' | 'fr'}` as keyof Product] as string || initialProduct?.name || config.name,
      p_product_variant: values.variant,
      p_category: activeCategory,
      p_quantity: values.quantity,
      p_total_amount: (initialProduct?.price || config.basePrice) * values.quantity,
      p_product_id: initialProduct?.id || undefined,
    };

    try {
      const { data, error: orderErr } = await supabase.rpc(
        "place_order",
        payload,
      );
      if (orderErr) throw orderErr;

      const rpcData = data as { success: boolean, error?: string };

      if (rpcData && rpcData.success) {
        setSuccess(true);
      } else {
        throw new Error(rpcData?.error || "Failed to place order");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Error placing order");
    } finally {
      setLoading(false);
    }
  };




  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-2xl bg-background shadow-2xl">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-amber-400 text-black text-[10px] font-black px-2 py-1 rounded-full shadow-lg"
                >SUCCESS</motion.div>
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black tracking-tighter italic">تم تأكيد الطلب بنجاح!</h2>
                <p className="text-muted-foreground text-lg font-medium opacity-60">
                  سيتواصل معك فريقنا في أقرب وقت لتأكيد الشحن. شكراً لثقتكم.
                </p>
              </div>
              <Button
                className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-lg"
                onClick={onClose}
              >
                Close / إغلاق
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex flex-col md:flex-row max-h-[90vh] overflow-y-auto"
            >
              {/* Left Side: Product Preview */}
              <div className="md:w-80 bg-emerald-950 text-white p-8 space-y-8 relative overflow-hidden shrink-0 flex flex-col">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 
                 <div className="relative z-10 space-y-8 flex-grow">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 flex items-center justify-center backdrop-blur-md">
                        <config.icon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black tracking-tight leading-tight mb-2">{config.name_ar}</h3>
                        <p className="text-sm font-bold text-emerald-400 uppercase tracking-[0.3em] opacity-60">{config.name}</p>
                    </div>
                    
                    <div className="aspect-square relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl group">
                        <Image src={config.image} alt={config.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                            <Truck className="w-5 h-5 text-emerald-400" />
                            <p className="text-xs font-bold leading-tight uppercase tracking-widest opacity-80">{t.common.deliveryZones}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <p className="text-xs font-bold leading-tight uppercase tracking-widest opacity-80">Quality & Success Assured</p>
                        </div>
                    </div>
                 </div>

                 <div className="relative z-10 pt-8 border-t border-white/10 mt-auto">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 opacity-60">Estimated Total</p>
                        <p className="text-5xl font-black italic tracking-tighter text-amber-400 leading-none">
                            {(config.basePrice * quantity).toLocaleString()} <span className="text-base font-bold italic opacity-80">DA</span>
                        </p>
                    </div>
                 </div>
              </div>

              {/* Right Side: Form */}
              <div className="flex-1 p-8 md:p-10 space-y-8 overflow-y-auto">
                <div className="flex justify-between items-start">
                   <div className="space-y-1">
                      <h2 className="text-3xl font-black tracking-tighter italic leading-none">Order Details</h2>
                      <p className="text-xs font-bold text-muted-foreground opacity-60 uppercase tracking-widest">Fill accurately to avoid delays</p>
                   </div>
                   <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors shrink-0">
                      <X className="w-6 h-6 text-muted-foreground" />
                   </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Variant & Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2 text-start" dir="rtl">
                       <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-2 block">{config.variantLabel}</Label>
                       <Controller
                          name="variant"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                               <SelectTrigger className="h-14 rounded-xl font-bold text-lg border-2">
                                  <SelectValue placeholder="Select / اختر" />
                               </SelectTrigger>
                               <SelectContent className="rounded-xl border-2">
                                  {config.variants.map((v: string) => (
                                    <SelectItem key={v} value={v} className="font-bold py-3">{v}</SelectItem>
                                  ))}
                               </SelectContent>
                            </Select>
                          )}
                       />
                       {errors.variant && <p className="text-xs text-red-500 font-bold mt-1 text-end">{errors.variant.message}</p>}
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground mb-2 block">Quantity / الكمية</Label>
                       <Input 
                          type="number" 
                          {...register("quantity", { valueAsNumber: true })} 
                          className="h-14 rounded-xl font-black text-2xl border-2 text-center bg-emerald-50/30" 
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-dashed border-border/60">
                      {/* Customer Info */}
                      <div className="space-y-6">
                          <div className="space-y-2">
                             <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Full Name / الاسم الكامل</Label>
                             <Input {...register("name")} placeholder="Ahmed Ben..." className="h-12 rounded-xl font-bold bg-muted/20 border-border/50" />
                             {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Phone / الهاتف</Label>
                             <Input {...register("phone")} placeholder="05 / 06 / 07 ..." className="h-12 rounded-xl font-bold bg-muted/20 border-border/50" />
                             {errors.phone && <p className="text-xs text-red-500 font-bold">{errors.phone.message}</p>}
                          </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2 text-start" dir="rtl">
                            <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Wilaya / الولاية</Label>
                            <Controller
                               name="wilaya"
                               control={control}
                               render={({ field }) => (
                                 <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-12 rounded-xl font-bold border-border/50 bg-muted/20">
                                       <SelectValue placeholder="Alger (الجزائر)" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-2 max-h-[300px]">
                                       {WILAYAS.map((w) => (
                                         <SelectItem key={w.id} value={w.name} className="font-bold">{w.name}</SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                               )}
                            />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">Address / العنوان</Label>
                            <Input {...register("address")} placeholder="Ex: Belfort, El Harrach" className="h-12 rounded-xl font-bold bg-muted/20 border-border/50" />
                            {errors.address && <p className="text-xs text-red-500 font-bold">{errors.address.message}</p>}
                         </div>
                      </div>
                  </div>

                    <div className="flex justify-end mt-6">
                      <Button
                          type="submit"
                          disabled={loading}
                          className="h-16 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black text-lg text-white shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1 transition-all group shrink-0"
                      >
                          {loading ? "Processing..." : (
                              <span className="flex items-center gap-3">
                                  <CheckCircle className="w-6 h-6" /> Confirm Order / تأكيد الطلب
                              </span>
                          )}
                      </Button>
                    </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

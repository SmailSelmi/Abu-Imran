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
import { CATEGORY_DATA, WILAYAS } from "@/lib/constants";
import type { Database } from "@/types/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Truck, ShieldCheck, X } from "lucide-react";
import Image from "next/image";


type Product = Database['public']['Tables']['products']['Row'];

const orderSchema = z.object({
  name: z.string().min(3, "يجب أن يكون الاسم 3 أحرف على الأقل"),
  phone: z.string().regex(/^(05|06|07)[0-9]{8}$/, "رقم هاتف جزائري غير صحيح"),
  wilaya: z.string().min(1, "الولاية مطلوبة"),
  address: z.string().min(5, "العنوان التفصيلي مطلوب"),
  variant: z.string().min(1, "الاختيار مطلوب"),
  quantity: z.number().min(1, "الكمية يجب أن تكون 1 على الأقل"),
});

type OrderFormData = z.infer<typeof orderSchema>;


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
      wilaya: ""
    }
  });

  const quantity = watch("quantity");

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      reset({
        quantity: externalQuantity || 1,
        variant: "",
        wilaya: ""
      });
    }
  }, [isOpen, reset, externalQuantity]);

  const onSubmit = async (values: OrderFormData) => {
    setLoading(true);

    // Strictly use Arabic product name
    const productName = initialProduct?.name || config.name_ar;

    const payload: Database['public']['Functions']['place_order']['Args'] = {
      p_customer_name: values.name,
      p_phone_number: values.phone,
      p_wilaya: values.wilaya,
      p_address: values.address,
      p_cart_items: {},
      p_product_name: productName,
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
        throw new Error(rpcData?.error || "فشل إرسال الطلب");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-2xl bg-background shadow-2xl">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-2 -start-2 bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg"
                >✓</motion.div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tighter">تم تأكيد الطلب بنجاح!</h2>
                <p className="text-muted-foreground text-base font-medium opacity-70">
                  سيتواصل معك فريقنا في أقرب وقت لتأكيد الشحن. شكراً لثقتكم.
                </p>
              </div>
              <Button
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold"
                onClick={onClose}
              >
                إغلاق
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex flex-col max-h-[90vh] md:max-h-[85vh] md:flex-row overflow-hidden"
            >
              {/* Right Side: Product Preview */}
              <div className="md:w-72 bg-emerald-950 text-white p-6 space-y-6 relative overflow-hidden shrink-0 flex flex-col">
                 <div className="absolute top-0 end-0 w-28 h-28 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                 <div className="relative z-10 space-y-5 flex-grow">
                    <div className="w-12 h-12 rounded-xl bg-emerald-400/20 flex items-center justify-center backdrop-blur-md">
                        <config.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tight leading-tight mb-1">{config.name_ar}</h3>
                    </div>

                    <div className="aspect-square relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl group">
                        <Image src={config.image} alt={config.name_ar} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
                    </div>

                    <div className="space-y-3 pt-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <p className="text-xs font-bold leading-tight uppercase tracking-widest opacity-80">توصيل لجميع الولايات</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <p className="text-xs font-bold leading-tight uppercase tracking-widest opacity-80">جودة مضمونة 100%</p>
                        </div>
                    </div>
                 </div>

                 <div className="relative z-10 pt-5 border-t border-white/10 mt-auto">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 opacity-60">المجموع المقدر</p>
                        <p className="text-4xl font-black tracking-tighter text-amber-400 leading-none">
                            {(config.basePrice * quantity).toLocaleString('ar-DZ')} <span className="text-sm font-bold opacity-80">د.ج</span>
                        </p>
                    </div>
                 </div>
              </div>

              {/* Left Side: Form */}
              <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto pb-12 md:pb-8">
                <div className="flex justify-between items-start">
                   <div className="space-y-0.5">
                      <h2 className="text-2xl font-black tracking-tighter leading-none">تفاصيل الطلب</h2>
                      <p className="text-xs font-bold text-muted-foreground opacity-60 uppercase tracking-widest">أدخل بياناتك بدقة لتجنب أي تأخير</p>
                   </div>
                   <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-xl transition-colors shrink-0">
                      <X className="w-5 h-5 text-muted-foreground" />
                   </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Variant & Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                       <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">{config.variantLabel}</Label>
                       <Controller
                          name="variant"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                               <SelectTrigger className="h-11 rounded-xl font-bold border-2">
                                  <SelectValue placeholder="اختر..." />
                               </SelectTrigger>
                               <SelectContent className="rounded-xl border-2">
                                  {config.variants.map((v: string) => (
                                    <SelectItem key={v} value={v} className="font-bold py-2">{v}</SelectItem>
                                  ))}
                               </SelectContent>
                            </Select>
                          )}
                       />
                       {errors.variant && <p className="text-xs text-red-500 font-bold mt-1">{errors.variant.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                       <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block">الكمية</Label>
                       <Input
                          type="number"
                          {...register("quantity", { valueAsNumber: true })}
                          className="h-11 rounded-xl font-black text-xl border-2 text-center bg-emerald-50/30"
                       />
                       {errors.quantity && <p className="text-xs text-red-500 font-bold mt-1">{errors.quantity.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-dashed border-border/60">
                      {/* Customer Info */}
                      <div className="space-y-4">
                          <div className="space-y-1.5">
                             <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">الاسم الكامل</Label>
                             <Input {...register("name")} placeholder="أحمد بن..." className="h-11 rounded-xl font-bold bg-muted/20 border-border/50" />
                             {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
                          </div>
                          <div className="space-y-1.5">
                             <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">رقم الهاتف</Label>
                             <Input {...register("phone")} placeholder="05 / 06 / 07 ..." className="h-11 rounded-xl font-bold bg-muted/20 border-border/50" dir="ltr" />
                             {errors.phone && <p className="text-xs text-red-500 font-bold">{errors.phone.message}</p>}
                          </div>
                      </div>

                      <div className="space-y-4">
                         <div className="space-y-1.5">
                            <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">الولاية</Label>
                            <Controller
                               name="wilaya"
                               control={control}
                               render={({ field }) => (
                                 <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="h-11 rounded-xl font-bold border-border/50 bg-muted/20">
                                       <SelectValue placeholder="الجزائر" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-2 max-h-[280px]">
                                       {WILAYAS.map((w) => (
                                         <SelectItem key={w.id} value={w.name} className="font-bold">{w.name}</SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                               )}
                            />
                            {errors.wilaya && <p className="text-xs text-red-500 font-bold">{errors.wilaya.message}</p>}
                         </div>
                         <div className="space-y-1.5">
                            <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">العنوان / المدينة</Label>
                            <Input {...register("address")} placeholder="مثال: بلفور، الحراش" className="h-11 rounded-xl font-bold bg-muted/20 border-border/50" />
                            {errors.address && <p className="text-xs text-red-500 font-bold">{errors.address.message}</p>}
                         </div>
                      </div>
                  </div>


                    <div className="flex justify-end mt-4">
                      <Button
                          type="submit"
                          disabled={loading}
                          className="h-12 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all group"
                      >
                          {loading ? "جاري الإرسال..." : (
                              <span className="flex items-center gap-2">
                                  <CheckCircle className="w-5 h-5" /> تأكيد الطلب
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

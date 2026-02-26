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
import {
  CheckCircle,
  Truck,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  X,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Home,
  Plus,
  Minus,
  ChevronRight,
  ChevronLeft,
  Egg,
  ChevronDown,
  TrendingDown,
  Clock,
  Package,
  ArrowRight,
  Bird,
} from "lucide-react";
import Image from "next/image";
import LogoLoader from "./ui/logo-loader";
import { cn } from "@/lib/utils";
import { sendTelegramNotification } from "@/app/actions/telegram";

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
  const [showStatusSheet, setShowStatusSheet] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<"success" | "error">("success");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);

  // Handle browser back button (phone back button)
  useEffect(() => {
    if (currentStep === 2) {
      // When entering step 2, push a state
      window.history.pushState({ step: 2 }, "");
    }

    const handlePopState = (event: PopStateEvent) => {
      if (currentStep === 2) {
        // Prevent default browser back behavior and go to Step 1
        setDirection(-1);
        setCurrentStep(1);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [currentStep]);
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
    trigger,
    setValue,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: externalQuantity || 1,
      variant: defaultVariant || "",
      wilaya: "",
    },
  });

  const quantity = watch("quantity");

  useEffect(() => {
    if (defaultVariant || externalQuantity) {
      setValue("variant", defaultVariant || "");
      setValue("quantity", externalQuantity || 1);
    }
  }, [setValue, externalQuantity, defaultVariant]);

  const handleNext = async () => {
    const isValid = await trigger(["variant", "quantity"]);
    if (isValid) {
      setDirection(1);
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep(1);
  };

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
        setSheetStatus("success");
        setShowStatusSheet(true);
        if (onSuccess) onSuccess();

        // Send Telegram Notification asynchronously
        const telegramMessage = `
📦 *طلب جديد من المتجر!*
👤 *الزبون:* ${values.name}
📱 *الهاتف:* ${values.phone}
📍 *الولاية:* ${values.wilaya}
🏠 *العنوان:* ${values.address}
🐣 *المنتج:* ${productName}
✨ *النوع:* ${values.variant}
🔢 *الكمية:* ${values.quantity}
💰 *المجموع:* ${(initialProduct?.price || config.basePrice) * values.quantity} د.ج
        `.trim();
        
        sendTelegramNotification(telegramMessage).catch(console.error);
      } else {
        throw new Error(rpcData?.error || "فشل إرسال الطلب");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setSheetStatus("error");
      setErrorMessage(error.message || "حدث خطأ أثناء إرسال الطلب");
      setShowStatusSheet(true);
    } finally {
      setLoading(false);
    }
  };

  const StatusBottomSheet = () => (
    <AnimatePresence>
      {showStatusSheet && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStatusSheet(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 inset-x-0 z-[101] p-6 pt-10 rounded-t-[2.5rem] bg-white dark:bg-zinc-950 border-t border-emerald-500/20 shadow-[-20px_0_40px_rgba(0,0,0,0.3)]"
            dir="rtl"
          >
            {/* Handle Bar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            
            <div className="max-w-md mx-auto space-y-8 pb-10">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center relative",
                  sheetStatus === "success" 
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.2)]" 
                    : "bg-red-100 dark:bg-red-900/40 text-red-600 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                )}>
                  {sheetStatus === "success" ? (
                    <CheckCircle className="w-12 h-12" />
                  ) : (
                    <AlertCircle className="w-12 h-12" />
                  )}
                  
                  {/* Decorative orbital ring */}
                  <div className={cn(
                    "absolute inset-0 rounded-full border border-dashed animate-spin-slow",
                    sheetStatus === "success" ? "border-emerald-500/30" : "border-red-500/30"
                  )} />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-tighter">
                    {sheetStatus === "success" ? "تم تأكيد طلبك!" : "حدث خطأ ما"}
                  </h2>
                  
                  {sheetStatus === "success" && (
                    <div className="bg-zinc-50 dark:bg-white/5 border border-emerald-500/10 rounded-2xl p-5 w-full max-w-sm mx-auto shadow-inner text-start space-y-3">
                      <div className="flex items-center gap-4 pb-3 border-b border-emerald-500/10">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <config.icon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 leading-none mb-1">المنتج المُختار:</p>
                          <p className="font-black text-lg truncate leading-none">{config.name_ar}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-muted-foreground">الكمية:</span>
                        <span className="font-black text-lg">{quantity}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-emerald-500/10">
                        <span className="font-black text-emerald-600">المجموع النهائي:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-black text-xl italic text-amber-500">{(config.basePrice * quantity).toLocaleString("ar-DZ")}</span>
                          <span className="text-[10px] font-black">د.ج</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-muted-foreground font-medium">
                    {sheetStatus === "success" 
                      ? "شكراً لثقتكم. سيتواصل معكم فريقنا قريباً لتأكيد تفاصيل الشحن والولاية."
                      : errorMessage || "لم نتمكن من إرسال طلبك حالياً. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة."}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {sheetStatus === "success" ? (
                   <Button
                   onClick={() => {
                     setShowStatusSheet(false);
                     setSuccess(false);
                     reset();
                   }}
                   className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl shadow-xl shadow-emerald-600/20"
                 >
                   حسناً، فهمت
                 </Button>
                ) : (
                  <Button
                  onClick={() => setShowStatusSheet(false)}
                  className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xl shadow-xl shadow-red-600/20"
                >
                  إغلاق والمحاولة ثانية
                </Button>
                )}
                
                <p className="text-[10px] uppercase font-black tracking-widest text-center text-muted-foreground opacity-50">
                  أبو عمران - الريادة في تربية السلالات
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Remove the old success early return and use StatusBottomSheet at the end of the main return

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex flex-col overflow-hidden",
        isFullPage ? "min-h-[70vh] md:h-auto" : "h-full md:max-h-[85vh] md:flex-row"
      )}
    >
      {/* Product Preview Side */}
      <motion.div
        layoutId={isFullPage ? undefined : "order-form-side"}
        className={cn(
          "bg-emerald-600 text-white p-4 md:p-10 relative overflow-hidden shrink-0 flex flex-col md:flex-col shadow-2xl w-full lg:w-96 transition-all duration-300",
          isFullPage ? "rounded-b-xl md:rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-s-[2.5rem]" : "rounded-t-xl md:rounded-t-none md:rounded-s-[2.5rem]",
          currentStep === 2 && "hidden md:flex"
        )}
      >
        <div className="absolute -top-12 -end-12 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 overflow-hidden pointer-events-none" />
        
        {/* Mobile: Horizontal Layout | Desktop: Vertical Stack */}
        <div className="relative z-10 flex md:flex-col items-center md:items-start justify-between md:justify-start w-full gap-4 md:space-y-6 md:flex-grow px-2 md:px-0">
          <div className="flex items-center gap-3 md:flex-col md:items-start md:space-y-6 flex-1">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 overflow-hidden shrink-0">
              <config.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white md:hidden">أنت تطلب الآن:</p>
              <h3 className="text-base md:text-2xl font-black tracking-tighter leading-tight italic">
                {config.name_ar}
              </h3>
            </div>
          </div>

          <div className="aspect-square relative rounded-xl overflow-hidden border border-white/10 shadow-lg group hidden md:block w-full">
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
                جودة مضمونة 100%
              </p>
            </div>
          </div>

          {/* Price on mobile moves to the end of the flex row */}
          <div className="text-end md:text-start md:pt-6 md:border-t md:border-white/10 md:mt-auto">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white leading-none mb-1">
              المجموع
            </p>
            <div className="text-xl md:text-4xl font-black tracking-tighter text-amber-400 leading-none italic flex items-baseline justify-end md:justify-start gap-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={quantity}
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="inline-block"
                >
                  {(config.basePrice * quantity).toLocaleString("ar-DZ")}
                </motion.span>
              </AnimatePresence>
              <span className="text-[10px] md:text-base font-black not-italic opacity-80">د.ج</span>
            </div>
          </div>
        </div>

      </motion.div>

      {/* Form Side */}
      <div className="flex-1 p-4 md:p-10 space-y-5 md:space-y-8 overflow-y-auto pb-32 md:pb-10 relative z-20 font-tajawal mt-2 md:mt-0">
        {/* Step Progress Bar */}
        <div className="relative mb-6">
          <div className="flex justify-around items-center relative z-10 px-4 md:px-20">
            {[
              { id: 1, label: "1. الطلب" },
              { id: 2, label: "2. التوصيل" },
            ].map((s) => (
              <div
                key={s.id}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all duration-500",
                  currentStep >= s.id ? "opacity-100" : "opacity-40"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-black text-sm md:text-lg border-2 transition-all duration-500",
                    currentStep === s.id
                      ? "bg-emerald-600 border-emerald-600 text-white scale-110 shadow-lg shadow-emerald-600/20"
                      : currentStep > s.id
                      ? "bg-emerald-100 border-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:border-emerald-900/10"
                      : "bg-zinc-100 border-zinc-200 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800"
                  )}
                >
                  {currentStep > s.id ? <CheckCircle className="w-6 h-6" /> : s.id}
                </div>
                <span
                  className={cn(
                    "text-[10px] md:text-sm font-black uppercase tracking-widest",
                    currentStep === s.id ? "text-emerald-600" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          {/* Progress Line - Spans the width between points */}
          <div className="absolute top-[20px] md:top-[24px] inset-x-20 md:inset-x-32 h-0.5 bg-zinc-100 dark:bg-zinc-800 -z-0">
            <motion.div
              className="h-full bg-emerald-600"
              initial={{ width: "0%" }}
              animate={{ width: currentStep === 1 ? "0%" : "100%" }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="space-y-0.5 pb-2">
          <h2 className="text-lg md:text-2xl font-bold tracking-tight text-foreground font-tajawal">
            {currentStep === 1 ? "تفاصيل الطلب" : "معلومات التوصيل"}
          </h2>
          <p className="text-[9px] md:text-xs font-semibold text-muted-foreground opacity-70 uppercase tracking-widest font-tajawal">
            {currentStep === 1 ? "اختر النوع والكمية المناسبة" : "أدخل بياناتك بدقة لتجنب أي تأخير"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            {currentStep === 1 ? (
              <motion.div
                key="step1"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground font-tajawal">
                      {config.variantLabel}
                    </Label>
                    <Controller
                      name="variant"
                      control={control}
                      render={({ field }) => (
                        <div className="relative group">
                          <select
                            {...field}
                            className="w-full h-16 bg-white dark:bg-zinc-900 border-2 border-border/50 rounded-xl ps-12 pe-10 font-black text-lg appearance-none focus:border-emerald-500 focus:ring-0 shadow-sm transition-all"
                          >
                            <option value="" disabled>اختر النوع...</option>
                            {config.variants.map((v: string) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                          <Bird className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                          <ChevronDown className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                        </div>
                      )}
                    />
                    {errors.variant && (
                      <p className="text-xs text-red-500 font-bold font-tajawal">{errors.variant.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground font-tajawal">
                      الكمية المطلوبة
                    </Label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setValue("quantity", Math.max(1, quantity - 1))}
                        className="w-16 h-16 rounded-xl border-2 border-border/50 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-tajawal"
                      >
                        <Minus className="w-6 h-6 text-emerald-600" strokeWidth={3} />
                      </Button>
                      
                      <div className="flex-1 relative group">
                        <Input
                          type="number"
                          {...register("quantity", { valueAsNumber: true })}
                          className="h-16 rounded-xl font-black text-3xl border-2 border-emerald-500/20 text-center bg-zinc-50 dark:bg-zinc-900/50 text-emerald-600 focus-visible:ring-emerald-500 shadow-inner font-tajawal"
                          readOnly
                        />
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setValue("quantity", quantity + 1)}
                        className="w-16 h-16 rounded-xl border-2 border-border/50 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-tajawal"
                      >
                        <Plus className="w-6 h-6 text-emerald-600" strokeWidth={3} />
                      </Button>
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center opacity-60 font-tajawal pt-1">
                      الحد الأدنى للطلب هو 1 {activeCategory === "eggs" ? "بيضة" : "كتكوت"}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-20 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-xl text-white shadow-xl shadow-emerald-500/20 group transition-all font-tajawal"
                  >
                    <span>المتابعة للمعلومات</span>
                    <ArrowLeft className="w-7 h-7 ms-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground font-tajawal py-0.5">
                        الاسم الكامل
                      </Label>
                      <div className="relative group">
                        <Input
                          {...register("name")}
                          placeholder="الاسم الكامل"
                          className="h-16 rounded-xl font-black text-lg bg-white dark:bg-zinc-900 border-2 border-border/50 focus-visible:ring-emerald-500 shadow-sm ps-12 transition-all group-focus-within:border-emerald-500/50 font-tajawal"
                        />
                        <User className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-red-500 font-bold font-tajawal">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground font-tajawal py-0.5">
                        رقم الهاتف
                      </Label>
                      <div className="relative group">
                        <Input
                          {...register("phone")}
                          placeholder="05 / 06 / 07 ..."
                          className="h-16 rounded-xl font-black text-lg bg-white dark:bg-zinc-900 border-2 border-border/50 focus-visible:ring-emerald-500 tracking-widest shadow-sm ps-12 transition-all group-focus-within:border-emerald-500/50 font-tajawal"
                          dir="ltr"
                        />
                        <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-500 font-bold font-tajawal">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground font-tajawal py-0.5">
                        الولاية
                      </Label>
                      <Controller
                      name="wilaya"
                      control={control}
                      render={({ field }) => (
                        <div className="relative group">
                          <select
                            {...field}
                            className="w-full h-16 bg-white dark:bg-zinc-900 border-2 border-border/50 rounded-xl ps-12 pe-10 font-black text-lg appearance-none focus:border-emerald-500 focus:ring-0 shadow-sm transition-all"
                          >
                            <option value="" disabled>اختر الولاية...</option>
                            {WILAYAS.map((w) => (
                              <option key={w.id} value={w.name}>
                                {w.name}
                              </option>
                            ))}
                          </select>
                          <MapPin className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                          <ChevronDown className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                        </div>
                      )}
                    />
                      {errors.wilaya && (
                        <p className="text-xs text-red-500 font-bold font-tajawal">{errors.wilaya.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground font-tajawal py-0.5">
                        العنوان / المدينة
                      </Label>
                      <div className="relative group">
                        <Input
                          {...register("address")}
                          placeholder="العنوان التفصيلي للتوصيل"
                          className="h-16 rounded-xl font-black text-lg bg-white dark:bg-zinc-900 border-2 border-border/50 focus-visible:ring-emerald-500 shadow-sm ps-12 transition-all group-focus-within:border-emerald-500/50 font-tajawal"
                        />
                        <Home className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      {errors.address && (
                        <p className="text-xs text-red-500 font-bold font-tajawal">{errors.address.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-20 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-xl text-white shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all group font-tajawal"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <LogoLoader size="sm" /> جاري الإرسال...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        تأكيد الطلب النهائي
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
      <StatusBottomSheet />
    </motion.div>
  );
}

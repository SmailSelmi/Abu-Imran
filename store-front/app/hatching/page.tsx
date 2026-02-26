"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Egg,
  Users,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle,
  Check,
  ShieldCheck,
  Thermometer,
  Activity,
  Clock,
  User,
  Phone as PhoneIcon,
  MapPin,
  Home,
  AlertCircle,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import ChickCelebration from "@/components/ui/chick-celebration";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import LogoLoader from "@/components/ui/logo-loader";
import { Database } from "@/types/supabase";
import { WILAYAS } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { sendTelegramNotification } from "@/app/actions/telegram";

function HatchingPageContent() {
  const { t, isRTL } = useI18n();
  const supabase = createClient();
  const [breeds, setBreeds] = useState<
    Database["public"]["Tables"]["breeds"]["Row"][]
  >([]);
  const [config, setConfig] = useState({
    max_capacity: 500,
    price_per_egg: 50,
    duration_days: 21,
  });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
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

  const searchParams = useSearchParams();

  const [selectedBreed, setSelectedBreed] = useState<string>(
    searchParams.get("breed") || "",
  );
  const [eggCount, setEggCount] = useState<number>(
    Number(searchParams.get("count")) || 10,
  );
  const [startDate, setStartDate] = useState<string>(
    searchParams.get("date") || new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [breedRes, configRes] = await Promise.all([
          supabase
            .from("breeds")
            .select("id, name_en, name_ar")
            .order("name_ar"),
          supabase
            .from("app_settings")
            .select("value")
            .eq("key", "hatching_config")
            .single(),
        ]);

        if (breedRes.data) setBreeds(breedRes.data as any[]);
        if (configRes.data) setConfig(configRes.data.value as any);
      } catch (err) {
        console.error("Error loading hatching data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalPrice = eggCount * config.price_per_egg;
  const endDate = new Date(
    new Date(startDate).getTime() + config.duration_days * 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .split("T")[0];

  async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBookingLoading(true);

    const formData = new FormData(e.currentTarget);
    const customerPhone = formData.get("phone") as string;

    const supabase = createClient();
    try {
      const customerName = formData.get("name") as string;
      const wilayaName = formData.get("wilaya") as string;
      const breedName = selectedBreed
        ? breeds.find((b) => b.id === selectedBreed)?.name_ar ||
          breeds.find((b) => b.id === selectedBreed)?.name_en ||
          "غير محدد"
        : "غير محدد";

      const bookingPayload = {
        p_customer_name: customerName,
        p_phone_number: customerPhone,
        p_wilaya: wilayaName,
        p_address: formData.get("address") as string,
        p_breed_id: selectedBreed || null,
        p_egg_count: eggCount,
        p_start_date: startDate,
        p_end_date: endDate,
        p_total_price: totalPrice,
        p_notes: `السلالة: ${breedName}`,
      };

      // @ts-ignore - Bypass stale types for new RPC
      const { data: rpcData, error: rpcErr } = await (supabase as any).rpc(
        "place_hatching_booking",
        bookingPayload,
      );

      if (rpcErr) throw rpcErr;

        if (rpcData && rpcData.success) {
        setSuccess(true);
        setSheetStatus("success");
        setShowStatusSheet(true);
        toast.success("تم تسجيل حجزك بنجاح!");

        // Trigger Telegram Notification asynchronously
        const telegramMessage = `
🐣 *حجز تفقيس جديد!*
👤 *الزبون:* ${customerName}
📱 *الهاتف:* ${customerPhone}
📍 *الولاية:* ${wilayaName}
🏠 *العنوان:* ${formData.get("address") as string}
🥚 *عدد البيض:* ${eggCount}
✨ *السلالة:* ${breedName}
💰 *التكلفة:* ${totalPrice.toLocaleString("ar-DZ")} د.ج
        `.trim();

        sendTelegramNotification(telegramMessage).catch(console.error);
      } else {
        throw new Error(rpcData?.error || "Booking failed");
      }
    } catch (err: any) {
      setSheetStatus("error");
      setErrorMessage(err.message || "فشل الحجز");
      setShowStatusSheet(true);
    } finally {
      setBookingLoading(false);
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && !selectedBreed) {
      toast.error("يرجى اختيار السلالة للمتابعة");
      return;
    }
    setDirection(1);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep(1);
  };

  const StatusBottomSheet = () => (
    <AnimatePresence>
      {showStatusSheet && (
        <>
          <ChickCelebration isVisible={sheetStatus === "success"} />
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
                    {sheetStatus === "success" ? "تم تأكيد طلب الحجز!" : "حدث خطأ ما"}
                  </h2>

                  {sheetStatus === "success" && (
                    <div className="bg-zinc-50 dark:bg-white/5 border border-emerald-500/10 rounded-2xl p-5 w-full max-w-sm mx-auto shadow-inner text-start space-y-3">
                      <div className="flex items-center gap-4 pb-3 border-b border-emerald-500/10">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Egg className="w-6 h-6 text-emerald-600" />
                        </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 leading-none mb-1">الخدمة المختارة:</p>
                            <p className="font-black text-lg truncate leading-none">
                              تفقيس: {selectedBreed === "mixed" ? "سلالات مختلطة" : (breeds.find(b => b.id === selectedBreed)?.name_ar || "غير محدد")}
                            </p>
                          </div>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-muted-foreground">عدد البيض:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-black text-lg text-emerald-600">{eggCount}</span>
                          <span className="text-[10px] font-black uppercase">بيضة</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-emerald-500/10">
                        <span className="font-black text-emerald-600">التكلفة المقدرة:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-black text-xl italic text-amber-500">{((selectedBreed === "mixed" ? 100 : 150) * Math.floor(eggCount)).toLocaleString("ar-DZ")}</span>
                          <span className="text-[10px] font-black">د.ج</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-muted-foreground font-medium">
                    {sheetStatus === "success" 
                      ? `سيتواصل معكم فريقنا قريباً لتأكيد موعد إحضار الـ ${eggCount} بيضة للمزرعة.`
                      : errorMessage || "لم نتمكن من تسجيل حجزك حالياً. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة."}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {sheetStatus === "success" ? (
                   <Button
                   onClick={() => {
                     setShowStatusSheet(false);
                     setSuccess(false);
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

  // We keep the main return and just add <StatusBottomSheet /> at the end

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-hidden">
      <div className="flex-grow pt-40 md:pt-48 pb-4 md:pb-10 px-4 md:px-6 lg:px-8 w-full flex flex-col justify-start md:justify-center overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative flex flex-col overflow-hidden bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 border border-emerald-500/10",
              "min-h-[70vh] md:h-auto md:flex-row"
            )}
          >
            {/* Product Preview Side (Compact on Mobile) */}
            <motion.div
              className={cn(
                "bg-emerald-600 text-white p-4 md:p-10 relative overflow-hidden shrink-0 flex flex-col md:flex-col shadow-2xl w-full lg:w-96 transition-all duration-300",
                "rounded-b-xl md:rounded-b-none md:rounded-s-[2.5rem]",
                currentStep === 2 && "hidden md:flex"
              )}
            >
              <div className="absolute -top-12 -end-12 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 overflow-hidden pointer-events-none" />
              
              <div className="relative z-10 flex md:flex-col items-center md:items-start justify-between md:justify-start w-full gap-4 md:space-y-6 md:flex-grow px-2 md:px-0">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:space-y-6 flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 overflow-hidden shrink-0">
                    <Egg className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white md:hidden">خدمة الحجز:</p>
                    <h3 className="text-base md:text-2xl font-black tracking-tighter leading-tight italic">
                      {t.hatching.title}
                    </h3>
                  </div>
                </div>

                <div className="aspect-square relative rounded-xl overflow-hidden border border-white/10 shadow-lg group hidden md:block w-full">
                  <div className="absolute inset-0 bg-emerald-700/50 flex items-center justify-center">
                     <Icon
                      src="https://cdn.lordicon.com/lpddubrl.json"
                      size={150}
                      trigger="loop"
                      colors={{ primary: "#ffffff", secondary: "#ffffff" }}
                    />
                  </div>
                </div>

                <div className="text-end md:text-start md:pt-6 md:border-t md:border-white/10 md:mt-auto">
                  <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white leading-none mb-1">
                    {t.hatching.estimatedCost}
                  </p>
                  <div className="text-xl md:text-4xl font-black tracking-tighter text-amber-400 leading-none italic flex items-baseline justify-end md:justify-start gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={totalPrice}
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -5 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="inline-block"
                      >
                        {totalPrice.toLocaleString("ar-DZ")}
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
                    { id: 1, label: "1. الحجز" },
                    { id: 2, label: "2. المعلومات" },
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
                      <span className="text-[10px] md:text-sm font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-[20px] md:top-[24px] inset-x-20 md:inset-x-32 h-0.5 bg-zinc-100 dark:bg-zinc-800 -z-0">
                  <motion.div
                    className="h-full bg-emerald-600"
                    initial={{ width: "0%" }}
                    animate={{ width: currentStep === 1 ? "0%" : "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <form onSubmit={handleBooking}>
                <AnimatePresence mode="wait" custom={direction}>
                  {currentStep === 1 ? (
                    <motion.div
                      key="step1"
                      custom={direction}
                      initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ms-1 flex items-center gap-2">
                             {t.hatching.selectBreed}
                          </Label>
                          <div className="relative group">
                            <select
                              value={selectedBreed}
                              onChange={(e) => setSelectedBreed(e.target.value)}
                              className="w-full h-16 bg-white dark:bg-zinc-900 border-2 border-border/50 rounded-xl ps-12 pe-10 font-black text-lg appearance-none focus:border-emerald-500 focus:ring-0 shadow-sm transition-all"
                            >
                              <option value="">{t.hatching.customBreed}</option>
                              {breeds.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {b.name_ar || b.name_en}
                                </option>
                              ))}
                            </select>
                            <Egg className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                            <ChevronDown className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ms-1 py-0.5">
                            {t.hatching.eggCount}
                          </Label>
                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setEggCount(Math.max(1, eggCount - 10))}
                              className="h-16 w-16 rounded-xl border-2 border-border font-black text-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shrink-0"
                            >
                              <Minus className="w-6 h-6" />
                            </Button>
                            <div className="flex-1 relative group">
                              <Input
                                type="number"
                                value={eggCount}
                                onChange={(e) => setEggCount(Number(e.target.value))}
                                className="h-16 rounded-xl font-black text-center text-3xl bg-white dark:bg-zinc-900 border-2 border-border/50 focus-visible:ring-emerald-500 transition-all active:scale-[0.99]"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setEggCount(Math.min(config.max_capacity, eggCount + 10))}
                              className="h-16 w-16 rounded-xl border-2 border-border font-black text-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shrink-0"
                            >
                              <Plus className="w-6 h-6" />
                            </Button>
                          </div>
                        </div>

                      </div>

                      <Button
                        type="button"
                        onClick={handleNext}
                        className="h-20 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-xl text-white shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all group mt-6"
                      >
                        <span className="flex items-center gap-3">
                          متابعة المعلومات
                          <ArrowLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      custom={direction}
                      initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ms-1 py-0.5">
                            {t.hatching.fullName}
                          </Label>
                          <div className="relative group">
                            <Input
                              name="name"
                              required
                              placeholder="..."
                              className="h-16 bg-white dark:bg-zinc-900 border-2 border-border/50 rounded-xl ps-12 font-black focus:border-emerald-500 focus:bg-background transition-all shadow-sm"
                            />
                            <User className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ms-1 py-0.5">
                            {t.hatching.phone}
                          </Label>
                          <div className="relative group">
                            <Input
                              name="phone"
                              required
                              type="tel"
                              placeholder="05 / 06 / 07 ..."
                              className="h-16 bg-white dark:bg-zinc-900 border-2 border-border/50 rounded-xl ps-12 font-black focus:border-emerald-500 focus:bg-background transition-all shadow-sm font-tajawal"
                              dir="ltr"
                            />
                            <PhoneIcon className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ms-1">
                            {t.hatching.wilaya}
                          </Label>
                          <div className="relative group">
                            <select 
                              name="wilaya" 
                              required
                              className="w-full h-16 bg-white dark:bg-zinc-900 border-2 border-border/50 rounded-xl ps-12 pe-10 font-black text-lg appearance-none focus:border-emerald-500 focus:ring-0 shadow-sm transition-all text-start"
                            >
                              <option value="" disabled selected>الولاية</option>
                              {WILAYAS.map((w) => (
                                <option key={w.id} value={w.name}>
                                  {w.name}
                                </option>
                              ))}
                            </select>
                            <MapPin className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                            <ChevronDown className="absolute end-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ms-1">
                            العنوان / المدينة التفصيلية
                          </Label>
                          <div className="relative group">
                            <Input
                              name="address"
                              required
                              placeholder="حي، شارع، بلدية..."
                              className="h-16 bg-white dark:bg-zinc-900 border-2 border-border/50 rounded-xl ps-12 font-black focus:border-emerald-500 focus:bg-background transition-all shadow-sm font-tajawal"
                            />
                            <Home className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6">
                        <Button
                          type="submit"
                          disabled={bookingLoading}
                          className="h-20 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-xl text-white shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all group"
                        >
                          {bookingLoading ? (
                            <span className="flex items-center gap-3">
                              <LogoLoader size="sm" /> جاري الحجز...
                            </span>
                          ) : (
                            <span className="flex items-center gap-3">
                              تأكيد الحجز النهائي
                            </span>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <StatusBottomSheet />
    </main>
  );
}

export default function HatchingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
          <LogoLoader size="xl" />
        </div>
      }
    >
      <HatchingPageContent />
    </Suspense>
  );
}

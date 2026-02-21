"use client";
import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle, Database } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SystemHealth() {
  const supabase = createClient();
  const { t } = useI18n();
  const [status, setStatus] = useState<"healthy" | "warning" | "error">(
    "healthy",
  );
  const [message, setMessage] = useState(t.systemHealth.normal);
  const [details, setDetails] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      // 1. Check Connection
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (error) {
        if (error.code === "PGRST205") {
          // Missing Table
          setStatus("error");
          setMessage(t.systemHealth.errorTables);
          setDetails(t.systemHealth.missingTableText);
        } else {
          setStatus("warning");
          setMessage(t.systemHealth.errorConnection);
          setDetails(error.message);
        }
      } else {
        setStatus("healthy");
        setMessage(t.systemHealth.normal);
        setDetails(
          `${t.systemHealth.connected}. ${count ?? 0} ${t.systemHealth.activeProducts}`,
        );
      }
    } catch (e: any) {
      setStatus("error");
      setMessage(t.systemHealth.fail);
      setDetails(e.message);
    }
  };

  useEffect(() => {
    const runCheck = async () => {
      await checkHealth();
    };
    runCheck();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all hover:bg-opacity-80
                ${status === "healthy" ? "bg-green-100 text-green-700" : ""}
                ${status === "warning" ? "bg-yellow-100 text-yellow-700" : ""}
                ${status === "error" ? "bg-red-100 dark:bg-red-500/20 text-red-700 animate-pulse" : ""}
            `}
        >
          {status === "healthy" && <CheckCircle className="w-3 h-3" />}
          {status === "warning" && <Activity className="w-3 h-3" />}
          {status === "error" && <AlertTriangle className="w-3 h-3" />}
          {message}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />{" "}
            {t.systemHealth.diagnostic}
          </DialogTitle>
          <DialogDescription className="font-bold">
            {t.systemHealth.realtimeStatus}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div
            className={`p-4 rounded-lg border ${
              status === "healthy"
                ? "bg-green-50 border-green-200"
                : status === "error"
                  ? "bg-red-50 dark:bg-red-500/10 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <h3
              className={`font-bold ${
                status === "healthy"
                  ? "text-green-800"
                  : status === "error"
                    ? "text-red-800"
                    : "text-yellow-800"
              }`}
            >
              {message}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{details}</p>
          </div>

          {status === "error" && details?.includes("products") && (
            <div className="bg-gray-900 text-gray-300 p-3 rounded-md text-xs font-mono overflow-auto max-h-40">
              {`-- Run this in Supabase SQL Editor:
create table public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  category text not null,
  subcategory text,
  name_en text not null,
  name_ar text,
  description text,
  image_url text,
  price numeric default 0,
  stock int default 0,
  is_active boolean default true
);

alter table public.products enable row level security;
create policy "Public Read Products" on public.products for select using (true);
create policy "Public Edit Products" on public.products for all using (true) with check (true);

insert into public.products (category, subcategory, name_en, price, stock) values
('livestock', 'brahma', 'Brahma Blue', 300, 100),
('livestock', 'brahma', 'Brahma Buff', 300, 100),
('machine', 'incubator', 'Automatic 48 Eggs', 12000, 10);
`}
            </div>
          )}

          <AnimatedButton
            onClick={checkHealth}
            className="w-full h-14 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-black text-lg"
          >
            {t.systemHealth.reRun}
          </AnimatedButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md w-full bg-red-50 dark:bg-red-950/20 p-12 rounded-xl border border-red-100 dark:border-red-900/30">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-red-950 dark:text-red-50">
          حدث خطأ ما!
        </h2>
        <p className="text-red-800/70 dark:text-red-200/70 font-bold leading-relaxed">
          وقع خطأ غير متوقع. لقد تم إخطار فريقنا التقني وسنعمل على إصلاحه.
        </p>
        <Button
          onClick={() => reset()}
          className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
        >
          حاول مرة أخرى
        </Button>
      </div>
    </div>
  );
}

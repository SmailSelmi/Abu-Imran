'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2 pb-20 md:pb-0 scrollbar-thin">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 uppercase">الإحصائيات</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm mt-1">المزرعة • تحليلات ومؤشرات الأداء</p>
                </div>
            </div>

            <Card className="border-none shadow-premium bg-white dark:bg-zinc-900 rounded-3xl p-6">
                <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-xl font-black flex items-center gap-3">
                        <Activity className="h-6 w-6 text-emerald-500" />
                        نظرة عامة على الأداء
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                        <Activity className="h-16 w-16 mb-4 text-emerald-500" />
                        <h2 className="text-2xl font-black">البيانات قيد التجميع...</h2>
                        <p className="text-sm font-bold mt-2">سيتم عرض المخططات التحليلية قريباً.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

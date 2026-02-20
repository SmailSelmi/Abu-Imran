import { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة',
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <HelpCircle className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">الأسئلة الشائعة</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    إجابات وافية لأكثر الأسئلة التي تصلنا من المربين وعملائنا الكرام.
                </p>
            </div>

            <div className="space-y-6">
                <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
                    <h3 className="font-bold text-lg mb-2">هل يتوفر توصيل للولايات الجنوبية؟</h3>
                    <p className="text-muted-foreground">نعم، نوفر التوصيل لجميع الولايات الـ 58، لكن قد تستغرق مدة الشحن من 3 إلى 5 أيام عمل لبعض الولايات الجنوبية.</p>
                </div>

                <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
                    <h3 className="font-bold text-lg mb-2">كيف أضمن نسبة تفقيس عالية من بيض البراهما؟</h3>
                    <p className="text-muted-foreground">تعتمد النسبة بشكل كبير على جودة الفقاسة وضبط درجة الحرارة والرطوبة والتقليب المستمر. ننصح بضبط الحرارة على 37.7 درجة ودعم الرطوبة في آخر 3 أيام.</p>
                </div>

                <div className="p-6 rounded-xl bg-muted/30 border border-border/50">
                    <h3 className="font-bold text-lg mb-2">هل يمكنكم تحضين بيض السمان؟</h3>
                    <p className="text-muted-foreground">نعم، خدمة التفقيس لدينا تشمل مختلف أنواع الدواجن ومنها السمان، وتكون دورة التحضين أقصر (حوالي 18 يوماً).</p>
                </div>
            </div>
        </div>
    </div>
  );
}

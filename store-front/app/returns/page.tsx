import { Metadata } from 'next';
import { RefreshCcw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سياسة الاستبدال والاسترجاع',
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <RefreshCcw className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">سياسة الاستبدال والاسترجاع</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    رضاكم هو أولويتنا القصوى. تعرف على شروط الاسترجاع والاستبدال لمنتجات المزرعة.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">1. المنتجات الحية (كتاكيت، دجاج)</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        نظراً لطبيعة المنتجات الحية، لا يمكننا قبول الاسترجاع أو الاستبدال بعد استلام الطلب ومغادرة مندوب التوصيل أو مغادرتكم للمزرعة. يرجى فحص الطيور جيداً عند الاستلام.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">2. البيض المخصب</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        نضمن لك نسبة تفقيس جيدة ولكن لا يمكن ضمانها بنسبة 100% لتأثرها بعوامل التحضين الخاصة بك. يتم التعويض في حال إثبات تلف البيض أثناء الشحن بأدلة قاطعة فور استلام الطلب.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">3. المعدات والفقاسات</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        توفر مزرعة أبو عمران ضماناً على المعدات والفقاسات لمدة عام ضد عيوب الصناعة. في حال وجود خلل غير ناتج عن سوء الاستخدام، يتولى فريقنا إصلاحه أو استبدال القطعة المعيبة.
                    </p>
                </section>
            </div>
        </div>
    </div>
  );
}

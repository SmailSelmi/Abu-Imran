import { Metadata } from 'next';
import { Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سياسة الشحن',
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">سياسة الشحن</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    نحن في مزرعة أبو عمران نحرص على توصيل طلباتكم بأمان وسرعة إلى كافة الولايات المتاحة.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">1. التغطية ومناطق التوصيل</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        نغطي التوصيل لـ 58 ولاية جزائرية. تختلف مدة الشحن والتكلفة حسب الولاية والمسافة من مقر المزرعة.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">2. الشحن للمنتجات الحساسة</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        نولي اهتماماً خاصاً عند شحن البيض المخصب والكتاكيت. يتم استخدام عبوات مخصصة تحافظ على درجة الحرارة والرطوبة وتقلل من الاهتزازات لضمان وصولها بحالة ممتازة وجاهزة.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">3. مدة التوصيل المتوقعة</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>طلبات الولايات الشمالية: 24 - 48 ساعة</li>
                        <li>طلبات ولايات الهضاب العليا والجنوب: 3 - 5 أيام عمل</li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
  );
}

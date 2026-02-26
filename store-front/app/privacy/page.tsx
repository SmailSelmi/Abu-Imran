import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | مزرعة أبو عمران",
  description: "سياسة الخصوصية لمتجر مزرعة أبو عمران الإلكتروني.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background font-sans pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-3xl space-y-12" dir="rtl">
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter">
            سياسة الخصوصية
          </h1>
          <p className="text-muted-foreground font-medium opacity-60">
            آخر تحديث: فبراير 2026
          </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 font-medium leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">
              جمع المعلومات
            </h2>
            <p>
              نقوم بجمع المعلومات التي تقدمها إلينا مباشرة عند تقديم طلب، مثل:
              الاسم الكامل، رقم الهاتف، الولاية، والعنوان التفصيلي. لا نقوم بجمع
              أي معلومات مالية أو بطاقات بنكية.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">
              استخدام المعلومات
            </h2>
            <p>
              تُستخدم معلوماتك الشخصية حصريًا لمعالجة طلبك، الاتصال بك لتأكيد
              الشحن، وتحسين خدماتنا. لن نشارك معلوماتك مع أي طرف ثالث.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">
              حماية البيانات
            </h2>
            <p>
              نستخدم قواعد بيانات آمنة مشفرة لتخزين بياناتك. يتم توفير الوصول
              إلى بياناتك الشخصية لفريق العمل فقط وبالقدر الضروري لإتمام طلبك.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">حقوقك</h2>
            <p>
              يحق لك طلب الاطلاع على بياناتك الشخصية، تعديلها، أو حذفها في أي
              وقت. يمكنك التواصل معنا عبر الواتساب:{" "}
              <a
                href="tel:0665243819"
                className="text-emerald-600 font-black hover:underline"
                dir="ltr"
              >
                0665 24 38 19
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">
              ملفات تعريف الارتباط
            </h2>
            <p>
              يستخدم موقعنا ملفات تعريف الارتباط الضرورية فقط لإدارة الجلسة
              وتحسين تجربة التصفح. لا نستخدم أي ملفات تتبع تسويقية.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

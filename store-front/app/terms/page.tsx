import { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الاستخدام | مزرعة أبو عمران",
  description: "شروط وأحكام الاستخدام لمتجر مزرعة أبو عمران الإلكتروني.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background font-sans pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-3xl space-y-12" dir="rtl">
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tighter">
            شروط الاستخدام
          </h1>
          <p className="text-muted-foreground font-medium opacity-60">
            آخر تحديث: فبراير 2026
          </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 font-medium leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">
              1. قبول الشروط
            </h2>
            <p>
              باستخدامك لموقع مزرعة أبو عمران، فإنك توافق على هذه الشروط
              والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام
              الموقع.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">
              2. الطلبيات والأسعار
            </h2>
            <p>
              جميع الأسعار المعروضة بالدينار الجزائري (دج) وقابلة للتغيير دون
              إشعار مسبق. يُعدّ الطلب ملزمًا فور تأكيده هاتفيًا من فريق المزرعة.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">
              3. التوصيل والشحن
            </h2>
            <p>
              نوصل لجميع ولايات الجزائر الـ 58. قد تختلف مدة التوصيل حسب الولاية
              ونوع المنتج. يتصل فريقنا بك لتأكيد موعد الاستلام.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">
              4. الإلغاء والاسترجاع
            </h2>
            <p>
              يمكن إلغاء الطلب خلال 24 ساعة من تأكيده هاتفيًا. المنتجات الحية
              (كتاكيت، بيض) غير قابلة للاسترجاع بعد التسليم لأسباب صحية
              ولوجستية.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">
              5. حدود المسؤولية
            </h2>
            <p>
              تبذل مزرعة أبو عمران قصارى جهدها لضمان جودة منتجاتها. في حالة وجود
              خلل في المنتج، يُرجى التواصل معنا خلال 48 ساعة من الاستلام عبر
              الواتساب.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-foreground">6. التواصل</h2>
            <p>
              للاستفسار أو الشكاوى:{" "}
              <a
                href="https://wa.me/213665243819"
                className="text-emerald-600 font-black hover:underline"
              >
                +213 665 24 38 19
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

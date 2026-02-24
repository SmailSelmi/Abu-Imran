import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderForm } from "@/components/OrderForm";
import { CATEGORY_DATA } from "@/lib/constants";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface OrderPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    breed?: string;
  }>;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = CATEGORY_DATA[categoryId as keyof typeof CATEGORY_DATA];
  
  if (!category) {
    return {
      title: "طلب غير موجود | أبو عمران",
    };
  }

  return {
    title: `طلب ${category.name_ar} | أبو عمران لـدجاج الـزيـنة`,
    description: `اطلب الآن ${category.name_ar} من سلالات أبو عمران الأصيلة. جودة مضمونة وتوصيل لكل الولايات.`,
  };
}

export default async function OrderPage({ 
  params, 
  searchParams 
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ breed?: string }>;
}) {
  const { category: categoryId } = await params;
  const { breed: defaultVariant } = await searchParams;
  const config = CATEGORY_DATA[categoryId as keyof typeof CATEGORY_DATA];

  if (!config) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Header />
      
      <div className="flex-grow pt-32 pb-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 overflow-hidden border border-emerald-500/10">
            <OrderForm 
              category={categoryId} 
              isFullPage={true}
              defaultVariant={defaultVariant}
            />
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/5 shadow-sm">
              <h4 className="font-bold text-lg mb-2 text-emerald-600">توصيل سريع</h4>
              <p className="text-sm text-muted-foreground">نوصل طلباتنا لجميع ولايات الجزائر الـ 58 مع ضمان سلامة المنتجات.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/5 shadow-sm">
              <h4 className="font-bold text-lg mb-2 text-emerald-600">سلالات نقية</h4>
              <p className="text-sm text-muted-foreground">جميع منتجاتنا من سلالات نادرة وموثقة الجينات لضمان أفضل إنتاج.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-500/5 shadow-sm">
              <h4 className="font-bold text-lg mb-2 text-emerald-600">دعم متواصل</h4>
              <p className="text-sm text-muted-foreground">فريقنا متواجد للإجابة على تساؤلاتكم ومرافقتكم بعد عملية الشراء.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_DATA).map((category) => ({
    category,
  }));
}

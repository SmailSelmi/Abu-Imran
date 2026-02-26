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
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-hidden">
      
      <div className="flex-grow pt-40 md:pt-48 pb-4 md:pb-10 px-4 md:px-6 lg:px-8 w-full flex flex-col justify-start md:justify-center overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 overflow-hidden border border-emerald-500/10">
            <OrderForm 
              category={categoryId} 
              isFullPage={true}
              defaultVariant={defaultVariant}
            />
          </div>
        </div>
      </div>

    </main>
  );
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_DATA).map((category) => ({
    category,
  }));
}

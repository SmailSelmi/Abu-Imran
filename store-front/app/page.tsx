import HeroSection from "@/components/home/HeroSection";
import ShopClient from "@/app/shop/ShopClient";
import HatchingServiceSection from "@/components/home/HatchingServiceSection";
import { DeliveryZones, Testimonials } from "@/components/home/SocialProof";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

type LocalProduct = Database["public"]["Tables"]["products"]["Row"] & {
  families: Database["public"]["Tables"]["families"]["Row"] | null;
  breeds: Database["public"]["Tables"]["breeds"]["Row"] | null;
};

async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name_en, name, slug, category, subcategory, price, stock, image_url, breed_id",
    )
    .is("deleted_at", null)
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching products:", JSON.stringify(error, null, 2));
    return [];
  }

  return data as unknown as LocalProduct[];
}

export const revalidate = 600;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProducts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "مزرعة أبو عمران",
    url: "https://abu-imran-farm.com",
    description:
      "مصدرك الأول للسلالات النادرة والبيض المخصب وأحدث تقنيات التفقيس في الجزائر.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "DZ",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "منتجات الدواجن والتفقيس",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Product", name: "بيض مخصب" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Product", name: "كتاكيت الدواجن" },
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Product", name: "آلات التفقيس" },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-black font-sans">
        <HeroSection />

        {/* Interactive Shop Section */}
        <section id="shop" className="py-16 md:py-24 bg-background">
          <div className="container px-4 mx-auto">
            <Suspense fallback={<ShopSkeleton />}>
              <ShopClient initialProducts={products} initialCategory={category} />
            </Suspense>
          </div>
        </section>
        <HatchingServiceSection />

        {/* Social Proof & Trust */}
        <Testimonials />

        <DeliveryZones />

        {/* Bottom Spacer */}

      </div>
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 md:w-96 rounded-xl" />
          <Skeleton className="h-6 w-48 md:w-72 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-[180px] rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col space-y-4">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

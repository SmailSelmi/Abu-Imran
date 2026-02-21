import HeroSection from "@/components/home/HeroSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import HatchingServiceSection from "@/components/home/HatchingServiceSection";
import { DeliveryZones, Testimonials } from "@/components/home/SocialProof";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";

type LocalProductWithBreed = Database['public']['Tables']['products']['Row'] & {
  breed: Database['public']['Tables']['breeds']['Row'] | null
}

export const revalidate = 600

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch Featured Breeds/Products for Portfolio
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('id, name_en, name, category, subcategory, price, image_url, slug, is_active, breed:breeds(name_ar)')
    .eq('is_active', true)
    .limit(3);

  const parsedProducts = featuredProducts as unknown as LocalProductWithBreed[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'مزرعة أبو عمران',
    url: 'https://abu-imran-farm.com',
    description: 'مصدرك الأول للسلالات النادرة والبيض المخصب وأحدث تقنيات التفقيس في الجزائر.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DZ',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'منتجات الدواجن والتفقيس',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'بيض مخصب' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'كتاكيت الدواجن' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'آلات التفقيس' } },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-white dark:bg-black font-sans">
        <HeroSection />
        
        {/* Dynamic Portfolio Section */}
        <PortfolioSection initialProducts={parsedProducts || []} />
        
        <HatchingServiceSection />
        
        {/* Social Proof & Trust */}
        <Testimonials />
        <DeliveryZones />
        
        {/* Bottom Spacer */}
        <div className="h-32 bg-white dark:bg-black" />
      </div>
    </>
  );
}

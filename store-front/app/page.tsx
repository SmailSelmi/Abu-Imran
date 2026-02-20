import HeroSection from "@/components/home/HeroSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import HatchingServiceSection from "@/components/home/HatchingServiceSection";
import { DeliveryZones, Testimonials } from "@/components/home/SocialProof";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch Featured Breeds/Products for Portfolio
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, breed:breeds(*)')
    .eq('is_active', true)
    .limit(3);

  return (
    <main className="min-h-screen bg-white dark:bg-black font-sans">
      <HeroSection />
      
      {/* Dynamic Portfolio Section */}
      <PortfolioSection initialProducts={featuredProducts || []} />
      
      <HatchingServiceSection />
      
      {/* Social Proof & Trust */}
      <Testimonials />
      <DeliveryZones />
      
      {/* Bottom Spacer */}
      <div className="h-32 bg-white dark:bg-black" />
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Egg, Bird, ChefHat, ArrowRight, ShoppingBag } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/Icon";
import { motion } from "framer-motion";
import { Database } from "@/types/supabase";

type Family = Database['public']['Tables']['families']['Row'];
type ProductWithBreed = Database['public']['Tables']['products']['Row'] & {
  breeds: Database['public']['Tables']['breeds']['Row'] | null;
};

interface BreedGroup {
  name: string;
  name_ar?: string;
  sub: string;
  image: string;
  price_egg?: number;
  price_chick?: number;
  price_adult?: number;
  id_ref: string;
  slug_ref?: string;
}

export default function BreedShowcase() {
  const supabase = createClient();
  const [breeds, setBreeds] = useState<BreedGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBreeds() {
      // 1. Fetch all 6 families
      const { data: fams } = await supabase
        .from("families")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(6) as { data: Family[] | null };

      if (fams) {
        const showcaseItems: BreedGroup[] = [];

        // 2. For each family, get the first breed and its products
        for (const family of fams) {
            const { data: familyProducts } = await supabase
                .from("products")
                .select("*, breeds(*)")
                .eq("family_id", family.id)
                .eq('is_active', true) as { data: ProductWithBreed[] | null };

            if (familyProducts && familyProducts.length > 0) {
                // Pick the first breed found in this family as representative
                const firstProd = familyProducts[0];
                const repBreed = firstProd.breeds;
                if (!repBreed) continue;

                const breedItem: BreedGroup = {
                    name: repBreed.name_en || 'Unknown Breed',
                    name_ar: repBreed.name_ar,
                    sub: family.name_en || 'Livestock', // Show Family name as subcategory
                    image: firstProd.image_url || '/images/chicken.svg',
                    id_ref: firstProd.id,
                    slug_ref: firstProd.slug || undefined
                };

                // Populate prices
                familyProducts.forEach((p) => {
                    if (p.category === "eggs") breedItem.price_egg = p.price || 0;
                    if (p.category === "chicks") breedItem.price_chick = p.price || 0;
                    if (p.category === "chickens") breedItem.price_adult = p.price || 0;
                });

                showcaseItems.push(breedItem);
            }
        }
        setBreeds(showcaseItems);
      }
      setLoading(false);
    }
    fetchBreeds();
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-0 start-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 end-1/4 w-[20rem] h-[20rem] bg-emerald-500/5 rounded-full blur-[100px] -z-10" />

      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-xl space-y-3">
             <Badge variant="outline" className="px-3 py-0.5 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-[10px] uppercase font-black tracking-widest">
                High Quality Selection
             </Badge>
             <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
                Rare Heritage <br/><span className="text-emerald-600 italic">Breeds</span>
             </h2>
             <p className="text-sm md:text-base text-muted-foreground font-medium max-w-sm leading-relaxed">
                Experience excellence with our hand-picked selection of premium poultry and specialized equipment.
             </p>
          </div>
          <Link href="/shop" className="group w-full md:w-auto">
             <Button variant="outline" className="w-full h-12 md:h-14 px-8 rounded-xl border-border bg-white dark:bg-black hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 font-bold">
                View All Products
                <ArrowRight className="ms-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="h-96 rounded-xl bg-muted animate-pulse border border-border/50" />
             ))
          ) : (
            breeds.map((breed, idx) => {
              const [isHovered, setIsHovered] = useState(false);
              return (
                <motion.div
                  key={breed.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-emerald-500/30 transition-all duration-500 flex flex-col h-full hover:shadow-md hover:shadow-emerald-500/5">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={breed.image || '/images/chicken.svg'}
                        alt={breed.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
                      
                      <div className="absolute top-4 start-4">
                          <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 py-1 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest">
                             {breed.sub}
                          </Badge>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-6">
                         <h3 className="text-xl font-black mb-1 group-hover:text-emerald-600 transition-colors">{breed.name}</h3>
                         <p className="text-sm font-arabic text-muted-foreground opacity-80" dir="rtl">{breed.name_ar}</p>
                      </div>

                      <div className="space-y-3 mb-8 pt-4 border-t border-dashed border-border">
                          {breed.price_egg && (
                              <div className="flex justify-between items-center">
                                  <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                      <Egg className="w-3.5 h-3.5 text-amber-500"/>
                                      Hatching Eggs
                                  </span>
                                  <span className="text-xs font-black text-foreground">{breed.price_egg.toLocaleString()} DA</span>
                              </div>
                          )}
                          {breed.price_chick && (
                              <div className="flex justify-between items-center">
                                  <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                      <Bird className="w-3.5 h-3.5 text-emerald-500"/>
                                      Chicks
                                  </span>
                                  <span className="text-xs font-black text-foreground">{breed.price_chick.toLocaleString()} DA</span>
                              </div>
                          )}
                          {breed.price_adult && (
                              <div className="flex justify-between items-center">
                                  <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                      <ChefHat className="w-3.5 h-3.5 text-blue-500"/>
                                      Adult Pairs
                                  </span>
                                  <span className="text-xs font-black text-foreground">{breed.price_adult.toLocaleString()} DA</span>
                              </div>
                          )}
                      </div>

                      <Link href={`/shop/${breed.slug_ref || breed.id_ref}`} className="mt-auto">
                          <Button className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-emerald-600 hover:text-white transition-all duration-300 font-bold shadow-sm">
                               <ShoppingBag className="w-4 h-4 me-2"/>
                               Order Now
                          </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </section>
  );
}

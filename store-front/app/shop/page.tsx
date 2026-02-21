import { createClient } from '@/utils/supabase/server'
import { Suspense } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import ShopClient from './ShopClient'
import { Database } from '@/types/supabase'

export const revalidate = 3600 // revalidate at most every hour

type Product = Database['public']['Tables']['products']['Row'] & {
  families: Database['public']['Tables']['families']['Row'] | null
  breeds: Database['public']['Tables']['breeds']['Row'] | null
}

async function getProducts(category?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('id, name_en, name, slug, category, subcategory, price, stock, image_url, families(name_ar), breeds(name_ar)')
    .is('deleted_at', null)
    .order('price', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data as unknown as Product[]
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const products = await getProducts(category)
 
   return (
     <section className="min-h-screen bg-background pt-32 pb-20">
       <div className="container px-4 mx-auto">
         <Suspense fallback={<ShopSkeleton />}>
           <ShopClient initialProducts={products} initialCategory={category} />
         </Suspense>
       </div>
     </section>
   )
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
  )
}

import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/utils/supabase/server";
import ProductContent from "./ProductContent";
import { Database } from "@/types/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 3600; // revalidate at most every hour
export const runtime = "edge";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: product } = (await supabase
    .from("products")
    .select("id, name_en, category, image_url")
    .eq("slug", slug)
    .single()) as {
    data: Pick<Product, "id" | "name_en" | "category" | "image_url"> | null;
  };

  if (!product) return { title: "Product Not Found" };

  const title = `${product.name_en} | Abu Imran Farm`;
  const description = `Buy ${product.name_en} at Abu Imran Farm. Premium quality ${product.category} - Delivery available to all 58 wilayas.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();
  // 1. Fetch the specific product
  const { data: product, error } = (await supabase
    .from("products")
    .select(
      "id, name_en, name, slug, category, subcategory, price, stock, image_url, description, family_id, breed_id, stock_breakdown, color_variation_ar",
    )
    .eq("slug", slug)
    .is("deleted_at", null)
    .single()) as { data: Product | null; error: any };

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background">
        <h1 className="text-4xl font-bold mb-4">Product Not Found 🥚</h1>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  // 2. Fetch all variants for the same breed (e.g., eggs, chicks, adult)
  const { data: variants } = await supabase
    .from("products")
    .select(
      "id, name_en, name, slug, category, subcategory, price, stock, image_url, breed_id",
    )
    .eq("breed_id", product.breed_id || "")
    .is("deleted_at", null)
    .limit(10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_en,
    image: product.image_url,
    description: `Buy premium quality ${product.name_en} from Abu Imran Farm. High quality livestock and machines available in Algeria.`,
    brand: {
      "@type": "Brand",
      name: "Abu Imran Farm",
    },
    sku: product.id,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `https://abu-imran-farm.com/shop/${slug}`,
      price: product.price,
      priceCurrency: "DZD",
      availability:
        (product.stock || 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductContent
        initialProduct={product as Product}
        variants={(variants || [product]) as Product[]}
        slug={slug}
      />
    </>
  );
}

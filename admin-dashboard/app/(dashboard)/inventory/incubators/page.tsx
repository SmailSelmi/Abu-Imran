"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Thermometer,
  Settings,
  Package,
  Activity,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import ChickenLoader from "@/components/ui/chicken-loader";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import Link from "next/link";
import { clsx } from "clsx";
import { Icon } from "@/components/ui/Icon";

import { Database } from "@/types/supabase";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function IncubatorsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const supabase = createClient();

  const [formData, setFormData] = useState({
    name_en: "",
    slug: "",
    category: "machine",
    subcategory: "Incubator",
    price: 0,
    stock: 0,
    image_url: "/images/incubator.svg",
  });

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name_en: name,
      slug:
        prev.slug === generateSlug(prev.name_en)
          ? generateSlug(name)
          : prev.slug,
    }));
  };

  const fetchProducts = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name_en, slug, category, subcategory, price, stock, image_url",
      )
      .in("category", ["machine", "incubators"])
      .is("deleted_at", null) // Only active machines
      .order("price", { ascending: true });

    if (error) {
      console.error("Error fetching incubators:", error);
      toast.error("Failed to load inventory.");
    } else {
      setProducts((data as unknown as Product[]) || []);
    }
    if (showLoader) setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const init = async () => {
      await fetchProducts();
    };
    init();
  }, [fetchProducts]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
    type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

    const payload: ProductInsert = {
      name_en: formData.name_en,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category,
      subcategory: formData.subcategory,
      image_url: formData.image_url,
      slug: formData.slug || formData.name_en.toLowerCase().replace(/ /g, "-"),
      is_active: true,
    };

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update(payload as ProductUpdate)
        .eq("id", editingId);
      if (error) toast.error("Update failed");
      else {
        toast.success("Product updated!");
        resetForm();
        fetchProducts(false);
      }
    } else {
      // For new products, also set is_active
      const { error } = await supabase.from("products").insert([payload]);
      if (error) toast.error("Creation failed");
      else {
        toast.success("Product created!");
        resetForm();
        fetchProducts(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const { error } = await supabase
      .from("products")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", itemToDelete);

    if (error) toast.error("Delete failed");
    else {
      toast.success("Asset moved to recycle bin");
      fetchProducts(false);
    }

    setConfirmOpen(false);
    setItemToDelete(null);
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name_en: "",
      slug: "",
      category: "machine",
      subcategory: "Incubator",
      price: 0,
      stock: 0,
      image_url: "/images/incubator.svg",
    });
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name_en: product.name_en,
      slug: product.slug || "",
      category: product.category,
      subcategory: product.subcategory || "Incubator",
      price: product.price,
      stock: product.stock,
      image_url: product.image_url || "/images/incubator.svg",
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <ChickenLoader mode="dashboard" />
      </div>
    );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-10">
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Move to Recycle Bin?"
        description="Are you sure you want to move this asset to the recycle bin? It will be hidden from the storefront."
        confirmText="Move to Bin"
        variant="destructive"
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4">
            وحدات الحاضنات{" "}
            <span className="text-emerald-200 text-2xl font-black">/</span>{" "}
            {products.length}
          </h1>
          <p className="text-muted-foreground font-black">
            مراقبة حالة انتشار الآلات وتوفرها.
          </p>
        </div>
        {!isAdding && (
          <AnimatedButton
            onClick={() => setIsAdding(true)}
            className="h-14 px-10 rounded-xl font-black text-lg shadow-sm shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white border-none"
          >
            <Plus className="ms-3 h-6 w-6" /> إضافة حاضنة
          </AnimatedButton>
        )}
      </div>

      {isAdding && (
        <Card className="border border-border/40 shadow-sm rounded-xl bg-white dark:bg-card overflow-hidden animate-in zoom-in-95 duration-300">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Plus className="w-6 h-6" />
              </div>
              {editingId ? "تعديل مصفوفة الوحدة" : "تهيئة أصل جديد"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="space-y-2 lg:col-span-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
                  تسمية الأصل
                </Label>
                <Input
                  required
                  value={formData.name_en}
                  onChange={handleNameChange}
                  placeholder="مثال: حاضنة أوتوماتيكية 48 بيضة"
                  className="h-12 rounded-xl bg-muted/50 border-none focus:ring-emerald-500/20 font-black"
                />
              </div>
              <div className="space-y-2 lg:col-span-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
                  معرف الرابط (Slug)
                </Label>
                <div className="flex gap-2">
                  <Input
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="مثال: industrial-automatic-48"
                    dir="ltr"
                    className="h-12 rounded-xl bg-muted/50 border-none focus:ring-emerald-500/20 font-mono text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 shrink-0 rounded-xl"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        slug: generateSlug(formData.name_en),
                      })
                    }
                    title="توليد تلقائي"
                  >
                    <Activity className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
                  نوع الكتلة
                </Label>
                <Input
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategory: e.target.value })
                  }
                  className="h-12 rounded-xl bg-muted/50 border-none focus:ring-emerald-500/20 font-black"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
                  القيمة السوقية (دج)
                </Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="h-12 rounded-xl bg-muted/50 border-none focus:ring-emerald-500/20 font-black"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
                  الوحدات المتوفرة
                </Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: Number(e.target.value) })
                  }
                  className="h-12 rounded-xl bg-muted/50 border-none focus:ring-emerald-500/20 font-black"
                />
              </div>

              <div className="lg:col-span-4 flex justify-end gap-3 pt-6 border-t border-muted/50 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetForm}
                  className="min-h-[48px] h-12 rounded-xl font-black"
                >
                  إلغاء العملية
                </Button>
                <Button
                  disabled={loading}
                  type="submit"
                  className="min-h-[48px] h-12 px-10 rounded-xl font-black bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 border-none"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  {editingId ? "تحديث البيانات" : "تأكيد الحفظ"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card
            key={product.id}
            className="relative overflow-hidden group border border-border/40 shadow-sm rounded-xl bg-white dark:bg-card hover:shadow-sm transition-all duration-500"
          >
            <CardHeader className="p-7 pb-2 relative z-10">
              <div className="flex justify-between items-start">
                <Badge
                  variant="secondary"
                  className="capitalize rounded-full px-4 py-1.5 font-black text-[10px] tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-none"
                >
                  {product.subcategory === "Incubator"
                    ? "حاضنة"
                    : product.subcategory}
                </Badge>
                <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex gap-1 translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-muted/50 hover:bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:bg-red-500/20 text-red-500"
                    onClick={() => {
                      setItemToDelete(product.id);
                      setConfirmOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-2xl font-black leading-tight mt-4 tracking-tight group-hover:text-primary transition-colors flex flex-col gap-1">
                {product.name_en}
                {product.slug && (
                  <span className="text-[10px] font-mono opacity-30">
                    /{product.slug}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-7 pt-2 relative z-10">
              <div className="flex justify-between items-end mt-6">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1 opacity-50">
                    قيمة الوحدة
                  </p>
                  <div className="text-3xl font-black tracking-tighter">
                    {(product.price ?? 0).toLocaleString()}{" "}
                    <span className="text-xs opacity-60">دج</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                    Stock Level
                  </div>
                  <div
                    className={clsx(
                      "text-2xl font-black px-4 py-1.5 rounded-xl inline-block shadow-sm",
                      (product.stock ?? 0) < 5
                        ? "bg-red-50 dark:bg-red-500/10 text-red-600 border border-red-100"
                        : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20",
                    )}
                  >
                    {product.stock ?? 0}
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors flex items-center justify-center p-8">
              <div className="opacity-30 group-hover:scale-110 transition-transform -mr-4 -mt-4">
                <Icon
                  src="https://cdn.lordicon.com/msoeawqm.json"
                  trigger="loop"
                  size={80}
                />
              </div>
            </div>
          </Card>
        ))}
        {products.length === 0 && !loading && (
          <div className="col-span-full text-center py-24 opacity-20 space-y-4">
            <Icon
              src="https://cdn.lordicon.com/dxjqvkzv.json"
              trigger="loop"
              size={80}
            />
            <h3 className="text-2xl font-black font-mono">
              NO ASSETS DETECTED
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

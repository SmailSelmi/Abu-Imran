'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/supabase'
import { cn } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit, Save, X } from "lucide-react"
import { toast } from "sonner"

import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']

interface ProductFormState {
  name_en: string
  name_ar: string
  slug: string
  category: string
  subcategory: string
  price: string
  stock: string
  image_url: string
}

export default function ProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // New Product Form State
  const [newProduct, setNewProduct] = useState<ProductFormState>({
    name_en: '',
    name_ar: '',
    slug: '',
    category: 'eggs',
    subcategory: 'Australorp Family',
    price: '',
    stock: '',
    image_url: ''
  })

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await (supabase as any)
      .from('products')
      .select('id, name_en, name, slug, category, subcategory, price, stock, image_url, deleted_at')
      .is('deleted_at', null) // Only fetch active products
      .order('created_at', { ascending: false })

    
    if (data) setProducts(data)
    if (error) console.error('Error fetching products:', error)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle Add/Edit Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalSlug = newProduct.slug || 
        (newProduct.name_en || newProduct.name_ar)
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
            .replace(/(^-|-$)+/g, '') ||
        `product-${Date.now()}`

    const payload: ProductInsert = {
        name: newProduct.name_ar,
        name_en: newProduct.name_en,
        slug: finalSlug,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        image_url: newProduct.image_url || null,
        is_active: true
    }

    if (editingId) {
        // Update existing product
        const { error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', editingId)


        if (error) {
            toast.error('فشل تحديث المنتج: ' + error.message)
            console.error(error)
        } else {
            toast.success('تم تحديث المنتج بنجاح!')
            resetForm()
            fetchProducts()
        }
    } else {
        // Create new product
        const { error } = await (supabase as any)
            .from('products')
            .insert([payload])

        
        if (error) {
            toast.error('فشل إضافة المنتج: ' + error.message)
            console.error(error)
        } else {
            toast.success('تمت إضافة المنتج بنجاح!')
            resetForm()
            fetchProducts()
        }
    }
  }

  const handleEdit = (product: Product) => {
      setEditingId(product.id)
      setNewProduct({
          name_en: product.name_en,
          name_ar: product.name || '',
          slug: product.slug || '',
          category: product.category || 'eggs',
          subcategory: product.subcategory || '',
          price: (product.price || 0).toString(),
          stock: (product.stock || 0).toString(),
          image_url: product.image_url || ''
      })
      setIsAdding(true)
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async () => {
      if (!deletingId) return

      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', deletingId)

      
      if (error) {
          toast.error('فشل حذف المنتج: ' + error.message)
          console.error(error)
      } else {
          toast.success('تم نقل المنتج إلى سلة المحذوفات')
          setProducts(products.filter(p => p.id !== deletingId))
      }
      setConfirmOpen(false)
      setDeletingId(null)
  }

  const resetForm = () => {
      setIsAdding(false)
      setEditingId(null)
      setNewProduct({
          name_en: '',
          name_ar: '',
          slug: '',
          category: 'eggs',
          subcategory: 'Australorp Family',
          price: '',
          stock: '',
          image_url: ''
      })
  }

  return (
    <div className="space-y-6">
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => {
            setConfirmOpen(false)
            setDeletingId(null)
        }}
        onConfirm={handleDelete}
        title="نقل إلى سلة المحذوفات؟"
        description="هل أنت متأكد من نقل هذا المنتج إلى سلة المحذوفات؟ يمكن استعادته لاحقاً."
        confirmText="نقل للسلة"
        variant="destructive"
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <h1 className="text-4xl font-black tracking-tighter">مدير المخزون الشامل</h1>
            <p className="text-muted-foreground font-black">إدارة جميع منتجات المزرعة وتتبع مستويات التوفر.</p>
        </div>
        <div className="flex gap-3">
            <Link href="/products/recycle-bin">
                <AnimatedButton variant="outline" className="rounded-xl h-12 bg-white dark:bg-card border-none shadow-md text-red-500 font-black">
                    <Trash2 className="ms-2 h-4 w-4" /> سلة المحذوفات
                </AnimatedButton>
            </Link>
            {!isAdding && (
                <AnimatedButton onClick={() => setIsAdding(true)} className="rounded-xl h-12 px-6 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-black">
                    <Plus className="ms-2 h-5 w-5" /> إضافة منتج
                </AnimatedButton>
            )}
        </div>
      </div>

      {/* Add/Edit Product Form (Collapsible) */}
      {isAdding && (
          <Card className={`border border-border/40 shadow-sm rounded-xl overflow-hidden ${editingId ? 'bg-blue-50/30 dark:bg-blue-950/10' : 'bg-emerald-50/30 dark:bg-emerald-950/10'}`}>
              <CardHeader className="flex flex-row items-center justify-between p-8">
                  <CardTitle className="text-xl font-black">{editingId ? 'تعديل المنتج' : 'إضافة مادة جديدة'}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={resetForm} className="rounded-xl">
                      <X className="h-5 w-5" />
                  </Button>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                  <form onSubmit={handleSaveProduct} className="grid gap-6 md:grid-cols-2">
                      <div className="grid gap-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">الاسم بالإنجليزية</Label>
                          <Input required placeholder="مثال: Brahma Gold" value={newProduct.name_en} onChange={e => {
                                const name = e.target.value;
                                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                setNewProduct({...newProduct, name_en: name, slug: slug})
                          }} className="h-12 rounded-xl bg-muted/50 border-none font-black" />
                      </div>
                      <div className="grid gap-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">الاسم بالعربية</Label>
                          <Input placeholder="مثال: براهما ذهبي" value={newProduct.name_ar} onChange={e => setNewProduct({...newProduct, name_ar: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-none font-black text-right" />
                      </div>

                      <div className="grid gap-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">المعرف البرمجي (Slug)</Label>
                          <Input placeholder="يتم توليده تلقائياً" value={newProduct.slug} onChange={e => setNewProduct({...newProduct, slug: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-none font-mono text-sm" />
                      </div>
                      
                      <div className="grid gap-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">الفئة الأساسية</Label>
                          <select 
                            className="flex h-12 w-full rounded-xl border-none bg-muted/50 px-4 py-2 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            value={newProduct.category}
                            onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                          >
                            <option value="eggs">بيض التفقيس</option>
                            <option value="chicks">صيصان</option>
                            <option value="chickens">دواجن بالغة</option>
                            <option value="machine">حاضنات ومعدات</option>
                          </select>
                      </div>

                      <div className="grid gap-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">الفئة الفرعية</Label>
                           <select 
                            className="flex h-12 w-full rounded-xl border-none bg-muted/50 px-4 py-2 text-sm font-black outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                            value={newProduct.subcategory}
                            onChange={e => setNewProduct({...newProduct, subcategory: e.target.value})}
                          >
                              <option value="Australorp Family">أسترالورب</option>
                              <option value="Plymouth Rock Family">بليموث روك</option>
                              <option value="Brahma Family">براهما</option>
                              <option value="Sprite Family">سبريت</option>
                              <option value="Other Breeds">سلالات أخرى</option>
                              <option value="Incubator">حاضنة</option>
                          </select>
                      </div>

                      <div className="grid gap-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">السعر (دج)</Label>
                          <Input required type="number" placeholder="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-none font-black" />
                      </div>

                      <div className="grid gap-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">كمية المخزون</Label>
                          <Input required type="number" placeholder="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="h-12 rounded-xl bg-muted/50 border-none font-black" />
                      </div>
                      
                      <div className="col-span-2 flex gap-4 mt-4">
                          <Button type="submit" className="flex-1 h-14 rounded-xl bg-emerald-600 text-white shadow-sm font-black text-lg hover:bg-emerald-700">
                              {editingId ? 'تعديل البيانات' : 'حفظ المنتج الجديد'}
                          </Button>
                          <Button type="button" variant="outline" onClick={resetForm} className="h-14 px-8 rounded-xl font-black">
                              إلغاء
                          </Button>
                      </div>
                  </form>
              </CardContent>
          </Card>
      )}

      <Card className="border border-border/40 shadow-sm rounded-xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black">المخزون الحالي ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/30">
                        <tr>
                            <th className="px-8 py-4">المنتج</th>
                            <th className="px-8 py-4">الفئة</th>
                            <th className="px-8 py-4">السعر (دج)</th>
                            <th className="px-8 py-4 text-center">المخزون</th>
                            <th className="px-8 py-4 text-center">الحالة</th>
                            <th className="px-8 py-4 text-left">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-emerald-50/30 transition-colors">
                                <td className="px-6 py-4 font-black">
                    <div className="text-lg">{product.name_en}</div>
                    <div className="text-xs text-muted-foreground opacity-50 font-mono">#{product.id.substring(0, 8)}</div>
                </td>
                                <td className="px-8 py-5 capitalize">
                                    <Badge variant="outline" className="rounded-full px-3 py-1 border-emerald-200 bg-emerald-50 text-emerald-600 font-black">{product.subcategory}</Badge>
                                </td>
                                <td className="px-8 py-5 font-black text-lg">{product.price?.toLocaleString()}</td>
                                <td className="px-8 py-5 text-center font-black">
                                    <div className={cn(
                                    "text-2xl font-black px-4 py-1.5 rounded-xl inline-block shadow-sm",
                                    (product.stock ?? 0) < 10 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                )}>
                                    {product.stock ?? 0}
                                </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    <Badge className={cn(
                                        "rounded-full px-3 py-1 font-black border-none",
                                        (product.stock ?? 0) > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                    )}>
                                        {(product.stock ?? 0) > 0 ? 'متوفر' : 'تنفذ'}
                                    </Badge>
                                </td>
                                <td className="px-8 py-5 text-left">
                                    <div className="flex gap-2">
                                        <AnimatedButton variant="ghost" size="sm" className="h-10 w-10 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl" onClick={() => handleEdit(product)}>
                                            <Edit className="h-4 w-4" />
                                        </AnimatedButton>
                                        <AnimatedButton variant="ghost" size="sm" className="h-10 w-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => {
                                            setDeletingId(product.id)
                                            setConfirmOpen(true)
                                        }}>
                                            <Trash2 className="h-4 w-4" />
                                        </AnimatedButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                          {products.length === 0 && !loading && (
                             <tr>
                                 <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground font-black opacity-30">
                                     لا يوجد مخزون حالياً. أضف بعض المنتجات للبدء!
                                 </td>
                             </tr>
                         )}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

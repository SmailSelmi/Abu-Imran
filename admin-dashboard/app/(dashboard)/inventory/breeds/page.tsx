'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search, Egg, Bird, AlertTriangle, Package, Activity } from "lucide-react"
import { clsx } from 'clsx'
import { toast } from 'sonner'
import ChickenLoader from "@/components/ui/chicken-loader"
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Database } from '@/types/supabase'

type Breed = Database['public']['Tables']['breeds']['Row']
type Family = Database['public']['Tables']['families']['Row']
type Product = Database['public']['Tables']['products']['Row'] & {
    families?: Family | null
    breeds?: Breed | null
}

export default function BreedsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [families, setFamilies] = useState<any[]>([])
  const [breeds, setBreeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name_en: '',
    slug: '',
    category: 'eggs',
    subcategory: '',
    family_id: '',
    breed_id: '',
    color_variation_ar: '',
    price: 0,
    stock: 0,
    stock_breakdown: { '1wk': 0, '2wk': 0, '4wk': 0 },
    next_batch_date: '',
    image_url: '/images/chicken.svg',
    description: '' // Added description to formData
  })

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData(prev => ({
      ...prev,
      name_en: name,
      slug: prev.slug === generateSlug(prev.name_en) ? generateSlug(name) : prev.slug
    }))
  }

  useEffect(() => {
    fetchProducts()
    fetchMetadata()
  }, [])

  const fetchMetadata = async () => {
    const { data: fams } = await supabase.from('families').select('*').order('display_order')
    const { data: brds } = await supabase.from('breeds').select('*').order('name_ar')
    if (fams) setFamilies(fams)
    if (brds) setBreeds(brds)
  }

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        families:family_id (*),
        breeds:breed_id (*)
      `)
      .neq('category', 'machine')
      .is('deleted_at', null) // Only active products
      .order('category', { ascending: true })

    
    if (error) {
        console.error('Error fetching products:', JSON.stringify(error, null, 2))
        toast.error('Failed to load inventory: ' + error.message)
    } else {
        setProducts(data || [])
    }
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    type ProductInsert = Database['public']['Tables']['products']['Insert']
    type ProductUpdate = Database['public']['Tables']['products']['Update']

        const payload: ProductInsert = { 
            name_en: formData.name_en, 
            price: Number(formData.price), 
            stock: Number(formData.stock),
            breed_id: formData.breed_id || null,
            family_id: formData.family_id || null,
            category: formData.category,
            subcategory: formData.subcategory,
            image_url: formData.image_url,
            description: formData.description,
            slug: formData.slug || formData.name_en.toLowerCase().replace(/ /g, '-'),
            is_active: true,
            stock_breakdown: formData.category === 'chicks' ? formData.stock_breakdown : null,
            next_batch_date: formData.category === 'eggs' ? formData.next_batch_date : null
        } 
    
        if (editingId) {
            const updatePayload: ProductUpdate = {
                ...payload,
                is_active: undefined // Don't overwrite is_active on update if not needed
            };
            const { error } = await supabase.from('products').update(updatePayload).eq('id', editingId)
        if (error) toast.error('Update failed')
        else { toast.success('Product updated!'); resetForm(); fetchProducts(); }
    } else {
        const { error } = await supabase.from('products').insert([payload])
        if (error) toast.error('Creation failed')
        else { toast.success('Product created!'); resetForm(); fetchProducts(); }
    }
  }

  const handleDelete = async () => {
      if(!itemToDelete) return
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', itemToDelete)
      
      if (error) toast.error('Delete failed')
      else { toast.success('Product moved to recycle bin'); fetchProducts(); }
      
      setConfirmOpen(false)
      setItemToDelete(null)
  }

  const resetForm = () => {
      setIsAdding(false)
      setEditingId(null)
      setFormData({
        name_en: '',
        slug: '',
        category: 'eggs',
        subcategory: '',
        family_id: '',
        breed_id: '',
        color_variation_ar: '',
        price: 0,
        stock: 0,
        stock_breakdown: { '1wk': 0, '2wk': 0, '4wk': 0 },
        next_batch_date: '',
        image_url: '/images/chicken.svg',
        description: ''
      });
  }
  
  const handleEdit = (product: any) => {
      setEditingId(product.id)
      setFormData({
          name_en: product.name_en,
          slug: product.slug || '',
          category: product.category,
          subcategory: product.subcategory || '',
          family_id: product.family_id || '',
          breed_id: product.breed_id || '',
          color_variation_ar: product.color_variation_ar || '',
          price: product.price,
          stock: product.stock,
          stock_breakdown: product.stock_breakdown || { '1wk': 0, '2wk': 0, '4wk': 0 },
          next_batch_date: product.next_batch_date || '',
          image_url: product.image_url || '/images/chicken.svg',
          description: product.description || ''
      })
      setIsAdding(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><ChickenLoader mode="dashboard" /></div>

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <ConfirmDialog 
        isOpen={confirmOpen}
        onClose={() => {
            setConfirmOpen(false)
            setItemToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Move to Recycle Bin?"
        description="Are you sure you want to move this product to the recycle bin? It will be hidden from the storefront."
        confirmText="Move to Bin"
        variant="destructive"
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">مخزون المواشي</h1>
            <p className="text-sm md:text-base text-muted-foreground">إدارة البيض، الكتاكيت، والدواجن في المزرعة.</p>
        </div>
        <div className="flex items-center gap-3">
            <Link href="/products/recycle-bin">
                <Button variant="outline" className="rounded-xl px-4 border-muted-foreground/20 text-muted-foreground hover:text-red-500 hover:bg-red-50 font-black h-12">
                    <Trash2 className="ml-2 h-4 w-4" /> سلة المحذوفات
                </Button>
            </Link>
            {!isAdding && (
                <Button onClick={() => setIsAdding(true)} className="rounded-xl px-6 font-black shadow-lg shadow-emerald-500/20 h-12 bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="ml-2 h-5 w-5" /> إضافة مخزون
                </Button>
            )}
        </div>
      </div>

      {isAdding && (
          <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600" />
              <CardHeader className="p-4 md:p-6 pb-2 md:pb-4">
                  <CardTitle className="text-xl md:text-2xl font-black leading-tight">{editingId ? 'تعديل بيانات المخزون' : 'إضافة مخزون جديد للمزرعة'}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                  <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      
                      <div className="space-y-2 col-span-full border-b border-dashed pb-4 mb-2">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">التصنيف البيولوجي</h3>
                      </div>
                      
                      <div className="space-y-2">
                          <Label className="text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/80">الاسم الداخلي</Label>
                          <Input required value={formData.name_en} onChange={handleNameChange} placeholder="مثال: بيض ساسو فضي" className="bg-muted/50 border-transparent focus:bg-background h-12 rounded-xl font-black" />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/80">معرف الرابط (Slug)</Label>
                        <div className="flex gap-2">
                            <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="مثال: sasso-silver-eggs" dir="ltr" className="bg-muted/50 border-transparent focus:bg-background h-12 rounded-xl font-mono text-xs" />
                            <Button type="button" variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-xl" onClick={() => setFormData({...formData, slug: generateSlug(formData.name_en)})} title="توليد تلقائي">
                                <Activity className="w-4 h-4" />
                            </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                          <Label className="text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/80">مرحلة النمو</Label>
                           <select 
                            className="flex h-12 w-full rounded-xl border-transparent bg-muted/50 px-4 py-2 text-sm font-black focus:bg-background focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                           >
                               <option value="eggs">بيض تفقيس</option>
                               <option value="chicks">صيصان</option>
                               <option value="chickens">دواجن بالغة</option>
                           </select>
                      </div>
                      
                      <div className="space-y-2">
                          <Label className="text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/80">صنف العائلة</Label>
                          <select 
                            className="flex h-12 w-full rounded-xl border-transparent bg-muted/50 px-4 py-2 text-sm font-black focus:bg-background focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            value={formData.family_id}
                            onChange={e => {
                                const famId = e.target.value;
                                setFormData({...formData, family_id: famId, breed_id: ''});
                            }}
                          >
                              <option value="">-- اختر العائلة --</option>
                              {families.map(f => (
                                  <option key={f.id} value={f.id}>{f.name_ar} ({f.name_en})</option>
                              ))}
                          </select>
                      </div>

                      <div className="space-y-2">
                          <Label className="text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/80">السلالة التفصيلية</Label>
                          <select 
                            className="flex h-12 w-full rounded-xl border-transparent bg-muted/50 px-4 py-2 text-sm font-black focus:bg-background focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            value={formData.breed_id}
                            disabled={!formData.family_id}
                            onChange={e => {
                                const selectedBreed = breeds.find(b => b.id === e.target.value);
                                if (selectedBreed) {
                                    const typeSuffix = formData.category === 'eggs' ? '(Eggs)' : formData.category === 'chicks' ? '(Chick)' : '(Adult)';
                                    setFormData({
                                        ...formData, 
                                        breed_id: selectedBreed.id,
                                        name_en: `${selectedBreed.name_en} ${typeSuffix}`,
                                        slug: generateSlug(`${selectedBreed.name_en} ${typeSuffix}`)
                                    });
                                }
                            }}
                          >
                              <option value="">-- اختر السلالة --</option>
                              {breeds.filter(b => b.family_id === formData.family_id).map(b => (
                                  <option key={b.id} value={b.id}>{b.name_ar}</option>
                              ))}
                          </select>
                      </div>

                      <div className="space-y-2">
                          <Label className="text-[11px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/80">سعر التداول (دج)</Label>
                          <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="bg-muted/50 border-transparent focus:bg-background h-12 rounded-xl font-black" />
                      </div>

                      {formData.category === 'chicks' ? (
                          <div className="col-span-full grid grid-cols-3 gap-4 p-6 bg-muted/20 rounded-xl border border-muted/50">
                              <div className="col-span-full mb-2 font-black text-sm uppercase tracking-wider text-primary">Maturation Matrix</div>
                              <div className="space-y-1">
                                  <Label className="text-[10px] font-bold tracking-widest opacity-70">1 WEEK</Label>
                                  <Input 
                                    type="number" 
                                    value={(formData.stock_breakdown as any)?.['1wk'] || 0} 
                                    onChange={e => setFormData({
                                        ...formData, 
                                        // Stock breakdown display removed as it's not in the DB schema anymore
                                        stock_breakdown: { ...(formData.stock_breakdown as any), '1wk': Number(e.target.value) },
                                        stock: Number(e.target.value) + ((formData.stock_breakdown as any)?.['2wk'] || 0) + ((formData.stock_breakdown as any)?.['4wk'] || 0)
                                    })} 
                                    className="bg-background"
                                  />
                              </div>
                              <div className="space-y-1">
                                  <Label className="text-[10px] font-bold tracking-widest opacity-70">2 WEEKS</Label>
                                  <Input 
                                    type="number" 
                                    value={(formData.stock_breakdown as any)?.['2wk'] || 0} 
                                    onChange={e => setFormData({
                                        ...formData, 
                                        stock_breakdown: { ...(formData.stock_breakdown as any), '2wk': Number(e.target.value) },
                                        stock: ((formData.stock_breakdown as any)?.['1wk'] || 0) + Number(e.target.value) + ((formData.stock_breakdown as any)?.['4wk'] || 0)
                                    })} 
                                    className="bg-background"
                                  />
                              </div>
                               <div className="space-y-1">
                                  <Label className="text-[10px] font-bold tracking-widest opacity-70">4 WEEKS</Label>
                                  <Input 
                                    type="number" 
                                    value={(formData.stock_breakdown as any)?.['4wk'] || 0} 
                                    onChange={e => setFormData({
                                        ...formData, 
                                        stock_breakdown: { ...(formData.stock_breakdown as any), '4wk': Number(e.target.value) },
                                        stock: ((formData.stock_breakdown as any)?.['1wk'] || 0) + ((formData.stock_breakdown as any)?.['2wk'] || 0) + Number(e.target.value)
                                    })} 
                                    className="bg-background"
                                  />
                              </div>
                              <div className="col-span-full mt-2 text-xs font-bold text-muted-foreground">Aggregated Inventory: <span className="text-primary text-lg">{formData.stock}</span> units</div>
                          </div>
                      ) : (
                        <div className="space-y-2">
                            <Label className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Total Available Stock</Label>
                            <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="bg-muted/50 border-transparent focus:bg-background h-11" />
                        </div>
                      )}

                      {formData.category === 'eggs' && (
                          <div className="space-y-2">
                              <Label className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Incubation Maturity Date</Label>
                              <Input 
                                type="date" 
                                value={formData.next_batch_date || ''} 
                                onChange={e => setFormData({...formData, next_batch_date: e.target.value})} 
                                className="bg-muted/50 border-transparent focus:bg-background h-11"
                              />
                          </div>
                      )}

                      <div className="col-span-full flex justify-end gap-3 pt-6 border-t border-dashed mt-4">
                          <Button type="button" variant="ghost" className="rounded-xl px-6 font-black" onClick={resetForm}>إلغاء العملية</Button>
                          <Button type="submit" className="rounded-xl px-12 h-14 font-black shadow-xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white">{editingId ? 'تحديث المخزون' : 'تأكيد الإضافة'}</Button>
                      </div>
                  </form>
              </CardContent>
          </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {products.map((product) => (
              <Card key={product.id} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-xl md:rounded-xl overflow-hidden bg-white dark:bg-card">
                  <CardHeader className="bg-muted/30 p-5 md:p-6">
                      <div className="flex justify-between items-start mb-4">
                           <div className={clsx(
                                "w-12 h-12 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform",
                                product.category === 'eggs' ? 'bg-orange-100 text-orange-600' : 
                                product.category === 'chicks' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                           )}>
                                <Icon 
                                    src={product.category === 'eggs' ? "https://cdn.lordicon.com/hursldjj.json" : "https://cdn.lordicon.com/rxufjlal.json"} 
                                    trigger="hover" 
                                    size={32} 
                                />
                           </div>
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Button variant="ghost" size="icon" className="h-10 w-10 bg-background/50 backdrop-blur shadow-sm rounded-xl" onClick={() => handleEdit(product)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                                  <Button variant="ghost" size="icon" className="h-10 w-10 bg-background/50 backdrop-blur shadow-sm text-red-500 rounded-xl" onClick={() => {
                                     setItemToDelete(product.id)
                                     setConfirmOpen(true)
                                  }}><Trash2 className="h-4 w-4" /></Button>
                           </div>
                      </div>
                      <Badge variant="outline" className="mb-3 capitalize border-emerald-200 bg-emerald-50 text-emerald-600 font-black px-3 py-1 rounded-full">
                          {product.category === 'eggs' ? 'بيض' : product.category === 'chicks' ? 'صيصان' : 'دواجن'}
                          { product.families?.name_ar && ` • ${product.families.name_ar}` }
                      </Badge>
                       <CardTitle className="text-xl md:text-2xl font-black leading-tight group-hover:text-primary transition-colors">{product.name_en}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-1">
                          <CardDescription className="font-medium text-xs tracking-wide uppercase opacity-70">
                              {product.breeds?.name_ar || product.subcategory}
                          </CardDescription>
                          {product.slug && (
                              <Badge variant="secondary" className="text-[9px] h-4 rounded px-1 font-mono tracking-tighter opacity-50 bg-black/5">
                                  /{product.slug}
                              </Badge>
                          )}
                      </div>
                  </CardHeader>
                   <CardContent className="p-5 md:p-6">
                      <div className="flex justify-between items-end">
                          <div>
                               <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">سعر السوق</div>
                               <div className="text-3xl font-black tracking-tighter">{(product.price ?? 0).toLocaleString()} <span className="text-xs opacity-60">دج</span></div>
                          </div>
                          <div className="text-right">
                               <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">مستوى المخزون</div>
                               <div className={clsx(
                                   "text-2xl font-black px-4 py-1.5 rounded-xl inline-block shadow-sm",
                                   (product.stock || 0) < 10 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                               )}>
                                   {product.stock || 0}
                               </div>
                          </div>
                      </div>
                      
                      {product.category === 'chicks' && product.stock_breakdown && (
                          <div className="mt-6 pt-4 border-t border-dashed flex justify-between gap-2 overflow-x-auto">
                              {Object.entries(product.stock_breakdown as Record<string, number>).map(([age, count]) => (
                                  <div key={age} className="text-center px-3 py-2 bg-muted/40 rounded-xl min-w-[70px]">
                                      <div className="text-[10px] font-bold opacity-50 mb-1">{age.toUpperCase()}</div>
                                      <div className="text-sm font-black">{count}</div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </CardContent>
              </Card>
          ))}
          {products.length === 0 && !loading && (
              <div className="col-span-full text-center py-24 bg-muted/20 rounded-xl border-2 border-dashed border-muted">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-10" />
                  <h3 className="text-2xl font-black opacity-30">Biological Inventory Empty</h3>
              </div>
          )}
      </div>
    </div>
  )
}

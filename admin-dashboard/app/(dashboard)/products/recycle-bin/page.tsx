'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { RefreshCcw, Trash2, ArrowLeft } from "lucide-react"
import { toast } from 'sonner'
import Link from 'next/link'
import ChickenLoader from "@/components/ui/chicken-loader"
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Checkbox } from '@/components/ui/checkbox'

export default function RecycleBinPage() {
  const [deletedProducts, setDeletedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  
  // Confirmation Modal State
  const [confirmAction, setConfirmAction] = useState<'single' | 'bulk_delete' | 'empty_trash' | null>(null)

  const supabase = createClient()

  // Fetch Deleted Products
  const fetchDeletedProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('id, name_en, subcategory, price, deleted_at')
      .not('deleted_at', 'is', null) // Fetch only deleted items
      .order('created_at', { ascending: false })
    
    if (data) setDeletedProducts(data)
    if (error) {
        console.error('Error fetching deleted products:', error)
        toast.error('Failed to load recycle bin. Ensure "deleted_at" column exists.')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchDeletedProducts()
  }, [])

  const handleRestore = async (id: string) => {
      const { error } = await supabase
        .from('products')
        .update({ 
            deleted_at: null,
            is_active: true // Keep both in sync for now
        })
        .eq('id', id)
      
      if (error) {
          toast.error('Error restoring product')
      } else {
          toast.success('Product restored successfully')
          setDeletedProducts(deletedProducts.filter(p => p.id !== id))
      }
  }

  const handlePermanentDelete = async () => {
      if (!itemToDelete) return

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', itemToDelete)
      
      if (error) {
          toast.error('Error deleting product permanently')
      } else {
          toast.success('Product deleted permanently')
          setDeletedProducts(deletedProducts.filter(p => p.id !== itemToDelete))
          setSelectedItems(prev => prev.filter(id => id !== itemToDelete))
      }
      
      setConfirmAction(null)
      setItemToDelete(null)
  }

  const handleBulkRestore = async () => {
    if (!selectedItems.length) return
    const { error } = await supabase.from('products').update({ deleted_at: null, is_active: true }).in('id', selectedItems)
    
    if (error) {
        toast.error('Error restoring products')
    } else {
        toast.success(`${selectedItems.length} products restored`)
        setDeletedProducts(deletedProducts.filter(p => !selectedItems.includes(p.id)))
        setSelectedItems([])
    }
  }

  const handleBulkDelete = async () => {
    if (!selectedItems.length) return
    const { error } = await supabase.from('products').delete().in('id', selectedItems)
    
    if (error) {
        toast.error('Error deleting products permanently')
    } else {
        toast.success(`${selectedItems.length} products deleted permanently`)
        setDeletedProducts(deletedProducts.filter(p => !selectedItems.includes(p.id)))
        setSelectedItems([])
    }
    setConfirmAction(null)
  }

  const handleEmptyTrash = async () => {
    const { error } = await supabase.from('products').delete().not('deleted_at', 'is', null)
    
    if (error) {
        toast.error('Error emptying trash')
    } else {
        toast.success('Trash emptied successfully')
        setDeletedProducts([])
        setSelectedItems([])
    }
    setConfirmAction(null)
  }

  const toggleSelectAll = () => {
      if (selectedItems.length === deletedProducts.length) {
          setSelectedItems([])
      } else {
          setSelectedItems(deletedProducts.map(p => p.id))
      }
  }

  const toggleSelect = (id: string) => {
      setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  if (loading) return <ChickenLoader mode="dashboard" />

  return (
    <div className="space-y-6">
      <ConfirmDialog 
        isOpen={confirmAction !== null}
        onClose={() => {
            setConfirmAction(null)
            setItemToDelete(null)
        }}
        onConfirm={() => {
            if (confirmAction === 'single') handlePermanentDelete()
            else if (confirmAction === 'bulk_delete') handleBulkDelete()
            else if (confirmAction === 'empty_trash') handleEmptyTrash()
        }}
        title="Permanently Delete?"
        description="This action cannot be undone. The product(s) will be removed from the database forever."
        confirmText="Delete Forever"
        variant="destructive"
      />
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
            <Link href="/inventory/breeds">
                <AnimatedButton variant="outline" size="icon" className="rounded-xl h-12 w-12 bg-white dark:bg-card border-none shadow-md">
                    <ArrowLeft className="h-5 w-5" />
                </AnimatedButton>
            </Link>
            <div>
                <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4">
                    <Trash2 className="h-10 w-10 text-red-500" />
                    سلة المحذوفات
                </h1>
                <p className="text-muted-foreground font-black">استعادة العناصر المحذوفة أو إزالتها نهائياً من النظام.</p>
            </div>
        </div>
        
        {deletedProducts.length > 0 && (
            <AnimatedButton 
                variant="outline" 
                onClick={() => setConfirmAction('empty_trash')}
                className="rounded-xl h-12 px-6 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-black border-red-200"
            >
                <Trash2 className="h-5 w-5 ms-2" /> تفريغ السلة
            </AnimatedButton>
        )}
      </div>

      <Card className="border-none shadow-xl rounded-xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="p-4 md:p-8 md:pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-xl font-black">العناصر المحذوفة ({deletedProducts.length})</CardTitle>
            {selectedItems.length > 0 && (
                <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-xl border border-border/50">
                    <span className="text-xs font-black text-muted-foreground px-3">
                        {selectedItems.length} محدد
                    </span>
                    <AnimatedButton size="sm" onClick={handleBulkRestore} className="h-9 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-black text-white">
                        <RefreshCcw className="h-4 w-4 ms-2" /> استعادة
                    </AnimatedButton>
                    <AnimatedButton size="sm" variant="ghost" onClick={() => setConfirmAction('bulk_delete')} className="h-9 px-4 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 font-black">
                        <Trash2 className="h-4 w-4 ms-2" /> حذف
                    </AnimatedButton>
                </div>
            )}
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/30">
                        <tr>
                            <th className="px-6 py-4 w-12 text-center">
                                <Checkbox 
                                    checked={selectedItems.length === deletedProducts.length && deletedProducts.length > 0} 
                                    onCheckedChange={toggleSelectAll} 
                                />
                            </th>
                            <th className="px-8 py-4">المنتج</th>
                            <th className="px-8 py-4">الفئة</th>
                            <th className="px-8 py-4">السعر</th>
                            <th className="px-8 py-4 text-left">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deletedProducts.map((product) => (
                            <tr key={product.id} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 transition-colors ${selectedItems.includes(product.id) ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : 'hover:bg-emerald-50/10 dark:hover:bg-emerald-900/5'}`}>
                                <td className="px-6 py-5 text-center">
                                    <Checkbox 
                                        checked={selectedItems.includes(product.id)} 
                                        onCheckedChange={() => toggleSelect(product.id)} 
                                    />
                                </td>
                                <td className="px-8 py-5 font-black">
                                    <div className="text-lg">{product.name_en}</div>
                                    <div className="text-xs text-muted-foreground opacity-50 font-mono">#{product.id.slice(0,8)}</div>
                                </td>
                                <td className="px-8 py-5 capitalize">
                                    <Badge variant="outline" className="rounded-full px-3 py-1 border-emerald-200 bg-emerald-50 text-emerald-600 font-black">{product.subcategory}</Badge>
                                </td>
                                <td className="px-8 py-5 font-black text-lg">{product.price?.toLocaleString()} <span className="text-xs opacity-50">دج</span></td>
                                <td className="px-8 py-5 text-left flex justify-start gap-3">
                                    <AnimatedButton 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-10 rounded-xl px-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 font-black"
                                        onClick={() => handleRestore(product.id)}
                                    >
                                        <RefreshCcw className="h-4 w-4 ms-2" /> استعادة
                                    </AnimatedButton>
                                    <AnimatedButton 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-10 w-10 rounded-xl p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                            setItemToDelete(product.id)
                                            setConfirmAction('single')
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </AnimatedButton>
                                </td>
                            </tr>
                        ))}
                         {deletedProducts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-black opacity-30">
                                    سلة المحذوفات فارغة. أحسنت! ♻️
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden grid gap-0 divide-y divide-border/30 border-t border-border/30">
                {deletedProducts.length > 0 && (
                    <div className="p-4 bg-muted/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Checkbox 
                                checked={selectedItems.length === deletedProducts.length && deletedProducts.length > 0} 
                                onCheckedChange={toggleSelectAll} 
                            />
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">تحديد الكل</span>
                        </div>
                    </div>
                )}
                {deletedProducts.map((product) => (
                    <div key={product.id} className={`p-4 flex gap-4 items-center transition-colors ${selectedItems.includes(product.id) ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''}`}>
                        <Checkbox 
                            checked={selectedItems.includes(product.id)} 
                            onCheckedChange={() => toggleSelect(product.id)} 
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-black truncate leading-none mb-1">{product.name_en}</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase truncate">{product.subcategory}</p>
                            <div className="text-sm font-black mt-1">{product.price?.toLocaleString()} دج</div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                             <AnimatedButton 
                                variant="outline" 
                                size="sm" 
                                className="h-10 w-10 text-emerald-600 border-emerald-200 bg-emerald-50 rounded-xl p-0"
                                onClick={() => handleRestore(product.id)}
                            >
                                <RefreshCcw className="h-4 w-4" />
                            </AnimatedButton>
                            <AnimatedButton 
                                variant="outline" 
                                size="sm" 
                                className="h-10 w-10 text-red-500 border-red-200 bg-red-50 rounded-xl p-0"
                                onClick={() => {
                                    setItemToDelete(product.id)
                                    setConfirmAction('single')
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </AnimatedButton>
                        </div>
                    </div>
                ))}
                {deletedProducts.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground font-black opacity-30">
                        سلة المحذوفات فارغة. ♻️
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

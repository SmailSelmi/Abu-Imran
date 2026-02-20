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

export default function RecycleBinPage() {
  const [deletedProducts, setDeletedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const supabase = createClient()

  // Fetch Deleted Products
  const fetchDeletedProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
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
      }
      
      setConfirmOpen(false)
      setItemToDelete(null)
  }

  if (loading) return <ChickenLoader mode="dashboard" />

  return (
    <div className="space-y-6">
      <ConfirmDialog 
        isOpen={confirmOpen}
        onClose={() => {
            setConfirmOpen(false)
            setItemToDelete(null)
        }}
        onConfirm={handlePermanentDelete}
        title="Permanently Delete?"
        description="This action cannot be undone. The product will be removed from the database forever."
        confirmText="Delete Forever"
        variant="destructive"
      />
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

      <Card className="border-none shadow-xl rounded-xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black">العناصر المحذوفة ({deletedProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/30">
                        <tr>
                            <th className="px-8 py-4">المنتج</th>
                            <th className="px-8 py-4">الفئة</th>
                            <th className="px-8 py-4">السعر</th>
                            <th className="px-8 py-4 text-left">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deletedProducts.map((product) => (
                            <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors">
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
                                        <RefreshCcw className="h-4 w-4 ml-2" /> استعادة
                                    </AnimatedButton>
                                    <AnimatedButton 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-10 w-10 rounded-xl p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                            setItemToDelete(product.id)
                                            setConfirmOpen(true)
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </AnimatedButton>
                                </td>
                            </tr>
                        ))}
                         {deletedProducts.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground font-black opacity-30">
                                    سلة المحذوفات فارغة. أحسنت! ♻️
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

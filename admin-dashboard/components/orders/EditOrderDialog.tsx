'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import type { OrderWithRelations } from '@/types/orders'

interface EditOrderDialogProps {
  order: OrderWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditOrderDialog({ order, open, onOpenChange, onSuccess }: EditOrderDialogProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!order) return

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const updates = {
      status: formData.get('status') as 'pending' | 'shipped' | 'delivered' | 'cancelled',
      product_name: formData.get('product_name') as string,
      quantity: Number(formData.get('quantity')),
      price: Number(formData.get('price')),
      // Calculate total if price/quantity changes? 
      // ideally backend trigger, but let's be explicit
      customer_name: formData.get('customer_name') as string,
      phone_number: formData.get('phone_number') as string,
      wilaya_address: formData.get('wilaya_address') as string,
      total_amount: Number(formData.get('quantity')) * Number(formData.get('price'))
    }

    const { error } = await (supabase as any)
      .from('orders')
      .update(updates as any)
      .eq('id', order.id)

    if (error) {
      toast.error('Failed to update order')
      console.error(error)
    } else {
      toast.success('Order updated successfully')
      onSuccess()
      onOpenChange(false)
    }
    setLoading(false)
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-xl bg-white dark:bg-card overflow-hidden p-0">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-2xl font-black tracking-tighter">تعديل الطلبية #{order.id.slice(0, 8)}</DialogTitle>
          <DialogDescription className="font-black opacity-60">
            قم بتحديث تفاصيل الطلبية. تأكد من صحة البيانات قبل الحفظ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 p-8 pt-6 max-h-[80vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="customer_name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
              اسم الزبون
            </Label>
            <Input
              id="customer_name"
              name="customer_name"
              defaultValue={order.customer_name ?? ''}
              className="h-12 rounded-xl bg-muted/50 border-none font-black"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone_number" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
              رقم الهاتف
            </Label>
            <Input
              id="phone_number"
              name="phone_number"
              defaultValue={order.phone_number ?? ''}
              className="h-12 rounded-xl bg-muted/50 border-none font-black font-mono"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wilaya_address" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
              العنوان / الولاية
            </Label>
            <Input
              id="wilaya_address"
              name="wilaya_address"
              defaultValue={order.wilaya_address ?? ''}
              className="h-12 rounded-xl bg-muted/50 border-none font-black"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product_name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
              المنتج
            </Label>
            <Input
              id="product_name"
              name="product_name"
              defaultValue={order.product_name ?? ''}
              className="h-12 rounded-xl bg-muted/50 border-none font-black"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
              حالة الطلب
            </Label>
             <div>
                <Select name="status" defaultValue={order.status ?? 'pending'}>
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-none font-black ring-0 focus:ring-4 focus:ring-emerald-500/10 transition-all">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl font-black">
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="shipped">تم الشحن</SelectItem>
                    <SelectItem value="delivered">تمت التسليم</SelectItem>
                    <SelectItem value="cancelled">ملغاة</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="quantity" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
                الكمية
                </Label>
                <Input
                id="quantity"
                name="quantity"
                type="number"
                defaultValue={order.quantity ?? 1}
                className="h-12 rounded-xl bg-muted/50 border-none font-black"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">
                السعر الفردي
                </Label>
                <Input
                id="price"
                name="price"
                type="number"
                defaultValue={order.price ?? 0}
                className="h-12 rounded-xl bg-muted/50 border-none font-black"
                />
            </div>
          </div>
         
          <DialogFooter className="p-8 pt-4 border-t border-dashed mt-4">
            <Button type="submit" disabled={loading} className="w-full h-14 rounded-xl bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 font-black text-lg hover:bg-emerald-700">
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

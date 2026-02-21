"use client"
import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Truck, Clock } from "lucide-react"
import { toast } from 'sonner'
import ChickenLoader from "@/components/ui/chicken-loader"
import { Icon } from '@/components/ui/Icon'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

type DeliveryZone = {
  id: string
  name: string
  base_fee: number
  estimated_days: string
  wilayas: string[]
}

export default function DeliveryZonesPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Confirmation Modal State
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const supabase = createClient()
  
  const [formData, setFormData] = useState<Partial<DeliveryZone>>({
    name: '', wilayas: [], base_fee: 500, estimated_days: '1-2'
  })
  
  const [wilayaInput, setWilayaInput] = useState('')

  const fetchZones = React.useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('delivery_zones').select('id, name, base_fee, estimated_days, wilayas').order('name')
    if (error) toast.error('فشل في تحميل المناطق')
    else setZones(data as unknown as DeliveryZone[] || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchZones()
  }, [fetchZones])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
        ...formData,
        base_fee: Number(formData.base_fee),
        wilayas: wilayaInput.split(',').map(w => w.trim()).filter(w => w)
    }

    if (editingId) {
        const { error } = await supabase.from('delivery_zones').update(payload).eq('id', editingId)
        if (error) toast.error('Update failed')
        else { toast.success('Zone updated'); resetForm(); fetchZones(); }
    } else {
        const { error } = await supabase.from('delivery_zones').insert([payload as any])
        if (error) toast.error('Creation failed')
        else { toast.success('Zone created'); resetForm(); fetchZones(); }
    }
  }

  const handleDelete = async () => {
      if(!itemToDelete) return
      const { error } = await supabase.from('delivery_zones').delete().eq('id', itemToDelete)
      if (error) toast.error('Delete failed')
      else { toast.success('Zone deleted'); fetchZones(); }
      
      setConfirmOpen(false)
      setItemToDelete(null)
  }

  const resetForm = () => {
      setIsAdding(false); setEditingId(null);
      setFormData({ name: '', wilayas: [], base_fee: 500, estimated_days: '1-2' });
      setWilayaInput('');
  }

  const handleEdit = (zone: DeliveryZone) => {
      setEditingId(zone.id); setFormData(zone); setWilayaInput(zone.wilayas.join(', ')); setIsAdding(true);
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
        title="Delete Delivery Zone?"
        description="Are you sure you want to delete this delivery zone? This action cannot be undone."
        confirmText="Delete Zone"
        variant="destructive"
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                مناطق التوصيل <span className="bg-emerald-100 text-emerald-600 text-sm font-black px-4 py-1 rounded-full">{zones.length}</span>
            </h1>
            <p className="text-muted-foreground font-black">تحديد الحدود اللوجستية وأسعار التوصيل الإقليمية.</p>
        </div>
        {!isAdding && (
            <Button onClick={() => setIsAdding(true)} className="rounded-xl px-6 h-12 font-black shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="ms-2 h-5 w-5" /> منطقة جديدة
            </Button>
        )}
      </div>

      {isAdding && (
          <Card className="border border-border/40 shadow-sm bg-white dark:bg-zinc-950 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-600" />
               <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-black text-xl">
                       <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Truck className="w-5 h-5" />
                       </div>
                       {editingId ? 'تعديل التكوين' : 'إنشاء حدود لوجستية'}
                  </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                  <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">عنوان المنطقة</Label>
                          <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="مثال: الجزائر العاصمة وضواحيها" className="bg-muted/50 border-none focus:bg-background h-12 rounded-xl font-black" />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">رسوم الشحن (دج)</Label>
                          <Input type="number" required value={formData.base_fee} onChange={e => setFormData({...formData, base_fee: Number(e.target.value)})} className="bg-muted/50 border-none focus:bg-background h-12 rounded-xl font-black" />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">الوقت المتوقع (أيام)</Label>
                          <Input required value={formData.estimated_days} onChange={e => setFormData({...formData, estimated_days: e.target.value})} placeholder="مثال: 24-48 ساعة" className="bg-muted/50 border-none focus:bg-background h-12 rounded-xl font-black" />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">الولايات (مفصولة بفاصلة)</Label>
                          <Input required value={wilayaInput} onChange={e => setWilayaInput(e.target.value)} placeholder="الجزائر، البليدة..." className="bg-muted/50 border-none focus:bg-background h-12 rounded-xl font-black" />
                      </div>
                      
                      <div className="col-span-full flex justify-end gap-3 pt-6 border-t border-dashed mt-4">
                          <Button type="button" variant="ghost" className="rounded-xl px-6 font-black" onClick={resetForm}>إلغاء</Button>
                          <Button type="submit" className="rounded-xl px-10 h-12 font-black shadow-sm shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white border-none">{editingId ? 'تحديث المنطقة' : 'تفعيل المنطقة'}</Button>
                      </div>
                  </form>
              </CardContent>
          </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {zones.map((zone) => (
              <Card key={zone.id} className="group border border-border/40 shadow-sm hover:shadow-sm transition-all duration-500 rounded-xl overflow-hidden bg-white dark:bg-card">
                  <CardHeader className="bg-muted/30 p-6">
                       <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-muted flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                 <Icon src="https://cdn.lordicon.com/wxnxiano.json" trigger="loop" size={32} />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Button variant="ghost" size="icon" className="h-10 w-10 bg-background/50 backdrop-blur shadow-sm rounded-xl" onClick={() => handleEdit(zone)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                                 <Button variant="ghost" size="icon" className="h-10 w-10 bg-background/50 backdrop-blur shadow-sm text-red-500 rounded-xl" onClick={() => {
                                     setItemToDelete(zone.id)
                                     setConfirmOpen(true)
                                 }}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                       </div>
                       <CardTitle className="text-2xl font-black">{zone.name}</CardTitle>
                       <div className="flex items-center gap-4 mt-2">
                            <span className="text-3xl font-black text-emerald-600 tracking-tighter">{zone.base_fee?.toLocaleString()} <span className="text-xs opacity-60">دج</span></span>
                            <Badge variant="outline" className="bg-background/50 border-emerald-500/20 text-emerald-600 font-black flex items-center gap-1">
                                 <Clock className="h-3 w-3" /> {zone.estimated_days}
                            </Badge>
                       </div>
                  </CardHeader>
                   <CardContent className="p-6">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-3 block">الولايات المشمولة</Label>
                      <div className="flex flex-wrap gap-2">
                          {zone.wilayas.map((w, i) => (
                              <Badge key={i} variant="secondary" className="bg-muted/50 text-foreground font-medium rounded-lg px-2 py-1 text-xs border border-transparent group-hover:border-primary/20 transition-colors">
                                  {w}
                              </Badge>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          ))}
      </div>
    </div>
  )
}


'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { TriangleAlert, Loader2, User, Shield, Truck } from 'lucide-react'
import Link from 'next/link'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      toast.error('Failed to update password')
      console.error(error)
    } else {
      toast.success('Password updated successfully!')
      setNewPassword('')
    }
    setLoading(false)
  }

  const handleFactoryReset = async () => {
    setResetLoading(true)
    // Delete all orders to reset stats. We cast to any to bypass TS if needed, or simply delete orders.
    const { error: orderErr } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all

    if (orderErr) {
        toast.error('حدث خطأ أثناء إعادة ضبط النظام')
    } else {
        toast.success('تمت إعادة ضبط النظام بنجاح!')
        setShowResetConfirm(false)
    }
    setResetLoading(false)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-4xl font-black tracking-tighter">الإعدادات</h1>
        <p className="text-muted-foreground font-black">إدارة تفضيلات حسابك وتكوين النظام</p>
      </div>

      <Card className="border-none shadow-xl rounded-xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 font-black text-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <User className="h-5 w-5" />
            </div>
            معلومات الملف الشخصي
          </CardTitle>
          <CardDescription className="font-black opacity-60">تفاصيل حسابك الشخصي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">عنوان البريد الإلكتروني</Label>
            <Input value={user?.email || ''} disabled readOnly className="h-12 rounded-xl bg-muted/50 border-none font-black" />
          </div>
          <div className="grid gap-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">معرف المستخدم</Label>
            <Input value={user?.id || ''} disabled readOnly className="font-mono text-xs h-12 rounded-xl bg-muted/50 border-none" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl rounded-xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="pb-4">
           <CardTitle className="flex items-center gap-3 font-black text-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Shield className="h-5 w-5" />
            </div>
            الأمان والحماية
          </CardTitle>
          <CardDescription className="font-black opacity-60">تحديث كلمة مرور حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
             <div className="grid gap-2">
              <Label htmlFor="new-password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground me-1">كلمة المرور الجديدة</Label>
              <Input 
                id="new-password" 
                type="password" 
                placeholder="أدخل كلمة المرور الجديدة"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
                className="h-12 rounded-xl bg-muted/50 border-none font-black"
              />
            </div>
            <Button type="submit" disabled={loading || !newPassword} className="h-12 px-8 rounded-xl font-black bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700">
              {loading && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
              تحديث كلمة المرور
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="border-none shadow-xl rounded-xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="pb-4">
           <CardTitle className="flex items-center gap-3 font-black text-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Truck className="h-5 w-5" />
            </div>
            الخدمات اللوجستية
          </CardTitle>
          <CardDescription className="font-black opacity-60">إدارة مناطق التوصيل والرسوم</CardDescription>
        </CardHeader>
        <CardContent>
            <Link href="/settings/zones">
                <AnimatedButton variant="outline" className="w-full justify-start h-14 rounded-xl border-dashed border-2 hover:border-emerald-500 hover:bg-emerald-50 font-black text-lg">
                    <Truck className="ms-3 h-5 w-5 text-emerald-600" /> إعداد مناطق التوصيل
                </AnimatedButton>
            </Link>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl rounded-xl bg-red-50 dark:bg-red-950/20 overflow-hidden ring-1 ring-red-200 dark:ring-red-900 border border-red-100">
        <CardHeader className="pb-4">
           <CardTitle className="flex items-center gap-3 font-black text-xl text-red-600">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <TriangleAlert className="h-5 w-5" />
            </div>
            منطقة الخطر (إعادة ضبط المصنع)
          </CardTitle>
          <CardDescription className="font-black opacity-80 text-red-800 dark:text-red-300">
            تحذير: هذا الإجراء سيقوم بحذف جميع الطلبيات والإشعارات، وتصفير إيرادات النظام. لا يمكن التراجع عن هذا الإجراء.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <AnimatedButton 
                variant="outline" 
                onClick={() => setShowResetConfirm(true)}
                className="w-full justify-center h-14 rounded-xl border-dashed border-2 hover:border-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 font-black text-lg transition-colors"
                disabled={resetLoading}
            >
                {resetLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><TriangleAlert className="ms-3 h-5 w-5" /> مسح بيانات النظام والطلبيات</>}
            </AnimatedButton>
        </CardContent>
      </Card>

      <ConfirmDialog 
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleFactoryReset}
        title="إعادة ضبط المصنع؟"
        description="هل أنت متأكد من رغبتك في حذف كافة الطلبيات، الإشعارات، وتصفير الإيرادات بالكامل؟ لا يمكن استرجاع البيانات بعد هذه الخطوة."
        confirmText="نعم، احذف كل شيء!"
        variant="destructive"
      />
    </div>
  )
}

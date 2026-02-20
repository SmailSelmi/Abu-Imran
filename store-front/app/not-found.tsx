import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full">
            <div className="w-32 h-32 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-emerald-500/10">
                <FileQuestion className="w-16 h-16 text-emerald-600" />
            </div>
            <h2 className="text-7xl font-black tracking-tighter text-foreground mb-4">404</h2>
            <p className="text-xl text-muted-foreground font-bold mb-8">Page not found.</p>
            <p className="text-muted-foreground mb-10 leading-relaxed max-w-sm mx-auto">
                The page you are looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
            <Link href="/">
                <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">
                    Return to Farm Home
                </Button>
            </Link>
        </div>
    </div>
  )
}

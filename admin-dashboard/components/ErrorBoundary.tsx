'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full text-center space-y-8 p-12 glass-card rounded-xl border-red-500/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-red-600" />
            
            <div className="w-24 h-24 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tighter text-foreground">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground font-medium leading-relaxed">
                عذراً، حدث خطأ غير متوقع في لوحة التحكم.
              </p>
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-muted/50 rounded-xl text-left overflow-auto max-h-32 text-xs font-mono border border-border">
                  {this.state.error?.toString()}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 pt-6">
              <Button 
                onClick={() => window.location.reload()}
                className="h-14 rounded-xl bg-foreground text-background hover:bg-emerald-600 hover:text-white transition-all font-black uppercase tracking-widest text-sm"
              >
                <RotateCcw className="w-4 h-4 me-2" />
                Try Again / المحاولة مرة أخرى
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="h-14 rounded-xl border-none bg-muted/50 hover:bg-muted font-bold transition-all"
              >
                <Home className="w-4 h-4 me-2" />
                Main Dashboard / لوحة التحكم
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

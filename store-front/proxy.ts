import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { logger } from '@/lib/logger'

// Simple in-memory rate limit map (for demonstration/per-instance)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_THRESHOLD = 50 // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute

export async function proxy(request: NextRequest) {
  const ip = (request as any).ip || request.headers.get('x-forwarded-for') || 'anonymous'
  const path = request.nextUrl.pathname
  const now = Date.now()

  // 1. Basic Rate Limiting for API routes
  if (path.startsWith('/api')) {
    const record = rateLimitMap.get(ip) || { count: 0, lastReset: now }
    
    if (now - record.lastReset > RATE_LIMIT_WINDOW) {
      record.count = 1
      record.lastReset = now
    } else {
      record.count++
    }
    
    rateLimitMap.set(ip, record)

    if (record.count > RATE_LIMIT_THRESHOLD) {
      logger.warn(`Rate limit exceeded for IP: ${ip} on path: ${path}`, 'Middleware')
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  // 2. Request Logging
  logger.info(`${request.method} ${path}`, 'Request')

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session and trying to access protected route, redirect to login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard/')) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If session exists, get user profile
  if (session?.user?.id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Redirect based on role restrictions
    if (profile?.role) {
      if (
        req.nextUrl.pathname.startsWith('/dashboard/admin') &&
        profile.role !== 'admin'
      ) {
        // Redirect to correct dashboard based on actual role
        const redirectPath = profile.role === 'helper' ? '/dashboard/provider' :
                           profile.role === 'user' ? '/dashboard/customer' : '/login'
        const redirectUrl = new URL(redirectPath, req.url)
        return NextResponse.redirect(redirectUrl)
      }

      if (
        req.nextUrl.pathname.startsWith('/dashboard/provider') &&
        profile.role !== 'helper'
      ) {
        // Redirect to correct dashboard based on actual role
        const redirectPath = profile.role === 'admin' ? '/dashboard/admin' :
                           profile.role === 'user' ? '/dashboard/customer' : '/login'
        const redirectUrl = new URL(redirectPath, req.url)
        return NextResponse.redirect(redirectUrl)
      }

      if (
        req.nextUrl.pathname.startsWith('/dashboard/customer') &&
        profile.role !== 'user'
      ) {
        // Redirect to correct dashboard based on actual role
        const redirectPath = profile.role === 'admin' ? '/dashboard/admin' :
                           profile.role === 'helper' ? '/dashboard/provider' : '/login'
        const redirectUrl = new URL(redirectPath, req.url)
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     * - auth callback
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api|auth/callback).*)',
  ],
}

import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )
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

    const typedProfile = profile as { role: 'user' | 'helper' | 'admin' } | null

    // Redirect based on role restrictions
    if (typedProfile?.role) {
      if (
        req.nextUrl.pathname.startsWith('/dashboard/admin') &&
        typedProfile.role !== 'admin'
      ) {
        // Redirect to correct dashboard based on actual role
        const redirectPath = typedProfile.role === 'helper' ? '/dashboard/provider' :
                           typedProfile.role === 'user' ? '/dashboard/customer' : '/login'
        const redirectUrl = new URL(redirectPath, req.url)
        return NextResponse.redirect(redirectUrl)
      }

      if (
        req.nextUrl.pathname.startsWith('/dashboard/provider') &&
        typedProfile.role !== 'helper'
      ) {
        // Redirect to correct dashboard based on actual role
        const redirectPath = typedProfile.role === 'admin' ? '/dashboard/admin' :
                           typedProfile.role === 'user' ? '/dashboard/customer' : '/login'
        const redirectUrl = new URL(redirectPath, req.url)
        return NextResponse.redirect(redirectUrl)
      }

      if (
        req.nextUrl.pathname.startsWith('/dashboard/customer') &&
        typedProfile.role !== 'user'
      ) {
        // Redirect to correct dashboard based on actual role
        const redirectPath = typedProfile.role === 'admin' ? '/dashboard/admin' :
                           typedProfile.role === 'helper' ? '/dashboard/provider' : '/login'
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

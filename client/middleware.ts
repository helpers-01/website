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
  if (!session && (
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/provider') ||
    req.nextUrl.pathname.startsWith('/customer')
  )) {
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
        req.nextUrl.pathname.startsWith('/admin') && 
        profile.role !== 'admin'
      ) {
        const redirectUrl = new URL('/', req.url)
        return NextResponse.redirect(redirectUrl)
      }
      
      if (
        req.nextUrl.pathname.startsWith('/provider') && 
        profile.role !== 'provider'
      ) {
        const redirectUrl = new URL('/', req.url)
        return NextResponse.redirect(redirectUrl)
      }

      if (
        req.nextUrl.pathname.startsWith('/customer') && 
        profile.role !== 'customer'
      ) {
        const redirectUrl = new URL('/', req.url)
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
     * - login page
     */
    '/((?!_next/static|_next/image|favicon.ico|public|login).*)',
  ],
}

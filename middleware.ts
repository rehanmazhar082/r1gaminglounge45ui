import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for a public file
  const isPublicFile = req.nextUrl.pathname.startsWith('/_next') || 
                       req.nextUrl.pathname.startsWith('/static') ||
                       req.nextUrl.pathname === '/favicon.ico'

  if (!session && !isPublicFile && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/signup') {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}


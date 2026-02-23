// 📁 middleware.ts
// Protects /dashboard, /learn, /my-courses, /assignments, /certificates (student)
// and /admin/** (admin only).
// Public routes (/, /courses, /placement-test, /login, /signup) are open.

import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const STUDENT_PATHS = ['/dashboard', '/learn', '/my-courses', '/assignments', '/certificates', '/test']
const ADMIN_PATHS   = ['/admin']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isStudentPath = STUDENT_PATHS.some((p) => pathname.startsWith(p))
  const isAdminPath   = ADMIN_PATHS.some((p) => pathname.startsWith(p))

  // Unauthenticated → redirect to login
  if ((isStudentPath || isAdminPath) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Non-admin trying to access admin pages → redirect to dashboard
  if (isAdminPath && user) {
    // We need the role — fetch it via the service key or rely on JWT claim
    // Here we redirect to dashboard; the admin layout does a server-side role check too.
    const role = user.user_metadata?.role ?? 'student'
    if (role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Authenticated user visiting /login or /signup → redirect to dashboard
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
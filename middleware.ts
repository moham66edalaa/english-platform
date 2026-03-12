// 📁 middleware.ts
// Protects /dashboard, /learn, /my-courses, /assignments, /certificates, /test (student)
// /owner/** (owner only), and /teacher/** (teacher + owner).
// Public routes (/, /courses, /placement-test, /login, /signup) are open.

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const STUDENT_PATHS = ['/dashboard', '/learn', '/my-courses', '/assignments', '/certificates', '/test']
const OWNER_PATHS   = ['/owner']
const TEACHER_PATHS = ['/teacher']

export async function middleware(request: NextRequest) {
  // 1. Create Supabase client and refresh session
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isStudentPath = STUDENT_PATHS.some((p) => pathname.startsWith(p))
  const isOwnerPath   = OWNER_PATHS.some((p) => pathname.startsWith(p))
  const isTeacherPath = TEACHER_PATHS.some((p) => pathname.startsWith(p))
  const isProtected   = isStudentPath || isOwnerPath || isTeacherPath
  const isAuthPage    = pathname === '/login' || pathname === '/signup'

  // 2. Unauthenticated → redirect to login
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // 3. For role-based checks, fetch role from public.users table
  if (user && (isOwnerPath || isTeacherPath || isAuthPage)) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? 'student'

    // Non-owner trying to access owner pages → redirect to dashboard
    if (isOwnerPath && role !== 'owner') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Non-teacher/non-owner trying to access teacher pages → redirect to dashboard
    if (isTeacherPath && role !== 'teacher' && role !== 'owner') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Authenticated user visiting /login or /signup → redirect based on role
    if (isAuthPage) {
      const url = request.nextUrl.clone()
      if (role === 'owner') {
        url.pathname = '/owner'
      } else if (role === 'teacher') {
        url.pathname = '/teacher'
      } else {
        url.pathname = '/dashboard'
      }
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

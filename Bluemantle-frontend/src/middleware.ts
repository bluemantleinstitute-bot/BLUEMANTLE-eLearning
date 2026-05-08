import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Bluemantle Route Protection Middleware
 * 
 * This middleware ensures that:
 * 1. Unauthenticated users are redirected to the login page if they try to access protected dashboards.
 * 2. Authenticated users are redirected away from the login page to their respective dashboard.
 * 3. Role-based access is enforced (e.g., Students cannot access /admin).
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('user_role')?.value
  const { pathname } = request.nextUrl

  // Define protected route segments and their authorized roles
  const protectedRoutes = [
    { prefix: '/student', roles: ['student'] },
    { prefix: '/teacher', roles: ['teacher'] },
    { prefix: '/admin', roles: ['admin', 'owner'] },
  ]

  const matchedRoute = protectedRoutes.find(route => pathname.startsWith(route.prefix))

  // CASE 1: ACCESSING PROTECTED ROUTE WITHOUT TOKEN
  if (matchedRoute && !token) {
    console.log(`[Middleware] Unauthorized access to ${pathname}. Redirecting to Login.`);
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // CASE 2: LOGGED IN USER TRYING TO ACCESS LOGIN PAGE
  if (pathname === '/' && token && role) {
    console.log(`[Middleware] Authenticated user on Login page. Redirecting to ${role} dashboard.`);
    const url = request.nextUrl.clone()
    if (role === 'student') url.pathname = '/student'
    else if (role === 'teacher') url.pathname = '/teacher'
    else if (role === 'admin' || role === 'owner') url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // CASE 3: ROLE MISMATCH (e.g. Student trying to access /admin)
  if (matchedRoute && token && role) {
    if (!matchedRoute.roles.includes(role)) {
      console.warn(`[Middleware] Role mismatch for ${pathname}. User role: ${role}. Redirecting to correct dashboard.`);
      const url = request.nextUrl.clone()
      if (role === 'student') url.pathname = '/student'
      else if (role === 'teacher') url.pathname = '/teacher'
      else if (role === 'admin' || role === 'owner') url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Matcher config: Apply middleware to all dashboard routes and the root login page
export const config = {
  matcher: [
    '/student/:path*', 
    '/teacher/:path*', 
    '/admin/:path*', 
    '/'
  ],
}

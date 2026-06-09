import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    'https://dvecqeblvsvbuqtedwmj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2ZWNxZWJsdnN2YnVxdGVkd21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzA2MDAsImV4cCI6MjA5NjU0NjYwMH0.9NbZ_9g0dZpGWxMX4pvAtG5MMPHOLp3C-cs6WCSbUFc',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Define route categories
  const authRoutes = ['/login', '/signup', '/expert/login', '/forgot-password', '/update-password'];
  const protectedRoutePrefixes = ['/expert/dashboard', '/expert/profile', '/expert/bookings', '/dashboard'];

  const isAuthRoute = authRoutes.includes(url.pathname);
  const isProtectedRoute = protectedRoutePrefixes.some(prefix => url.pathname.startsWith(prefix));

  // If the user is logged in and trying to access auth pages (login/signup), redirect them to dashboard
  if (user && isAuthRoute) {
    url.pathname = '/expert/dashboard'
    return NextResponse.redirect(url)
  }

  // If the user is NOT logged in and trying to access a protected route, redirect them to login
  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

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
  const protectedRoutePrefixes = ['/expert/dashboard', '/expert/profile', '/expert/bookings', '/dashboard', '/admin'];

  const isAuthRoute = authRoutes.includes(url.pathname);
  const isProtectedRoute = protectedRoutePrefixes.some(prefix => url.pathname.startsWith(prefix));

  // If the user is NOT logged in and trying to access a protected route, redirect them to login
  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If the user is logged in and trying to access auth pages (login/signup), redirect them to dashboard
  if (user && isAuthRoute) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Role-based protection for authenticated users
  if (user) {
    let role = user.user_metadata?.role;

    // Database check fallback to ensure experts are correctly identified
    if (role !== 'expert') {
      const { data: eData } = await supabase
        .from('expert_profiles')
        .select('id')
        .eq('id', user.id)
        .single();
        
      if (eData) {
        role = 'expert';
        // Update user metadata to avoid hitting the DB in subsequent requests
        await supabase.auth.updateUser({
          data: { role: 'expert' }
        });
      }
    }
    
    // Redirect /dashboard root depending on role
    if (url.pathname === '/dashboard') {
      url.pathname = role === 'expert' ? '/expert/dashboard' : '/dashboard/business';
      return NextResponse.redirect(url);
    }
    
    if (role === 'expert') {
      // Expert is logged in. Prevent access to any business/client dashboard sub-routes, onboarding, bookings, and admin route
      const isBusinessOrDashboardPath = url.pathname.startsWith('/dashboard') || 
                                         url.pathname.startsWith('/admin') ||
                                         url.pathname.startsWith('/onboarding') ||
                                         url.pathname.startsWith('/booking') ||
                                         url.pathname.startsWith('/book');
      if (isBusinessOrDashboardPath) {
        url.pathname = '/expert/dashboard';
        return NextResponse.redirect(url);
      }
    } else {
      // Business/mentee user is logged in. Prevent access to expert dashboard and admin route
      const isExpertOrAdminPath = url.pathname.startsWith('/expert') || 
                                  url.pathname.startsWith('/admin');
      // Except for expert login / signup / callback (handled by authRoutes/public routes)
      const isRestrictedExpertPath = isExpertOrAdminPath && 
                                     !url.pathname.startsWith('/expert/login');
      if (isRestrictedExpertPath) {
        url.pathname = '/dashboard/business';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse
}

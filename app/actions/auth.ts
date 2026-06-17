'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  // Typecasting fields to string, as we know the forms pass strings
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/expert/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Typecasting fields to string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Send a welcome email via Resend if API key is present
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fs = await import('fs');
      const path = await import('path');
      
      const emailTemplatePath = path.join(process.cwd(), 'emails', 'WelcomeEmail.html');
      let htmlContent = fs.readFileSync(emailTemplatePath, 'utf8');
      
      // Basic substitution
      htmlContent = htmlContent.replace(/{{name}}/g, firstName || 'there');
      
      const fromEmail = 'onboarding@resend.dev'; // Default testing email for Resend
      
      await resend.emails.send({
        from: `Sessionly <${fromEmail}>`,
        to: email,
        subject: 'Welcome to Sessionly!',
        html: htmlContent,
      });
    } catch (e) {
      console.error('Failed to send welcome email via Resend:', e);
    }
  }

  // A redirect might not be immediate if email confirmation is required,
  // but for MVP we will redirect to dashboard
  revalidatePath('/', 'layout')
  redirect('/expert/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  
  // Set presence to offline before logging out
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.rpc('update_presence', {
      user_id: user.id,
      online_status: false
    })
  }

  await supabase.auth.signOut()
  redirect('/')
}

export async function sendPasswordResetEmail(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // The redirectTo URL must be registered in your Supabase Auth settings
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/update-password`,
  })

  if (error) {
    return { error: error.message }
  }
  
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/expert/dashboard')
}
export async function signInWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // The user is redirected to Google, not the dashboard
  if (data.url) {
    redirect(data.url)
  }
}

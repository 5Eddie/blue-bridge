'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function getStringField(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function login(formData: FormData) {
  const identity = getStringField(formData, 'email').trim()
  const password = getStringField(formData, 'password')

  if (!identity || !password) {
    redirect('/login?error=' + encodeURIComponent('Email or phone and password are required.'))
  }

  const supabase = await createClient()
  const credentials = identity.includes('@')
    ? { email: identity, password }
    : { phone: identity, password }
  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup(formData: FormData) {
  const displayName = getStringField(formData, 'display_name').trim()
  const email = getStringField(formData, 'email').trim()
  const password = getStringField(formData, 'password')
  const requestedRole = getStringField(formData, 'role')

  if (!['tourist', 'buyer', 'local'].includes(requestedRole)) {
    redirect('/login?error=' + encodeURIComponent('Choose a valid account type.'))
  }
  const role = requestedRole

  if (!displayName || !email || !password) {
    redirect('/login?error=' + encodeURIComponent('Name, email, and password are required.'))
  }

  if (password.length < 6) {
    redirect('/login?error=' + encodeURIComponent('Password must be at least 6 characters.'))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, role },
    },
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  redirect(
    '/login?message=' +
      encodeURIComponent('Check your email to confirm your account.')
  )
}

export async function forgotPassword(formData: FormData) {
  const email = getStringField(formData, 'email').trim()

  if (!email || !email.includes('@')) {
    redirect('/login?error=' + encodeURIComponent('Enter a valid email address to reset your password.'))
  }

  const requestHeaders = await headers()
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    requestHeaders.get('origin') ||
    'http://localhost:3000'
  const callbackUrl = new URL('/auth/callback', siteUrl)
  callbackUrl.searchParams.set('next', '/login?recovery=1')
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl.toString(),
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  redirect(
    '/login?message=' +
      encodeURIComponent('If an account exists for that email, a reset link is on its way.')
  )
}

export async function updatePassword(formData: FormData) {
  const password = getStringField(formData, 'password')
  const confirmation = getStringField(formData, 'password_confirmation')

  if (password.length < 6) {
    redirect('/login?recovery=1&error=' + encodeURIComponent('Password must be at least 6 characters.'))
  }
  if (password !== confirmation) {
    redirect('/login?recovery=1&error=' + encodeURIComponent('Passwords do not match.'))
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login?error=' + encodeURIComponent('Your reset link has expired. Request a new one.'))
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    redirect('/login?recovery=1&error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function socialLogin(formData: FormData) {
  const provider = getStringField(formData, 'provider')
  if (provider !== 'google' && provider !== 'facebook') {
    redirect('/login?error=' + encodeURIComponent('That sign-in provider is not supported.'))
  }

  const requestHeaders = await headers()
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    requestHeaders.get('origin') ||
    'http://localhost:3000'
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: new URL('/auth/callback', siteUrl).toString(),
    },
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (!data.url) {
    redirect('/login?error=' + encodeURIComponent('Unable to start social sign-in.'))
  }

  redirect(data.url)
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

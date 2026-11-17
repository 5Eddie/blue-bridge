'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function getStringField(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export async function login(formData: FormData) {
  const email = getStringField(formData, 'email').trim()
  const password = getStringField(formData, 'password')

  if (!email || !password) {
    redirect('/login?error=' + encodeURIComponent('Email and password are required.'))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

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
  const role = getStringField(formData, 'role') === 'local' ? 'local' : 'traveler'

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

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/account?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

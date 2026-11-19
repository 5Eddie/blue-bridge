import { redirect } from 'next/navigation'
import { logout } from '@/app/login/actions'
import { createClient } from '@/lib/supabase/server'

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (!user) {
    redirect('/login?message=' + encodeURIComponent('Please log in to view your account.'))
  }

  const displayName =
    typeof user.user_metadata?.display_name === 'string'
      ? user.user_metadata.display_name
      : user.email
  const role =
    user.user_metadata?.role === 'local'
      ? 'Herder family / host'
      : user.user_metadata?.role === 'buyer'
        ? 'Buyer'
        : 'Tourist'

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Your account</h1>

      <section className="space-y-2 rounded-lg border border-neutral-300 p-5">
        <p>
          <span className="font-semibold">Name:</span> {displayName}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {role}
        </p>
      </section>

      <form action={logout}>
        <button className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-neutral-900 hover:bg-amber-400">
          Log out
        </button>
      </form>
    </main>
  )
}
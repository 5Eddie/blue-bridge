import { login, signup } from './actions'

const input =
  'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900'
const button =
  'w-full rounded-lg bg-amber-500 px-4 py-2 font-semibold text-neutral-900 hover:bg-amber-400'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <main className="mx-auto grid max-w-4xl gap-10 p-6 md:grid-cols-2">
      <h1 className="text-3xl font-bold md:col-span-2">🌉 Blue Bridge</h1>

      {error && (
        <p className="rounded-lg bg-red-100 p-3 text-red-800 md:col-span-2">{error}</p>
      )}
      {message && (
        <p className="rounded-lg bg-green-100 p-3 text-green-800 md:col-span-2">{message}</p>
      )}

      <form action={login} className="space-y-3">
        <h2 className="text-xl font-semibold">Log in</h2>
        <input className={input} name="email" type="email" placeholder="Email" required />
        <input className={input} name="password" type="password" placeholder="Password" required />
        <button className={button}>Log in</button>
      </form>

      <form action={signup} className="space-y-3">
        <h2 className="text-xl font-semibold">Create account</h2>
        <input className={input} name="display_name" placeholder="Your name" required />
        <input className={input} name="email" type="email" placeholder="Email" required />
        <input
          className={input}
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          minLength={6}
          required
        />
        <select className={input} name="role" defaultValue="traveler">
          <option value="traveler">I am a traveler</option>
          <option value="local">I am a local (guide, driver, host, herder)</option>
        </select>
        <button className={button}>Sign up</button>
      </form>
    </main>
  )
}
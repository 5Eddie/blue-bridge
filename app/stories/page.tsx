import { getStories } from '@/lib/queries'
import StoryCard from '@/components/StoryCard'

// Owner: Urnaa. Uses mock data until Eddie connects Supabase.
export default async function StoriesPage() {
  const stories = await getStories()
  return (
    <main className="bb-wrap">
      <h1 className="bb-h2">Traveler stories and budgets</h1>
      <div className="bb-grid">
        {stories.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
    </main>
  )
}
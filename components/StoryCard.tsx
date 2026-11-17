import Link from 'next/link'
import type { Story } from '@/lib/types'

// Owner: Urnaa
export default function StoryCard({ story }: { story: Story }) {
  return (
    <article className="bb-card">
      <h3>
        <Link href={`/stories/${story.id}`}>{story.title}</Link>
      </h3>
      <p>
        {story.days} days · ${story.cost_per_day} a day
      </p>
    </article>
  )
}
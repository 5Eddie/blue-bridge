import Link from 'next/link'
import type { Listing } from '@/lib/types'

// Owner: Urnaa
export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="bb-card">
      <h3>
        <Link href={`/listings/${listing.id}`}>{listing.title}</Link>
      </h3>
      <p>
        {listing.type} · {listing.regions.join(', ')}
      </p>
    </article>
  )
}
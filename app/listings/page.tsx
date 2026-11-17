import { getListings } from '@/lib/queries'
import ListingCard from '@/components/ListingCard'

// Owner: Urnaa. Uses mock data until Eddie connects Supabase.
export default async function ListingsPage() {
  const listings = await getListings()
  return (
    <main className="bb-wrap">
      <h1 className="bb-h2">Guides, drivers, hosts and tours</h1>
      <div className="bb-grid">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </main>
  )
}
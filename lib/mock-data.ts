import type { Listing, Story } from './types'

// Owner: Eddie. Fake data so Urnaa can build screens before Supabase is connected.
export const mockListings: Listing[] = [
  { id: 'l1', owner_id: 'u1', type: 'guide', title: 'Gobi guide, English and German', description: 'Sample listing.', regions: ['gobi', 'orkhon'], budget: 'low', languages: ['en', 'de', 'mn'], start_date: null, end_date: null, spots_left: null, photos: [], status: 'approved', created_at: '2026-11-01' },
  { id: 'l2', owner_id: 'u2', type: 'tour', title: 'Horseback tour, Orkhon Valley', description: 'Sample listing.', regions: ['orkhon'], budget: 'mid', languages: ['en', 'mn'], start_date: '2027-07-01', end_date: '2027-07-10', spots_left: 4, photos: [], status: 'approved', created_at: '2026-11-02' },
  { id: 'l3', owner_id: 'u3', type: 'host', title: 'Apartment in Ulaanbaatar', description: 'Sample listing.', regions: ['ub'], budget: 'low', languages: ['en', 'mn'], start_date: null, end_date: null, spots_left: null, photos: [], status: 'approved', created_at: '2026-11-03' },
]

export const mockStories: Story[] = [
  { id: 's1', author_id: 'u4', title: 'Gobi on a budget', body: 'Sample story.', region: 'gobi', season: 'summer', budget: 'low', style: 'solo', interests: ['horse', 'photo'], days: 12, cost_per_day: 42, video_url: null, photos: [], status: 'approved', created_at: '2026-11-01' },
  { id: 's2', author_id: 'u5', title: 'Two nights with a reindeer family', body: 'Sample story.', region: 'khuvsgul', season: 'summer', budget: 'mid', style: 'pair', interests: ['trek', 'culture'], days: 9, cost_per_day: 65, video_url: null, photos: [], status: 'approved', created_at: '2026-11-02' },
]
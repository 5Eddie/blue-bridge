import type { Listing, Story, TripPreferences } from './types'

// Owner: Eddie. Simple rule-based scoring (no AI). Higher score = better match.

export function scoreStory(p: TripPreferences, s: Story): number {
  return (
    (s.region === p.region ? 3 : 0) +
    (s.budget === p.budget ? 2 : 0) +
    (s.season === p.season ? 1 : 0) +
    (s.style === p.style ? 1 : 0) +
    s.interests.filter((i) => p.interests.includes(i)).length
  )
}

export function scoreListing(p: TripPreferences, l: Listing): number {
  return (p.region && l.regions.includes(p.region) ? 3 : 0) + (l.budget === p.budget ? 2 : 0)
}
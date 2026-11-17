import { mockListings, mockStories } from './mock-data'
import type { Listing, Story } from './types'

// Owner: Eddie. TODO: replace the mock data with Supabase queries (createClient from lib/supabase/server).
// Urnaa can call these functions today; the signatures must stay the same.

export async function getListings(): Promise<Listing[]> {
  return mockListings
}

export async function getListing(id: string): Promise<Listing | null> {
  return mockListings.find((l) => l.id === id) ?? null
}

export async function getStories(): Promise<Story[]> {
  return mockStories
}

export async function getStory(id: string): Promise<Story | null> {
  return mockStories.find((s) => s.id === id) ?? null
}
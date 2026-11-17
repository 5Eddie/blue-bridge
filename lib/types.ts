// Shared contract between Eddie (back end) and Urnaa (front end).
// Mirrors schema.sql. Change it together, never alone.

export type Region = 'gobi' | 'khuvsgul' | 'altai' | 'orkhon' | 'ub'
export type Season = 'summer' | 'autumn' | 'winter' | 'spring'
export type Budget = 'low' | 'mid' | 'high'
export type Style = 'solo' | 'pair' | 'friends' | 'buddy'
export type Interest = 'horse' | 'trek' | 'culture' | 'photo'
export type ListingType = 'guide' | 'driver' | 'host' | 'tour' | 'buddy'
export type Status = 'pending' | 'approved' | 'hidden'

export interface Listing {
  id: string
  owner_id: string
  type: ListingType
  title: string
  description: string
  regions: Region[]
  budget: Budget | null
  languages: string[]
  start_date: string | null
  end_date: string | null
  spots_left: number | null
  photos: string[]
  status: Status
  created_at: string
}

export interface Story {
  id: string
  author_id: string
  title: string
  body: string
  region: Region | null
  season: Season | null
  budget: Budget | null
  style: Style | null
  interests: Interest[]
  days: number | null
  cost_per_day: number | null
  video_url: string | null
  photos: string[]
  status: Status
  created_at: string
}

export interface TripPreferences {
  region: Region | null
  season: Season | null
  budget: Budget | null
  style: Style | null
  interests: Interest[]
}

export interface ActionResult {
  ok: boolean
  error?: string
}
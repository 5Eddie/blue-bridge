import type { MetadataRoute } from 'next'

// Owner: Urnaa. Makes the site installable like an app (PWA). Add icons later.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Blue Bridge Mongolia',
    short_name: 'Blue Bridge',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F4EE',
    theme_color: '#1F5FA8',
    icons: [],
  }
}
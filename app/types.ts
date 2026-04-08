export type MediaType = 'Image' | 'Video' | 'Audio' | 'URL'

export const MEDIA_TYPES: readonly MediaType[] = [
  'Image',
  'Video',
  'Audio',
  'URL'
] as const

export interface ScreenConfig {
  configurationEid: string
  screenGroupEid: string
  screenEid: string
  publishedAt: string
  updateInterval: number
  schedules: Schedule[]
}

export interface Schedule {
  eid: string
  crontab: string
  cleanup: boolean
  duration?: number // Seconds active after cron tick; absent = unlimited.
  ordinal: number
  validFrom?: string
  validTo?: string
  layoutEid: string
  name: string
  width: number // 0 = fullscreen.
  height: number // 0 = fullscreen.
  layoutPlaylists: LayoutPlaylist[]
}

export interface LayoutPlaylist {
  eid: string
  playlistEid: string
  name: string
  left: number
  top: number
  width: number
  height: number
  inPixels: boolean // false = percentages (0–100); true = pixels.
  zindex: number
  loop: boolean
  validFrom?: string
  validTo?: string
  playlistMedias: PlaylistMedia[]
}

export interface PlaylistMedia {
  playlistMediaEid: string
  mediaEid: string
  ordinal: number
  type: MediaType
  duration?: number // Seconds; for Image/URL (Video/Audio play to end).
  delay: number // Seconds before starting.
  mute: boolean
  stretch: boolean // true = object-fit: fill; false = contain.
  file: string // CDN URL (fileDO from API, normalized on load).
  name: string
  url?: string // External web URL — used for URL type only.
  width?: number
  height?: number
  validFrom?: string
  validTo?: string
}

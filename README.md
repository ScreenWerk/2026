# Screenwerk Player

A digital signage player built with Nuxt 4. Fetches a screen configuration from a CDN, resolves the active schedule by cron expression, and plays media (image, video, audio, URL) across one or more layout zones.

## Architecture

```
ScreenConfig
  └── Schedule       — cron-based activation, optional duration window
        └── LayoutPlaylist  — positioned zone on screen (px or %)
              └── PlaylistMedia  — image / video / audio / URL with validity window
```

The active schedule is resolved by finding the most recent past cron tick and checking optional `duration` and `validFrom`/`validTo` windows. Layout playlists and playlist media are filtered the same way in real time.

## Config

Set `NUXT_PUBLIC_API_BASE` to point at your CDN (default: `https://files.screenwerk.ee`).

The player fetches `{apiBase}/screen/{screenId}.json` and refreshes on the interval defined in the config (`updateInterval` minutes).

## Offline / PWA

Media files are proactively cached via the Cache API after each config load. The service worker (Workbox) serves configs via NetworkFirst and media via CacheFirst, enabling full offline playback.

## Dev

```sh
npm install
npm run dev        # dev server
npm run generate   # static build + PWA
npm run lint       # ESLint with auto-fix
```

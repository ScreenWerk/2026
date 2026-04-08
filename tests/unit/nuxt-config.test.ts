import { describe, expect, it, vi } from 'vitest'

// (*SW:Plateau*)

// defineNuxtConfig is a Nuxt auto-imported global (not an explicit import).
// Inject it before any module is evaluated so the config file can be imported.
vi.hoisted(() => {
  // @ts-expect-error — inject Nuxt global for testing
  globalThis.defineNuxtConfig = (config: unknown) => config
})

// Import the config after the global stub is in place.
const { default: config } = await import('../../.config/nuxt.config.ts')

/**
 * Specification:
 * Workbox's globIgnores MUST exclude '404' and '200' route files.
 * Nuxt generates a `404` and `200` output file for SPA fallback — these don't
 * exist as real assets on the CDN and cause ERR_FILE_NOT_FOUND in the SW
 * precache manifest on every page load.
 *
 * These tests WILL FAIL until Reynaud adds the patterns to globIgnores (GREEN).
 */

describe('pwa.workbox.globIgnores', () => {
  const ignores: string[] = (config as any)?.pwa?.workbox?.globIgnores ?? []

  it('excludes 404 files', () => {
    // Accepts either '**/404*' or a dedicated pattern that covers 404
    const covers404 = ignores.some(
      (p) => p === '**/404*' || p.includes('404'),
    )
    expect(covers404).toBe(true)
  })

  it('excludes 200 files', () => {
    const covers200 = ignores.some(
      (p) => p === '**/200*' || p.includes('200'),
    )
    expect(covers200).toBe(true)
  })
})

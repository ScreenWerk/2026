import { describe, expect, it } from 'vitest'
import { BUILD_PR } from '~/version'

// (*SW:Plateau*)

/**
 * Specification:
 * The player MUST export BUILD_PR — a positive integer identifying the GitHub
 * PR number that produced this build. This allows operators to verify exactly
 * which version is deployed without access to the CI logs.
 *
 * These tests WILL FAIL until Reynaud creates ~/version.ts (GREEN).
 */

describe('BUILD_PR', () => {
  it('is a number', () => {
    expect(typeof BUILD_PR).toBe('number')
  })

  it('is greater than 0', () => {
    expect(BUILD_PR).toBeGreaterThan(0)
  })
})

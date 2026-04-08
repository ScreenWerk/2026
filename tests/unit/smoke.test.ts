import { describe, expect, it } from 'vitest'

// Smoke test — verifies the test infrastructure is wired up correctly.
// This file MUST run and pass before any other player tests are written.
// (*SW:Plateau*)

describe('test infrastructure', () => {
  it('runs a trivial assertion', () => {
    expect(true).toBe(true)
  })
})

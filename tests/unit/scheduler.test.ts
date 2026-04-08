import { describe, expect, it } from 'vitest'
import { resolveActiveSchedule } from '~/composables/useScheduler'
import type { Schedule } from '~/types'

// (*SW:Plateau*)

/**
 * Minimal Schedule fixture — only the fields resolveActiveSchedule cares about.
 */
function makeSchedule(overrides: Partial<Schedule> = {}): Schedule {
  return {
    eid: 'sched-1',
    crontab: '* * * * *', // fires every minute
    cleanup: false,
    duration: undefined,
    ordinal: 1,
    layoutEid: 'layout-1',
    name: 'Test Schedule',
    width: 0,
    height: 0,
    layoutPlaylists: [],
    ...overrides,
  }
}

describe('resolveActiveSchedule — duration unit', () => {
  /**
   * Specification:
   * schedule.duration is in SECONDS.
   * A schedule with duration: 30 must be active within 30 seconds of its last
   * cron tick and inactive after 30 seconds have elapsed.
   *
   * Current bug: duration is multiplied by 60_000 (treats it as minutes),
   * so a 30-second window is wrongly stretched to 30 minutes.
   * These tests prove the correct (seconds) behaviour and will FAIL until fixed.
   */

  // Anchor: a minute-boundary so `* * * * *` last tick is exactly this time.
  const TICK = new Date('2026-04-08T10:00:00.000Z')

  const schedule = makeSchedule({ duration: 30 }) // 30 seconds

  it('is active when now is 10 s after the cron tick (within 30 s window)', () => {
    // now = TICK + 10 s → 10 < 30 → schedule MUST be active
    const now = new Date(TICK.getTime() + 10_000)
    const result = resolveActiveSchedule([schedule], now)
    expect(result).not.toBeNull()
    expect(result?.eid).toBe('sched-1')
  })

  it('is inactive when now is 35 s after the cron tick (past 30 s window)', () => {
    // now = TICK + 35 s → 35 > 30 → schedule MUST NOT be active
    // BUG: current code computes windowEnd = TICK + 30 * 60_000 ms = TICK + 30 min
    //      so this assertion will FAIL until duration is treated as seconds
    const now = new Date(TICK.getTime() + 35_000)
    const result = resolveActiveSchedule([schedule], now)
    expect(result).toBeNull()
  })

  it('is active at exactly the boundary (now = TICK + 30 s)', () => {
    // Boundary: now == windowEnd → `now > windowEnd` is false → still active
    const now = new Date(TICK.getTime() + 30_000)
    const result = resolveActiveSchedule([schedule], now)
    expect(result).not.toBeNull()
  })
})

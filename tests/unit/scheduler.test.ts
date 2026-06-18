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

describe('resolveActiveSchedule — duration unit (seconds)', () => {
  /**
   * Specification (locked behaviour — Issue #2):
   * schedule.duration is in SECONDS. resolveActiveSchedule MUST treat the
   * active window as `lastTick + duration * 1_000 ms`.
   *
   * A schedule with duration: 30 must be active within 30 seconds of its last
   * cron tick and inactive once 30 seconds have elapsed.
   *
   * REGRESSION GUARD: the historical bug (fixed in 8004e92) multiplied
   * duration by 60_000, treating it as MINUTES, so windows were 60× too long
   * (Tomas/Bilietai: banners stayed active 60× longer than configured). Each
   * test below is annotated with the value the OLD minutes code would have
   * produced — these tests PASS on the current (seconds) code and would FAIL
   * if the 60× regression ever returns.
   */

  // Anchor: a minute-boundary so `* * * * *` last tick is exactly this time.
  const TICK = new Date('2026-04-08T10:00:00.000Z')

  const schedule = makeSchedule({ duration: 30 }) // 30 seconds

  it('is active when now is 10 s after the cron tick (within 30 s window)', () => {
    // now = TICK + 10 s → 10 < 30 → schedule MUST be active.
    // (Active under both seconds and the old minutes behaviour; sanity check.)
    const now = new Date(TICK.getTime() + 10_000)
    const result = resolveActiveSchedule([schedule], now)
    expect(result).not.toBeNull()
    expect(result?.eid).toBe('sched-1')
  })

  it('is inactive when now is 35 s after the cron tick (past 30 s window)', () => {
    // now = TICK + 35 s → 35 > 30 s → schedule MUST NOT be active.
    // OLD bug: windowEnd = TICK + 30 * 60_000 ms = TICK + 30 min, so the old
    // code wrongly kept it active here. This is the core regression assertion.
    const now = new Date(TICK.getTime() + 35_000)
    const result = resolveActiveSchedule([schedule], now)
    expect(result).toBeNull()
  })

  it('is inactive 5 min after the tick (would still be active under the 60× bug)', () => {
    // now = TICK + 5 min. Correct (seconds): window ended at TICK + 30 s → null.
    // OLD bug: window = TICK + 30 min → still active at +5 min → non-null.
    // Pins the seconds semantics well inside the old (minutes) window.
    const now = new Date(TICK.getTime() + 5 * 60_000)
    const result = resolveActiveSchedule([schedule], now)
    expect(result).toBeNull()
  })

  it('is active at exactly the boundary (now = TICK + 30 s)', () => {
    // Boundary: now == windowEnd → `now > windowEnd` is false → still active.
    const now = new Date(TICK.getTime() + 30_000)
    const result = resolveActiveSchedule([schedule], now)
    expect(result).not.toBeNull()
  })
})

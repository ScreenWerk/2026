import { CronExpressionParser } from 'cron-parser'
import type { Schedule } from '~/types'

/**
 * Returns the most recent past execution time for a cron expression.
 * Returns null if the expression is invalid.
 *
 * Note: cron-parser v5 replaced parseExpression() with CronExpressionParser.parse()
 */
export function getLastCronTick (crontab: string, now: Date): Date | null {
  try {
    return CronExpressionParser.parse(crontab, { currentDate: now }).prev().toDate()
  }
  catch {
    return null
  }
}

/**
 * Given a list of schedules and the current time, returns the one that
 * should be active right now.
 *
 * Selection rules:
 * 1. Exclude schedules outside their validFrom/validTo window
 * 2. Find the most recent past cron tick for each remaining schedule
 * 3. If schedule.duration is set, exclude if now is past lastTick + duration
 * 4. Sort: most recent tick first; tie-break: highest ordinal wins
 */
export function resolveActiveSchedule (schedules: Schedule[], now: Date): Schedule | null {
  const candidates: { schedule: Schedule, lastTick: Date }[] = []

  for (const s of schedules) {
    if (!isWithinValidityWindow(s, now)) continue

    const lastTick = getLastCronTick(s.crontab, now)
    if (!lastTick) continue

    if (s.duration) {
      const windowEnd = new Date(lastTick.getTime() + s.duration * 60_000)

      if (now > windowEnd) continue
    }

    candidates.push({ schedule: s, lastTick })
  }

  if (!candidates.length) return null

  candidates.sort((a, b) => {
    const dt = b.lastTick.getTime() - a.lastTick.getTime()

    return dt !== 0 ? dt : b.schedule.ordinal - a.schedule.ordinal
  })

  return candidates[0]?.schedule ?? null
}

import type { Schedule } from '~/types'

/**
 * Orchestrates the full lifecycle of a screen:
 * - Fetches and polls the screen config JSON (via useScreenConfig)
 * - Evaluates the active schedule via cron + validity windows
 * - Drives a 30s clock and exposes reactive state to the template
 */
export function useScreen (getScreenId: () => string) {
  const { screenConfig, loadConfig } = useScreenConfig(getScreenId)
  const runtimeConfig = useRuntimeConfig()
  const clockIntervalMs = (runtimeConfig.public.clockIntervalSeconds as number) * 1000
  const defaultUpdateInterval = runtimeConfig.public.defaultUpdateIntervalMinutes as number

  const activeSchedule = ref<Schedule | null>(null)
  const lastCronTick = ref<Date>(new Date(0))
  const now = ref<Date>(new Date())

  // Filter layoutPlaylists by their validFrom/validTo window.
  const validLayoutPlaylists = computed(() => {
    if (!activeSchedule.value) return []

    const t = now.value

    return activeSchedule.value.layoutPlaylists.filter((lp) => isWithinValidityWindow(lp, t))
  })

  // Calculate scale transform to fit schedule canvas to window.
  const scheduleStyle = computed(() => {
    const s = activeSchedule.value

    if (!s?.width || !s?.height) return {}

    const scaleX = window.innerWidth / s.width
    const scaleY = window.innerHeight / s.height

    return {
      width: `${s.width}px`,
      height: `${s.height}px`,
      transform: `scale(${scaleX}, ${scaleY})`,
      transformOrigin: '0 0'
    }
  })

  // Resolve the active schedule and update cron tick.
  function evaluateSchedule () {
    if (!screenConfig.value) return

    const t = now.value
    const schedule = resolveActiveSchedule(screenConfig.value.schedules, t)

    activeSchedule.value = schedule

    if (schedule) {
      const tick = getLastCronTick(schedule.crontab, t)

      if (tick && tick.getTime() !== lastCronTick.value.getTime()) {
        lastCronTick.value = tick
      }
    }
  }

  let pollTimer: ReturnType<typeof setTimeout> | null = null

  // Start periodic config refresh polling.
  function startPolling () {
    const intervalMs = (screenConfig.value?.updateInterval ?? defaultUpdateInterval) * 60_000
    const nextRefresh = new Date(Date.now() + intervalMs)

    console.log('[screen] next refresh:', nextRefresh.toISOString().slice(0, 19).replace('T', ' '))

    pollTimer = setTimeout(async () => {
      await loadConfig()
      evaluateSchedule()
      startPolling()
    }, intervalMs)
  }

  let clockTimer: ReturnType<typeof setInterval> | null = null

  // Re-initialize when screenId changes (e.g., navigating to a different screen).
  watch(getScreenId, async () => {
    activeSchedule.value = null

    if (pollTimer) clearTimeout(pollTimer)

    await loadConfig()
    evaluateSchedule()
    startPolling()
  })

  onMounted(async () => {
    await loadConfig()

    if (screenConfig.value) {
      const cfg = screenConfig.value

      console.groupCollapsed('[screen]', getScreenId())
      console.log('published:', cfg.publishedAt.slice(0, 19).replace('T', ' '))
      console.log('refresh:  ', cfg.updateInterval, 'min')
      console.log('schedules:', cfg.schedules.length)
      console.groupEnd()
    }

    evaluateSchedule()
    startPolling()

    clockTimer = setInterval(() => {
      now.value = new Date()
      evaluateSchedule()
    }, clockIntervalMs)
  })

  onUnmounted(() => {
    if (pollTimer) clearTimeout(pollTimer)
    if (clockTimer) clearInterval(clockTimer)
  })

  return {
    screenConfig,
    activeSchedule,
    lastCronTick,
    now,
    validLayoutPlaylists,
    scheduleStyle
  }
}

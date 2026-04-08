import type { Ref } from 'vue'
import type { DashboardData } from '~/types/dashboard'

export function useDashboard() {
  const db = inject('db') as Ref<DashboardData | null | undefined>
  const entuAppBase = inject<string>('dbBase', '')
  return { db, entuAppBase }
}

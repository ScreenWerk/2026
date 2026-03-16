import type { EntuEntity } from '~/types/entu'

export function val (entity: EntuEntity | undefined, prop: string, type = 'auto'): string | boolean | number | null {
  if (!entity) return null
  const arr = entity[prop] as { string?: string, boolean?: boolean, number?: number, reference?: string, datetime?: string, filename?: string }[] | undefined
  if (!arr?.length) return null
  const p = arr[0]
  if (!p) return null
  if (type !== 'auto') return (p[type as keyof typeof p] as string | boolean | number | null) ?? null
  return p.string ?? p.reference ?? p.boolean ?? p.number ?? p.datetime ?? p.filename ?? null
}

export function byName (a: EntuEntity, b: EntuEntity): number {
  return String(val(a, 'name') ?? '').localeCompare(String(val(b, 'name') ?? ''))
}

export function byOrdinal (a: EntuEntity, b: EntuEntity): number {
  return (val(a, 'ordinal', 'number') as number ?? 0) - (val(b, 'ordinal', 'number') as number ?? 0)
}

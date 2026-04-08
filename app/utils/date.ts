/**
 * Check if an item is valid based on its validFrom/validTo window.
 */
export function isWithinValidityWindow(
  item: { validFrom?: string; validTo?: string },
  now: Date
): boolean {
  if (item.validFrom && new Date(item.validFrom) > now) return false
  if (item.validTo && new Date(item.validTo) <= now) return false

  return true
}

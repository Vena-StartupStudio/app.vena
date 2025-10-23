export function toUtcIso(localValue: string): string {
  // localValue expected as yyyy-MM-ddThh:mm
  const date = new Date(localValue)
  return date.toISOString()
}

export function formatDateTime(value: string, timeZone: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
    ...options
  }).format(new Date(value))
}

export function formatDate(value: string, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone
  }).format(new Date(value))
}

export function formatTime(value: string, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone
  }).format(new Date(value))
}

export function groupSlotsByDate<T extends { start_time: string }>(slots: T[], timeZone: string) {
  return slots.reduce<Record<string, T[]>>((acc, slot) => {
    const key = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone
    }).format(new Date(slot.start_time))
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key]!.push(slot)
    return acc
  }, {})
}

import type { Group } from '../data/types'

/** Real weekday index with Monday = 0 … Sunday = 6. */
export function todayIdx(now: Date = new Date()): number {
  return (now.getDay() + 6) % 7
}

/** Local YYYY-MM-DD key for a date (used to tag sessions and match calendar cells). */
export function dayKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Parse a local YYYY-MM-DD key back into a local Date. */
export function parseDay(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y!, (m ?? 1) - 1, d ?? 1)
}

/** The Monday-start week key that a date falls in. */
export function weekStartKey(d: Date): string {
  const x = new Date(d)
  const idx = (x.getDay() + 6) % 7
  x.setDate(x.getDate() - idx)
  return dayKey(x)
}

/** The dates (1..31) of the current week, Monday..Sunday. */
export function weekDates(now: Date = new Date()): number[] {
  const idx = todayIdx(now)
  const monday = new Date(now)
  monday.setDate(now.getDate() - idx)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.getDate()
  })
}

/** Full Date for each day of the current week, Monday..Sunday. */
export function weekDateObjects(now: Date = new Date()): Date[] {
  const idx = todayIdx(now)
  const monday = new Date(now)
  monday.setDate(now.getDate() - idx)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export interface TodayInfo {
  idx: number
  /** the program slot for the real weekday (may be 'Rest') */
  type: Group
  isRest: boolean
  /** the type to actually train when Start is tapped (today's, or the next training day if today is Rest) */
  trainType: Group
  /** index of the trainType day */
  trainIdx: number
}

/** Resolve what "today" means against the user's program. */
export function resolveToday(program: Group[], now: Date = new Date()): TodayInfo {
  const idx = todayIdx(now)
  const type = program[idx] ?? 'Rest'
  if (type !== 'Rest') return { idx, type, isRest: false, trainType: type, trainIdx: idx }
  // today is a rest day — find the next training day in the rotation
  for (let i = 1; i <= 7; i++) {
    const j = (idx + i) % 7
    const t = program[j]
    if (t && t !== 'Rest') return { idx, type, isRest: true, trainType: t, trainIdx: j }
  }
  return { idx, type, isRest: true, trainType: 'Legs', trainIdx: idx }
}

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

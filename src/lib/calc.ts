import { RANKS, SEED_EXERCISES, TAILOR_RATIOS } from '../data/exercises'
import type { Exercise, Group, MuscleState, Rank, Unit, Zone } from '../data/types'
import { VOLT } from '../data/tokens'

/**
 * Which movements make up a given training day. The library is organized by
 * Push/Pull/Legs, so Lower reuses the leg movements and Upper combines push+pull.
 */
export function exercisesForType(ex: Exercise[], type: Group): Exercise[] {
  if (type === 'Upper') return ex.filter((e) => e.group === 'Push' || e.group === 'Pull')
  if (type === 'Lower') return ex.filter((e) => e.group === 'Legs')
  return ex.filter((e) => e.group === type)
}

// ── Units ──────────────────────────────────────────────────────────────────
export const toLb = (n: number): number => Math.round(n * 2.20462)

/** Format a kg value in the chosen unit, e.g. "105 kg" / "231 lb". */
export function fmtWeight(n: number, unit: Unit): string {
  return unit === 'lb' ? `${toLb(n)} lb` : `${n} kg`
}

/** Numeric weight in the chosen unit (no label). */
export function toNum(n: number, unit: Unit): number {
  return unit === 'lb' ? toLb(n) : n
}

// ── Scheme / target math ─────────────────────────────────────────────────────
/** Top of the rep range from a scheme like "4 × 6–8" → 8. */
export function repTop(e: Pick<Exercise, 'scheme'>): number {
  const p = e.scheme.split('×')[1] || '8'
  const nums = p.match(/\d+/g) || ['8']
  return parseInt(nums[nums.length - 1]!, 10)
}

/** Planned set count from a scheme like "4 × 6" → 4. */
export function setCount(e: Pick<Exercise, 'scheme'>): number {
  return parseInt(e.scheme, 10) || 4
}

/** The next target weight: one increment up, capped at the goal. */
export function nextWeight(e: Pick<Exercise, 'current' | 'inc' | 'goal'>): number {
  return Math.min(e.current + e.inc, e.goal)
}

/** Percent progress from start → goal, clamped to [0, 100]. */
export function pctVal(e: Pick<Exercise, 'current' | 'start' | 'goal'>): number {
  return Math.max(0, Math.min(100, Math.round(((e.current - e.start) / (e.goal - e.start)) * 100)))
}

// ── Clock ────────────────────────────────────────────────────────────────────
export function fmtClock(s: number): string {
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${m}:${String(ss).padStart(2, '0')}`
}

// ── Rank ─────────────────────────────────────────────────────────────────────
export interface RankInfo {
  name: string
  idx: number
  next: string | null
  into: number
  need: number
  span: number
  pct: number
  xp: number
}

export function rankInfo(xp: number): RankInfo {
  const rs: Rank[] = RANKS
  let cur = rs[0]!
  let idx = 0
  for (let i = 0; i < rs.length; i++) {
    if (xp >= rs[i]!.min) {
      cur = rs[i]!
      idx = i
    }
  }
  const next = rs[idx + 1] || null
  const pct = next ? Math.round(((xp - cur.min) / (next.min - cur.min)) * 100) : 100
  return {
    name: cur.name,
    idx,
    next: next ? next.name : null,
    into: xp - cur.min,
    need: next ? next.min - cur.min : 0,
    span: next ? next.min : cur.min,
    pct,
    xp,
  }
}

// ── Body map ─────────────────────────────────────────────────────────────────
/** Merge exercise muscle-state entries into a muscle → state map ('done' wins). */
export function buildMuscleMap(entries: { muscles: string[]; state: MuscleState }[]): Record<string, MuscleState> {
  const map: Record<string, MuscleState> = {}
  entries.forEach((e) => {
    e.muscles.forEach((m) => {
      if (map[m] !== 'done') map[m] = e.state
    })
  })
  return map
}

export interface RenderedZone {
  x: number
  y: number
  w: number
  h: number
  rx: number
  fill: string
  stroke: string
  strokeWidth: number
  dash: string
}

/** Resolve each zone to concrete fill/stroke based on the muscle map. */
export function renderBody(zones: Zone[], map: Record<string, MuscleState>): RenderedZone[] {
  return zones.map((z) => {
    if (!z.m) return { x: z.x, y: z.y, w: z.w, h: z.h, rx: z.rx, fill: '#1c1c20', stroke: '#2a2a31', strokeWidth: 1, dash: '0' }
    let state: MuscleState | null = null
    z.m.forEach((k) => {
      const s = map[k]
      if (s === 'done') state = 'done'
      else if (s === 'todo' && state !== 'done') state = 'todo'
    })
    if (state === 'done') return { x: z.x, y: z.y, w: z.w, h: z.h, rx: z.rx, fill: VOLT, stroke: 'none', strokeWidth: 0, dash: '0' }
    if (state === 'todo') return { x: z.x, y: z.y, w: z.w, h: z.h, rx: z.rx, fill: '#1c1c2a', stroke: VOLT, strokeWidth: 1.4, dash: '3,3' }
    return { x: z.x, y: z.y, w: z.w, h: z.h, rx: z.rx, fill: '#1c1c20', stroke: '#2a2a31', strokeWidth: 1, dash: '0' }
  })
}

// ── BMI / protein ────────────────────────────────────────────────────────────
export interface Bmi {
  value: string
  cat: string
  color: string
}

export function bmiFor(weightKg: number, heightCm: number | null): Bmi | null {
  if (!heightCm || heightCm <= 80) return null
  const val = weightKg / Math.pow(heightCm / 100, 2)
  const cat =
    val < 18.5
      ? { t: 'Underweight', c: '#4EA8FF' }
      : val < 25
        ? { t: 'Healthy', c: '#3DDC84' }
        : val < 30
          ? { t: 'Overweight', c: '#FFCE3D' }
          : { t: 'High', c: '#FF6A2C' }
  return { value: val.toFixed(1), cat: cat.t, color: cat.c }
}

export interface Protein {
  low: number
  high: number
  target: number
}

export function proteinFor(weightKg: number): Protein {
  return {
    low: Math.round(weightKg * 1.6),
    high: Math.round(weightKg * 2.2),
    target: Math.round(weightKg * 2.0),
  }
}

// ── Tailoring ────────────────────────────────────────────────────────────────
/**
 * Derive the effective exercise catalog from the seed + profile.
 * When not tailored (or no valid bodyweight) it returns a clean clone of the seed,
 * so tailoring is a pure function of (profile, tailoredDone) — no hidden mutation.
 */
export function tailoredExercises(bwStr: string, tailoredDone: boolean): Exercise[] {
  const seed = SEED_EXERCISES.map((e) => ({ ...e, alts: e.alts.map((a) => ({ ...a })) }))
  const bw = parseFloat(bwStr)
  if (!tailoredDone || !bw || bw < 25) return seed

  const roundInc = (v: number, inc: number) => Math.max(inc, Math.round(v / inc) * inc)
  seed.forEach((e) => {
    const baseCur = e.current // seed value is the immutable baseline
    const r = TAILOR_RATIOS[e.id] ?? 0.5
    const cur = roundInc(bw * r, e.inc)
    const factor = cur / baseCur
    e.current = cur
    e.goal = Math.max(roundInc(cur * 1.3, e.inc), cur + e.inc)
    e.start = Math.min(Math.max(0, roundInc(cur * 0.72, e.inc)), cur)
    e.hist = Array.from({ length: 6 }, (_, i) => roundInc(e.start + (cur - e.start) * (i / 5), e.inc))
    e.alts.forEach((a) => {
      const baseA = { current: a.current, goal: a.goal, start: a.start }
      a.current = roundInc(baseA.current * factor, a.inc)
      a.goal = Math.max(roundInc(baseA.goal * factor, a.inc), a.current + a.inc)
      a.start = Math.min(Math.max(0, roundInc(baseA.start * factor, a.inc)), a.current)
    })
  })
  return seed
}

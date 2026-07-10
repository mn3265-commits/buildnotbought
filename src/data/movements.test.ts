import { describe, expect, it } from 'vitest'
import { MOVEMENT_PATTERN, PATTERNS, patternFor, tempoTiming, type Pose } from './movements'
import { SEED_EXERCISES } from './exercises'

// Mirrors the segment lengths in MovementPreview.
const TORSO = 26
const UPPER_ARM = 13
const FOREARM = 13
const THIGH = 18
const SHIN = 18

type Pt = { x: number; y: number }
const rad = (d: number) => (d * Math.PI) / 180
/** SVG rotate(a): (x,y) -> (x cos a - y sin a, x sin a + y cos a) */
const rot = (p: Pt, a: number): Pt => ({
  x: p.x * Math.cos(rad(a)) - p.y * Math.sin(rad(a)),
  y: p.x * Math.sin(rad(a)) + p.y * Math.cos(rad(a)),
})
const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y })
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y)

/**
 * Forward kinematics for the end effectors, in scene units.
 * Joint angles alone are a bad proxy for motion: the incline press once had a
 * 28° shoulder and 70° elbow swing that largely cancelled at the hand, so the
 * dumbbell barely moved. Only the hand and foot tell the truth.
 */
function endpoints(p: Pose): { hand: Pt; foot: Pt } {
  const pelvis = { x: p.dx, y: p.dy }

  const shoulder = add(pelvis, rot({ x: 0, y: -TORSO + 2 }, p.torso))
  const elbow = add(shoulder, rot({ x: 0, y: UPPER_ARM }, p.torso + p.shoulder))
  const hand = add(elbow, rot({ x: 0, y: FOREARM }, p.torso + p.shoulder + p.elbow))

  const knee = add(pelvis, rot({ x: 0, y: THIGH }, p.hip))
  const foot = add(knee, rot({ x: 0, y: SHIN }, p.hip + p.knee))

  return { hand, foot }
}

/** Furthest an end effector travels between the top and bottom of the rep. */
const travel = (key: string): number => {
  const p = PATTERNS[key]!
  const t = endpoints(p.top)
  const b = endpoints(p.bottom)
  return Math.max(dist(t.hand, b.hand), dist(t.foot, b.foot))
}

describe('movement patterns', () => {
  it('every main lift maps to a pattern', () => {
    const missing = SEED_EXERCISES.filter((e) => !MOVEMENT_PATTERN[e.name])
    expect(missing.map((e) => e.name)).toEqual([])
  })

  it('every swap alternative maps to a pattern', () => {
    const missing: string[] = []
    SEED_EXERCISES.forEach((e) => e.alts.forEach((a) => !MOVEMENT_PATTERN[a.n] && missing.push(a.n)))
    expect(missing).toEqual([])
  })

  it('no movement name has stray whitespace (it would never match)', () => {
    const bad = Object.keys(MOVEMENT_PATTERN).filter((k) => k !== k.trim())
    expect(bad).toEqual([])
  })

  it('every mapped pattern key exists', () => {
    const bad = Object.entries(MOVEMENT_PATTERN).filter(([, key]) => !PATTERNS[key])
    expect(bad).toEqual([])
  })

  it('every pattern actually moves — a rep must not be a still frame', () => {
    const still = Object.keys(PATTERNS).filter((k) => travel(k) === 0)
    expect(still).toEqual([])
  })

  it('every pattern has a readable range of motion, not a twitch', () => {
    // Scene is 100x104, so ~10 units is the smallest arc that reads as a rep.
    // Guards against a pose edit quietly flattening a movement, which is exactly
    // what had happened to the incline press.
    const shallow = Object.keys(PATTERNS)
      .map((k) => [k, travel(k)] as const)
      .filter(([, t]) => t < 10)
    expect(shallow).toEqual([])
  })

  it('falls back to a real pattern for an unknown movement', () => {
    expect(patternFor('Some Lift That Does Not Exist')).toBe(PATTERNS.squat)
  })
})

describe('tempoTiming', () => {
  it('runs the rep over the full prescribed tempo', () => {
    expect(tempoTiming([3, 1, 1]).dur).toBe(5)
    expect(tempoTiming([2, 0, 1]).dur).toBe(3)
  })

  it('places the bottom of the rep at the end of the eccentric', () => {
    // 3-1-1: down for 3s of 5 => 0.6
    expect(tempoTiming([3, 1, 1]).keyTimes.split(';')[1]).toBe('0.6000')
  })

  it('holds through the pause, then lifts', () => {
    const { keyTimes } = tempoTiming([3, 1, 1])
    const [t0, t1, t2, t3] = keyTimes.split(';').map(Number)
    expect(t0).toBe(0)
    expect(t1).toBeLessThan(t2!) // the pause has width
    expect(t3).toBe(1)
  })

  it('never divides by zero on a degenerate tempo', () => {
    expect(tempoTiming([0, 0, 0]).dur).toBeGreaterThan(0)
  })

  it('emits one fewer keySpline interval than keyTimes (SMIL requirement)', () => {
    expect(tempoTiming([2, 1, 1]).keyTimes.split(';')).toHaveLength(4)
  })
})

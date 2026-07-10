import { describe, expect, it } from 'vitest'
import { MOVEMENT_PATTERN, PATTERNS, distPt, localSkeleton, patternFor, repPath, sceneSkeleton, tempoTiming } from './movements'
import { SEED_EXERCISES } from './exercises'

/**
 * Furthest an end effector travels between the top and bottom of the rep.
 * Uses the same forward kinematics the renderer uses, so the test cannot drift
 * from what is drawn. Joint angles alone are a bad proxy: the incline press
 * once had a 28° shoulder and a 70° elbow swing that cancelled at the hand, so
 * the dumbbell barely moved. Only the hand and foot tell the truth.
 */
const travel = (key: string): number => {
  const p = PATTERNS[key]!
  const t = localSkeleton(p.top)
  const b = localSkeleton(p.bottom)
  return Math.max(distPt(t.hand, b.hand), distPt(t.foot, b.foot))
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

describe('skeleton geometry', () => {
  it('places the figure in the scene: pelvis lands on the pattern origin', () => {
    const p = PATTERNS.squat!
    const s = sceneSkeleton(p, p.top)
    expect(s.pelvis.x).toBeCloseTo(46, 1)
    expect(s.pelvis.y).toBeCloseTo(56, 1)
  })

  it('keeps every joint inside the 100x104 viewBox at both ends of the rep', () => {
    const out: string[] = []
    for (const [key, pat] of Object.entries(PATTERNS)) {
      for (const pose of [pat.top, pat.bottom]) {
        const s = sceneSkeleton(pat, pose)
        for (const [joint, pt] of Object.entries(s)) {
          if (pt.x < -6 || pt.x > 106 || pt.y < -6 || pt.y > 110) out.push(`${key}.${joint}`)
        }
      }
    }
    expect(out).toEqual([])
  })

  it('points the direction arrow along whichever end effector carries the rep', () => {
    // leg press is driven by the feet, curl by the hand
    const lp = PATTERNS.legPress!
    const lpFoot = distPt(sceneSkeleton(lp, lp.top).foot, sceneSkeleton(lp, lp.bottom).foot)
    const lpPath = repPath(lp)
    expect(distPt(lpPath.from, lpPath.to)).toBeCloseTo(lpFoot, 1)

    const c = PATTERNS.curl!
    const cHand = distPt(sceneSkeleton(c, c.top).hand, sceneSkeleton(c, c.bottom).hand)
    const cPath = repPath(c)
    expect(distPt(cPath.from, cPath.to)).toBeCloseTo(cHand, 1)
  })
})

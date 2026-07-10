import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { FIGURES, figureFor } from './figures'
import { SEED_EXERCISES } from './exercises'

const PUBLIC = new URL('../../public/exercise/', import.meta.url).pathname

describe('exercise figures', () => {
  it('every main lift has an illustration', () => {
    const missing = SEED_EXERCISES.filter((e) => !FIGURES[e.name]).map((e) => e.name)
    expect(missing).toEqual([])
  })

  it('both frames exist on disk for every figure', () => {
    const missing: string[] = []
    for (const fig of Object.values(FIGURES)) {
      for (const phase of ['start', 'end']) {
        const f = `${PUBLIC}${fig.slug}-${phase}.svg`
        if (!existsSync(f)) missing.push(`${fig.slug}-${phase}.svg`)
      }
    }
    expect(missing).toEqual([])
  })

  it('the frames are real SVGs, not an error page', () => {
    for (const fig of Object.values(FIGURES)) {
      const svg = readFileSync(`${PUBLIC}${fig.slug}-start.svg`, 'utf8')
      expect(svg.startsWith('<svg')).toBe(true)
      expect(svg.length).toBeGreaterThan(500)
    }
  })

  it('start and end are actually different drawings', () => {
    for (const fig of Object.values(FIGURES)) {
      const a = readFileSync(`${PUBLIC}${fig.slug}-start.svg`, 'utf8')
      const b = readFileSync(`${PUBLIC}${fig.slug}-end.svg`, 'utf8')
      expect(a).not.toBe(b)
    }
  })

  it('returns null for a swap alternative rather than the parent\'s picture', () => {
    // showing a bench-press drawing for a machine chest press would be a lie
    expect(figureFor('Machine Chest Press')).toBeNull()
    expect(figureFor('Front Squat')).toBeNull()
    expect(figureFor('Bench Press')).not.toBeNull()
  })

  it('flags the three lifts whose art is a variant, not an exact match', () => {
    const noted = Object.entries(FIGURES).filter(([, f]) => f.variantNote).map(([k]) => k)
    expect(noted.sort()).toEqual(['Barbell Row', 'Lat Pulldown', 'Overhead Press'])
  })

  it('ships the licence file the CC BY-SA attribution requires', () => {
    expect(existsSync(`${PUBLIC}LICENSE.txt`)).toBe(true)
  })
})

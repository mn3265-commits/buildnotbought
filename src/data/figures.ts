/**
 * Exercise illustrations.
 *
 * Real anatomical line art from the Everkinetic open dataset
 * (github.com/everkinetic/data, CC BY-SA 4.0), served from `public/exercise/`
 * so it loads instantly on gym wifi. Two frames per lift — the start and end of
 * the rep — which reads far better than a moving figure.
 *
 * We do NOT use wger's community image uploads: spot-checking them turned up a
 * dumbbell deadlift filed as "Deadlifts" and a HOIST® product photo, watermark
 * and all, uploaded under a CC-BY-SA claim.
 *
 * Files are redistributed unmodified; the dark-theme recolour happens in CSS at
 * display time. See public/exercise/LICENSE.txt.
 */

export interface Figure {
  /** basename in /exercise: `${slug}-start.svg` and `${slug}-end.svg` */
  slug: string
  /** the Everkinetic illustration this actually depicts */
  source: string
  /**
   * Set when the illustration is the closest honest variant rather than an
   * exact match — surfaced in the UI rather than quietly passed off as the lift.
   */
  variantNote?: string
}

export const FIGURES: Record<string, Figure> = {
  'Bench Press': { slug: 'bench-press', source: 'Bench Press' },
  'Overhead Press': { slug: 'overhead-press', source: 'Seated Military Press', variantNote: 'shown seated' },
  'Incline DB Press': { slug: 'incline-db-press', source: 'Incline Dumbbell Press' },
  'Triceps Pushdown': { slug: 'triceps-pushdown', source: 'Triceps Pushdown with Cable' },
  'Lateral Raise': { slug: 'lateral-raise', source: 'Lateral Dumbbell Raises' },
  Deadlift: { slug: 'deadlift', source: 'Barbell Dead Lifts' },
  'Weighted Pull-up': { slug: 'weighted-pull-up', source: 'Pull Ups' },
  'Barbell Row': { slug: 'barbell-row', source: 'Reverse Grips Bent Over Barbell Rows', variantNote: 'shown underhand' },
  'Lat Pulldown': { slug: 'lat-pulldown', source: 'Underhand Pull-down', variantNote: 'shown underhand' },
  'Barbell Curl': { slug: 'barbell-curl', source: 'Biceps Curls with Barbell' },
  'Back Squat': { slug: 'back-squat', source: 'Barbell Squat' },
  'Romanian Deadlift': { slug: 'romanian-deadlift', source: 'Romanian Dead Lift' },
  'Leg Press': { slug: 'leg-press', source: 'Leg Press' },
  'Seated Leg Curl': { slug: 'seated-leg-curl', source: 'Seated Leg Curl' },
  'Standing Calf Raise': { slug: 'standing-calf-raise', source: 'Standing Barbell Calf Raise' },
}

/**
 * Swap alternatives have no illustration of their own. Rather than show the
 * parent lift's figure — which would be a different movement — the detail screen
 * shows nothing. A wrong picture is worse than no picture.
 */
export function figureFor(movementName: string): Figure | null {
  return FIGURES[movementName] ?? null
}

export const FIGURE_CREDIT = {
  author: 'Everkinetic',
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  sourceUrl: 'https://github.com/everkinetic/data',
}

/**
 * Movement previews.
 *
 * Every lift is drawn as the same articulated side-view figure; a *pattern*
 * says what the figure does. A pattern is two poses — the top of the rep and
 * the bottom — and the app tweens between them on the exercise's real tempo,
 * so the preview is generated from training data rather than shipped as a clip.
 *
 * Angles are degrees, SVG-clockwise. A limb at 0 hangs straight down.
 * `dx`/`dy` move the pelvis, which is what actually makes a squat look deep.
 */

export interface Pose {
  /** trunk lean; 0 upright, positive = hinged forward */
  torso: number
  /** upper arm from hanging (0) — 180 is straight overhead */
  shoulder: number
  /** forearm relative to upper arm; 0 straight, positive = flexed */
  elbow: number
  /** thigh from hanging; negative drives the knee forward */
  hip: number
  /** shin relative to thigh */
  knee: number
  /** pelvis offset */
  dx: number
  dy: number
}

/** What the figure is braced against — drawn behind it. */
export type Prop = 'floor' | 'bench' | 'incline' | 'legPress' | 'seat' | 'bar' | 'cable'

export interface Pattern {
  /** rep starts here (the "top") */
  top: Pose
  /** and ends here (the "bottom") */
  bottom: Pose
  prop: Prop
  /** rotate the whole figure — lying/seated movements */
  rootRot?: number
  /** where the pelvis sits in the 100x104 scene (default 46,56) */
  origin?: { x: number; y: number }
  /** what the hands hold */
  load: 'barbell' | 'dumbbell' | 'handle' | 'none'
}

const P = (o: Partial<Pose>): Pose => ({ torso: 0, shoulder: 0, elbow: 0, hip: 0, knee: 0, dx: 0, dy: 0, ...o })

export const PATTERNS: Record<string, Pattern> = {
  squat: {
    top: P({ torso: 6, shoulder: 152, elbow: 104 }),
    bottom: P({ torso: 30, shoulder: 152, elbow: 104, hip: -70, knee: 76, dx: -5, dy: 17 }),
    prop: 'floor',
    load: 'barbell',
  },
  deadlift: {
    top: P({ torso: 4, shoulder: 2, elbow: 2 }),
    bottom: P({ torso: 60, shoulder: -58, elbow: 0, hip: -38, knee: 48, dx: -3, dy: 11 }),
    prop: 'floor',
    load: 'barbell',
  },
  hinge: {
    // RDL: knees stay soft, the hips travel back
    top: P({ torso: 4, shoulder: 2, elbow: 2, knee: 6 }),
    bottom: P({ torso: 70, shoulder: -66, elbow: 0, hip: -18, knee: 14, dx: -7, dy: 4 }),
    prop: 'floor',
    load: 'barbell',
  },
  bentRow: {
    top: P({ torso: 62, shoulder: -52, elbow: 92, hip: -14, knee: 16 }),
    bottom: P({ torso: 62, shoulder: -64, elbow: 4, hip: -14, knee: 16 }),
    prop: 'floor',
    load: 'barbell',
  },
  overheadPress: {
    top: P({ torso: 0, shoulder: 176, elbow: 4 }),
    bottom: P({ torso: 3, shoulder: 150, elbow: 132 }),
    prop: 'floor',
    load: 'barbell',
  },
  benchPress: {
    top: P({ torso: 0, shoulder: 90, elbow: 0, hip: 118, knee: 66 }),
    bottom: P({ torso: 0, shoulder: 68, elbow: 124, hip: 118, knee: 66 }),
    prop: 'bench',
    rootRot: -90,
    origin: { x: 60, y: 66 },
    load: 'barbell',
  },
  inclinePress: {
    top: P({ torso: 0, shoulder: 70, elbow: 0, hip: 74, knee: 74 }),
    bottom: P({ torso: 0, shoulder: 40, elbow: 118, hip: 74, knee: 74 }),
    prop: 'incline',
    rootRot: -58,
    origin: { x: 56, y: 62 },
    load: 'dumbbell',
  },
  pullUp: {
    top: P({ torso: -4, shoulder: 150, elbow: 92, hip: 6, knee: -34, dy: 14 }),
    bottom: P({ torso: 0, shoulder: 177, elbow: 2, hip: 4, knee: -22, dy: 34 }),
    prop: 'bar',
    origin: { x: 48, y: 42 },
    load: 'none',
  },
  pulldown: {
    top: P({ torso: -6, shoulder: 138, elbow: 114, hip: -84, knee: 80 }),
    bottom: P({ torso: -6, shoulder: 176, elbow: 4, hip: -84, knee: 80 }),
    prop: 'seat',
    origin: { x: 44, y: 62 },
    load: 'handle',
  },
  curl: {
    top: P({ torso: 0, shoulder: 6, elbow: 146 }),
    bottom: P({ torso: 0, shoulder: 0, elbow: 2 }),
    prop: 'floor',
    load: 'barbell',
  },
  pushdown: {
    top: P({ torso: 12, shoulder: 22, elbow: 6 }),
    bottom: P({ torso: 12, shoulder: 22, elbow: 96 }),
    prop: 'cable',
    load: 'handle',
  },
  lateralRaise: {
    top: P({ torso: 2, shoulder: 88, elbow: 8 }),
    bottom: P({ torso: 2, shoulder: 4, elbow: 4 }),
    prop: 'floor',
    load: 'dumbbell',
  },
  legPress: {
    top: P({ torso: 0, shoulder: 46, elbow: 34, hip: 84, knee: 6 }),
    bottom: P({ torso: 0, shoulder: 46, elbow: 34, hip: 104, knee: 82 }),
    prop: 'legPress',
    rootRot: -108,
    origin: { x: 34, y: 74 },
    load: 'none',
  },
  legCurl: {
    top: P({ torso: 4, shoulder: 26, elbow: 22, hip: -84, knee: 94 }),
    bottom: P({ torso: 4, shoulder: 26, elbow: 22, hip: -84, knee: 4 }),
    prop: 'seat',
    origin: { x: 42, y: 62 },
    load: 'none',
  },
  calfRaise: {
    // small by nature — but the heel must visibly drop below the step
    top: P({ torso: 0, shoulder: 4, elbow: 2, dy: -11 }),
    bottom: P({ torso: 0, shoulder: 4, elbow: 2, dy: 3 }),
    prop: 'floor',
    load: 'barbell',
  },
}

export type PatternKey = keyof typeof PATTERNS

/**
 * Movement name → pattern. Covers the 15 main lifts and all 45 swap
 * alternatives, so a swapped-in movement previews correctly too.
 */
export const MOVEMENT_PATTERN: Record<string, PatternKey> = {
  // ── main lifts ──
  'Bench Press': 'benchPress',
  'Overhead Press': 'overheadPress',
  'Incline DB Press': 'inclinePress',
  'Triceps Pushdown': 'pushdown',
  'Lateral Raise': 'lateralRaise',
  Deadlift: 'deadlift',
  'Weighted Pull-up': 'pullUp',
  'Barbell Row': 'bentRow',
  'Lat Pulldown': 'pulldown',
  'Barbell Curl': 'curl',
  'Back Squat': 'squat',
  'Romanian Deadlift': 'hinge',
  'Leg Press': 'legPress',
  'Seated Leg Curl': 'legCurl',
  'Standing Calf Raise': 'calfRaise',

  // ── push alternatives ──
  'Dumbbell Bench Press': 'benchPress',
  'Machine Chest Press': 'benchPress',
  'Weighted Push-up': 'benchPress',
  'Seated DB Shoulder Press': 'overheadPress',
  'Machine Shoulder Press': 'overheadPress',
  'Arnold Press': 'overheadPress',
  'Incline Barbell Press': 'inclinePress',
  'Incline Machine Press': 'inclinePress',
  'Low-to-High Cable Fly': 'lateralRaise',
  'Overhead Cable Extension': 'overheadPress',
  'Skull Crushers': 'benchPress',
  'Bench Dips': 'pushdown',
  'Cable Lateral Raise': 'lateralRaise',
  'Machine Lateral Raise': 'lateralRaise',
  'Upright Row': 'curl',

  // ── pull alternatives ──
  'Trap-Bar Deadlift': 'deadlift',
  'Rack Pull': 'hinge',
  'Assisted Pull-up': 'pullUp',
  'Chin-up': 'pullUp',
  'Pull-up': 'pullUp',
  'Dumbbell Row': 'bentRow',
  'Chest-Supported Row': 'bentRow',
  'Seated Cable Row': 'bentRow',
  'Straight-Arm Pulldown': 'pulldown',
  'Machine Pulldown': 'pulldown',
  'Dumbbell Curl': 'curl',
  'Cable Curl': 'curl',
  'Preacher Curl': 'curl',

  // ── leg alternatives ──
  'Front Squat': 'squat',
  'Hack Squat': 'squat',
  'Goblet Squat': 'squat',
  'Lying Leg Curl': 'legCurl',
  'Good Morning': 'hinge',
  'Dumbbell RDL': 'hinge',
  'Bulgarian Split Squat': 'squat',
  'Nordic Curl': 'legCurl',
  'Seated Calf Raise': 'calfRaise',
  'Leg-Press Calf Raise': 'calfRaise',
  'Single-Leg Calf Raise': 'calfRaise',
}

/** Fall back to a squat-ish pattern rather than rendering nothing. */
export function patternFor(name: string): Pattern {
  return PATTERNS[MOVEMENT_PATTERN[name] ?? 'squat'] ?? PATTERNS.squat!
}

/**
 * Turn a tempo [eccentric, pause, concentric] into SMIL timing.
 * The rep runs top → bottom over the eccentric, holds for the pause, then
 * returns over the concentric — which is exactly how the tempo is prescribed.
 */
export function tempoTiming(tempo: [number, number, number]): { dur: number; keyTimes: string } {
  const [ecc, pause, con] = tempo
  const total = Math.max(0.5, ecc + pause + con)
  const t1 = ecc / total
  const t2 = (ecc + pause) / total
  return { dur: total, keyTimes: `0;${t1.toFixed(4)};${t2.toFixed(4)};1` }
}

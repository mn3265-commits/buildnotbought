import type { Alt, Exercise, Group, Rank, Role, Zone } from './types'

/** Weekly rotation Mon..Sun: Push · Pull · Legs · Rest · Lower · Upper · Rest. */
export const ROTATION: Group[] = ['Push', 'Pull', 'Legs', 'Rest', 'Lower', 'Upper', 'Rest']

/** role + swap alternatives keyed by exercise id. */
const META: Record<number, { role: Role; alts: Alt[] }> = {
  1: {
    role: 'key',
    alts: [
      { n: 'Dumbbell Bench Press', w: 'Shoulder-friendly, no spotter needed', start: 20, current: 28, goal: 36, inc: 2 },
      { n: 'Machine Chest Press', w: 'Safe to push near failure', start: 55, current: 75, goal: 95, inc: 2.5 },
      { n: 'Weighted Push-up', w: 'No equipment / travelling', start: 0, current: 15, goal: 30, inc: 2.5 },
    ],
  },
  2: {
    role: 'main',
    alts: [
      { n: 'Seated DB Shoulder Press', w: 'Easier on the lower back', start: 12, current: 17.5, goal: 22.5, inc: 1 },
      { n: 'Machine Shoulder Press', w: 'Stability handled for you', start: 32, current: 45, goal: 60, inc: 2.5 },
      { n: 'Arnold Press', w: 'Extra front-delt range', start: 11, current: 16, goal: 20, inc: 1 },
    ],
  },
  3: {
    role: 'accessory',
    alts: [
      { n: 'Incline Barbell Press', w: 'Heavier loading', start: 40, current: 55, goal: 72, inc: 2.5 },
      { n: 'Incline Machine Press', w: 'Fixed, guided path', start: 45, current: 60, goal: 78, inc: 2.5 },
      { n: 'Low-to-High Cable Fly', w: 'Constant tension', start: 9, current: 14, goal: 20, inc: 1 },
    ],
  },
  4: {
    role: 'accessory',
    alts: [
      { n: 'Overhead Cable Extension', w: 'Stretches the long head', start: 17, current: 27.5, goal: 38, inc: 2.5 },
      { n: 'Skull Crushers', w: 'Free-weight option', start: 15, current: 25, goal: 35, inc: 2.5 },
      { n: 'Bench Dips', w: 'Bodyweight, no cable', start: 0, current: 10, goal: 20, inc: 2.5 },
    ],
  },
  5: {
    role: 'accessory',
    alts: [
      { n: 'Cable Lateral Raise', w: 'Tension at the bottom', start: 5, current: 9, goal: 13, inc: 1 },
      { n: 'Machine Lateral Raise', w: 'Strictest form', start: 10, current: 16, goal: 22, inc: 2 },
      { n: 'Upright Row', w: 'Compound side-delt hit', start: 20, current: 30, goal: 42, inc: 2.5 },
    ],
  },
  6: {
    role: 'key',
    alts: [
      { n: 'Trap-Bar Deadlift', w: 'Kinder on the lower back', start: 88, current: 130, goal: 170, inc: 5 },
      { n: 'Rack Pull', w: 'Shorter range, heavier', start: 95, current: 140, goal: 185, inc: 5 },
      { n: 'Romanian Deadlift', w: 'More hamstring focus', start: 50, current: 90, goal: 120, inc: 5 },
    ],
  },
  7: {
    role: 'main',
    alts: [
      { n: 'Lat Pulldown', w: 'Scale the load exactly', start: 35, current: 55, goal: 70, inc: 2.5 },
      { n: 'Assisted Pull-up', w: 'Build up to bodyweight', start: 0, current: 8, goal: 18, inc: 2 },
      { n: 'Chin-up', w: 'More biceps involvement', start: 0, current: 12, goal: 25, inc: 2.5 },
    ],
  },
  8: {
    role: 'main',
    alts: [
      { n: 'Dumbbell Row', w: 'One arm at a time', start: 18, current: 28, goal: 36, inc: 2 },
      { n: 'Chest-Supported Row', w: 'No lower-back strain', start: 38, current: 60, goal: 80, inc: 2.5 },
      { n: 'Seated Cable Row', w: 'Constant tension', start: 42, current: 65, goal: 85, inc: 2.5 },
    ],
  },
  9: {
    role: 'accessory',
    alts: [
      { n: 'Pull-up', w: 'Bodyweight version', start: 0, current: 10, goal: 22, inc: 2.5 },
      { n: 'Straight-Arm Pulldown', w: 'Isolates the lats', start: 15, current: 25, goal: 35, inc: 2.5 },
      { n: 'Machine Pulldown', w: 'Fixed path', start: 38, current: 58, goal: 75, inc: 2.5 },
    ],
  },
  10: {
    role: 'accessory',
    alts: [
      { n: 'Dumbbell Curl', w: 'Even out both arms', start: 7, current: 12, goal: 18, inc: 1 },
      { n: 'Cable Curl', w: 'Constant tension', start: 14, current: 25, goal: 36, inc: 2 },
      { n: 'Preacher Curl', w: 'Strict, no swinging', start: 13, current: 22.5, goal: 33, inc: 2.5 },
    ],
  },
  11: {
    role: 'key',
    alts: [
      { n: 'Front Squat', w: 'Quad focus, easier on back', start: 48, current: 80, goal: 112, inc: 5 },
      { n: 'Hack Squat', w: 'Machine stability', start: 66, current: 110, goal: 155, inc: 5 },
      { n: 'Goblet Squat', w: 'Beginner / at home', start: 18, current: 28, goal: 38, inc: 2 },
    ],
  },
  12: {
    role: 'main',
    alts: [
      { n: 'Lying Leg Curl', w: 'Isolates the hamstrings', start: 24, current: 42, goal: 58, inc: 2.5 },
      { n: 'Good Morning', w: 'Same hip-hinge pattern', start: 25, current: 45, goal: 65, inc: 2.5 },
      { n: 'Dumbbell RDL', w: 'Lighter loading', start: 20, current: 32, goal: 44, inc: 2 },
    ],
  },
  13: {
    role: 'accessory',
    alts: [
      { n: 'Hack Squat', w: 'More quad emphasis', start: 66, current: 110, goal: 155, inc: 5 },
      { n: 'Bulgarian Split Squat', w: 'Single-leg / at home', start: 12, current: 20, goal: 30, inc: 2 },
      { n: 'Goblet Squat', w: 'No machine needed', start: 18, current: 28, goal: 38, inc: 2 },
    ],
  },
  14: {
    role: 'accessory',
    alts: [
      { n: 'Lying Leg Curl', w: 'Different angle', start: 24, current: 42, goal: 58, inc: 2.5 },
      { n: 'Nordic Curl', w: 'Bodyweight, brutal', start: 0, current: 2.5, goal: 10, inc: 2.5 },
      { n: 'Romanian Deadlift', w: 'Hip-hinge option', start: 50, current: 90, goal: 120, inc: 5 },
    ],
  },
  15: {
    role: 'accessory',
    alts: [
      { n: 'Seated Calf Raise', w: 'Targets the soleus', start: 32, current: 55, goal: 80, inc: 5 },
      { n: 'Leg-Press Calf Raise', w: 'Use the leg press', start: 70, current: 120, goal: 160, inc: 10 },
      { n: 'Single-Leg Calf Raise', w: 'No machine needed', start: 0, current: 10, goal: 25, inc: 2.5 },
    ],
  },
}

const BASE: Omit<Exercise, 'role' | 'alts'>[] = [
  {
    id: 1, group: 'Push', name: 'Bench Press', primary: 'Chest', muscles: ['Chest', 'Front Delts', 'Triceps'],
    scheme: '4 × 6–8', inc: 2.5, start: 50, current: 70, goal: 90, tempo: [3, 1, 1], hist: [55, 58, 62, 66, 68, 70],
    cues: [
      'Set your shoulder blades back and down, feet planted, slight arch in the lower back.',
      'Lower the bar to mid-chest with control over ~3 seconds, elbows tucked to ~45°.',
      'Drive the bar up and slightly back over the shoulders — squeeze the chest at the top.',
    ],
    mistakes: [
      'Flaring elbows straight out — stresses the shoulder joint.',
      'Bouncing the bar off the chest instead of controlling the descent.',
    ],
  },
  {
    id: 2, group: 'Push', name: 'Overhead Press', primary: 'Shoulders', muscles: ['Front Delts', 'Triceps', 'Upper Chest'],
    scheme: '4 × 6–8', inc: 2.5, start: 30, current: 42.5, goal: 55, tempo: [2, 1, 1], hist: [33, 36, 38, 40, 42, 42.5],
    cues: [
      'Grip just outside shoulders, brace your core and squeeze glutes to protect the spine.',
      'Press the bar straight overhead, moving your head slightly back then through.',
      'Lock out with the bar over your mid-foot, biceps by your ears.',
    ],
    mistakes: [
      'Leaning back and turning it into an incline press.',
      'Letting the bar drift forward away from your center of mass.',
    ],
  },
  {
    id: 3, group: 'Push', name: 'Incline DB Press', primary: 'Upper Chest', muscles: ['Upper Chest', 'Front Delts', 'Triceps'],
    scheme: '3 × 8–10', inc: 2, start: 18, current: 26, goal: 34, tempo: [3, 1, 1], hist: [20, 22, 23, 24, 25, 26],
    cues: [
      'Set the bench to 30°, dumbbells start at the lower-chest line.',
      'Press up and slightly inward, stopping just short of the tops touching.',
      'Lower slowly until you feel a stretch across the upper chest.',
    ],
    mistakes: [
      'Bench too steep — turns it into a shoulder press.',
      'Clanging the dumbbells together and losing tension.',
    ],
  },
  {
    id: 4, group: 'Push', name: 'Triceps Pushdown', primary: 'Triceps', muscles: ['Triceps'],
    scheme: '3 × 10–12', inc: 2.5, start: 20, current: 32.5, goal: 45, tempo: [2, 0, 1], hist: [24, 26, 28, 30, 31, 32.5],
    cues: [
      'Pin your elbows to your sides, lean slightly forward.',
      'Extend fully and squeeze the triceps hard at the bottom.',
      'Control the weight back up only to ~90° at the elbow.',
    ],
    mistakes: [
      'Letting the elbows drift forward and using the shoulders.',
      'Using momentum instead of a controlled squeeze.',
    ],
  },
  {
    id: 5, group: 'Push', name: 'Lateral Raise', primary: 'Side Delts', muscles: ['Side Delts'],
    scheme: '3 × 12–15', inc: 1, start: 8, current: 14, goal: 20, tempo: [2, 0, 1], hist: [9, 10, 11, 12, 13, 14],
    cues: [
      'Slight bend in the elbows, lead with the pinky side of the hand.',
      'Raise to shoulder height — imagine pouring from a jug.',
      'Lower under control; keep tension off the traps.',
    ],
    mistakes: [
      'Swinging with the whole body / going too heavy.',
      'Shrugging the traps up instead of isolating the side delts.',
    ],
  },
  {
    id: 6, group: 'Pull', name: 'Deadlift', primary: 'Back', muscles: ['Back', 'Glutes', 'Hamstrings', 'Traps'],
    scheme: '3 × 5', inc: 5, start: 80, current: 120, goal: 160, tempo: [2, 0, 1], hist: [95, 102, 108, 114, 118, 120],
    cues: [
      'Bar over mid-foot, hinge and grip just outside the knees.',
      'Take the slack out, brace, then drive the floor away with your legs.',
      'Lock out by squeezing the glutes — keep the bar close the whole way.',
    ],
    mistakes: [
      'Rounding the lower back under load.',
      'Jerking the bar off the floor instead of a smooth pull.',
    ],
  },
  {
    id: 7, group: 'Pull', name: 'Weighted Pull-up', primary: 'Lats', muscles: ['Lats', 'Biceps', 'Rear Delts'],
    scheme: '4 × 6–8', inc: 2.5, start: 0, current: 15, goal: 30, tempo: [3, 0, 1], hist: [5, 7.5, 10, 12.5, 14, 15],
    cues: [
      'Grip slightly wider than shoulders, start from a dead hang.',
      'Pull the elbows down and back, driving your chest to the bar.',
      'Lower all the way with control for a full stretch.',
    ],
    mistakes: [
      'Half-repping — not reaching a full dead hang.',
      'Kipping / using momentum to swing up.',
    ],
  },
  {
    id: 8, group: 'Pull', name: 'Barbell Row', primary: 'Back', muscles: ['Lats', 'Rhomboids', 'Rear Delts'],
    scheme: '4 × 8', inc: 2.5, start: 40, current: 65, goal: 85, tempo: [2, 1, 1], hist: [48, 52, 56, 60, 63, 65],
    cues: [
      'Hinge to ~45°, let the bar hang at arm’s length.',
      'Row to the lower ribs, driving the elbows past your torso.',
      'Squeeze the shoulder blades together, then lower with control.',
    ],
    mistakes: [
      'Standing too upright and turning it into a shrug.',
      'Using the lower back to heave the weight up.',
    ],
  },
  {
    id: 9, group: 'Pull', name: 'Lat Pulldown', primary: 'Lats', muscles: ['Lats', 'Biceps'],
    scheme: '3 × 10–12', inc: 2.5, start: 35, current: 55, goal: 70, tempo: [2, 1, 1], hist: [42, 46, 49, 52, 54, 55],
    cues: [
      'Slightly wider than shoulder grip, chest up and proud.',
      'Pull the bar to your upper chest, elbows driving down.',
      'Control the bar back up to a full stretch overhead.',
    ],
    mistakes: [
      'Leaning way back and using body swing.',
      'Pulling behind the neck — bad for the shoulders.',
    ],
  },
  {
    id: 10, group: 'Pull', name: 'Barbell Curl', primary: 'Biceps', muscles: ['Biceps', 'Forearms'],
    scheme: '3 × 8–10', inc: 2.5, start: 15, current: 27.5, goal: 40, tempo: [3, 0, 1], hist: [18, 21, 23, 25, 26, 27.5],
    cues: [
      'Elbows pinned at your sides, shoulder-width grip.',
      'Curl up by contracting the biceps — no swinging.',
      'Lower slowly for 3 seconds to a full stretch.',
    ],
    mistakes: [
      'Swinging the torso to throw the weight up.',
      'Letting the elbows drift forward at the top.',
    ],
  },
  {
    id: 11, group: 'Legs', name: 'Back Squat', primary: 'Quads', muscles: ['Quads', 'Glutes', 'Hamstrings'],
    scheme: '4 × 6', inc: 5, start: 60, current: 100, goal: 140, tempo: [3, 1, 1], hist: [74, 82, 88, 94, 98, 100],
    cues: [
      'Bar on upper traps, feet shoulder-width, toes slightly out.',
      'Brace, break at the hips and knees together, sit between your heels.',
      'Descend below parallel, then drive up through mid-foot.',
    ],
    mistakes: [
      'Knees caving inward on the way up.',
      'Rising with the hips first and dumping onto the lower back.',
    ],
  },
  {
    id: 12, group: 'Legs', name: 'Romanian Deadlift', primary: 'Hamstrings', muscles: ['Hamstrings', 'Glutes', 'Back'],
    scheme: '3 × 8–10', inc: 5, start: 50, current: 90, goal: 120, tempo: [3, 1, 1], hist: [62, 70, 78, 84, 88, 90],
    cues: [
      'Soft knees, push the hips straight back.',
      'Lower the bar along your legs until you feel a hamstring stretch.',
      'Drive the hips forward to stand — squeeze the glutes at the top.',
    ],
    mistakes: [
      'Bending the knees too much (turns into a squat).',
      'Rounding the back at the bottom of the stretch.',
    ],
  },
  {
    id: 13, group: 'Legs', name: 'Leg Press', primary: 'Quads', muscles: ['Quads', 'Glutes'],
    scheme: '3 × 10–12', inc: 10, start: 100, current: 180, goal: 260, tempo: [2, 1, 1], hist: [130, 145, 158, 168, 175, 180],
    cues: [
      'Feet shoulder-width mid-platform, back flat against the pad.',
      'Lower until knees reach ~90°, keeping heels down.',
      'Press through the whole foot — don’t lock the knees hard.',
    ],
    mistakes: [
      'Letting the lower back round off the pad at the bottom.',
      'Bouncing at the bottom of the rep.',
    ],
  },
  {
    id: 14, group: 'Legs', name: 'Seated Leg Curl', primary: 'Hamstrings', muscles: ['Hamstrings'],
    scheme: '3 × 12–15', inc: 2.5, start: 25, current: 45, goal: 60, tempo: [2, 1, 2], hist: [32, 36, 40, 42, 44, 45],
    cues: [
      'Pad just above the heels, thighs strapped down.',
      'Curl by contracting the hamstrings fully.',
      'Control the return slowly for 2–3 seconds.',
    ],
    mistakes: [
      'Lifting the hips off the seat to cheat the weight.',
      'Letting the weight slam back on the negative.',
    ],
  },
  {
    id: 15, group: 'Legs', name: 'Standing Calf Raise', primary: 'Calves', muscles: ['Calves'],
    scheme: '4 × 12–15', inc: 5, start: 40, current: 70, goal: 95, tempo: [2, 1, 1], hist: [52, 58, 62, 66, 68, 70],
    cues: [
      'Balls of the feet on the platform, heels free to drop.',
      'Lower into a deep stretch, then press up onto the toes.',
      'Pause and squeeze hard at the top of every rep.',
    ],
    mistakes: [
      'Bouncing through a short range of motion.',
      'Not pausing at the top or bottom — losing tension.',
    ],
  },
]

/** The seed exercise catalog (untailored baseline). Deep-clone before mutating. */
export const SEED_EXERCISES: Exercise[] = BASE.map((e) => ({
  ...e,
  role: META[e.id]?.role ?? 'accessory',
  alts: (META[e.id]?.alts ?? []).map((a) => ({ ...a })),
}))

/** Equipment lookup keyed by movement name (main lifts + every alternative). */
export const EQUIP: Record<string, string> = {
  'Bench Press': 'Barbell', 'Overhead Press': 'Barbell', 'Incline DB Press': 'Dumbbell', 'Triceps Pushdown': 'Cable', 'Lateral Raise': 'Dumbbell',
  Deadlift: 'Barbell', 'Weighted Pull-up': 'Bodyweight', 'Barbell Row': 'Barbell', 'Lat Pulldown': 'Cable', 'Barbell Curl': 'Barbell',
  'Back Squat': 'Barbell', 'Romanian Deadlift': 'Barbell', 'Leg Press': 'Machine', 'Seated Leg Curl': 'Machine', 'Standing Calf Raise': 'Machine',
  'Dumbbell Bench Press': 'Dumbbell', 'Machine Chest Press': 'Machine', 'Weighted Push-up': 'Bodyweight',
  'Seated DB Shoulder Press': 'Dumbbell', 'Machine Shoulder Press': 'Machine', 'Arnold Press': 'Dumbbell',
  'Incline Barbell Press': 'Barbell', 'Incline Machine Press': 'Machine', 'Low-to-High Cable Fly': 'Cable',
  'Overhead Cable Extension': 'Cable', 'Skull Crushers': 'Barbell', 'Bench Dips': 'Bodyweight',
  'Cable Lateral Raise': 'Cable', 'Machine Lateral Raise': 'Machine', 'Upright Row': 'Barbell',
  'Trap-Bar Deadlift': 'Barbell', 'Rack Pull': 'Barbell', 'Assisted Pull-up': 'Machine', 'Chin-up': 'Bodyweight',
  'Dumbbell Row': 'Dumbbell', 'Chest-Supported Row': 'Machine', 'Seated Cable Row': 'Cable',
  'Pull-up': 'Bodyweight', 'Straight-Arm Pulldown': 'Cable', 'Machine Pulldown': 'Machine',
  'Dumbbell Curl': 'Dumbbell', 'Cable Curl': 'Cable', 'Preacher Curl': 'Barbell',
  'Front Squat': 'Barbell', 'Hack Squat': 'Machine', 'Goblet Squat': 'Dumbbell',
  'Lying Leg Curl': 'Machine', 'Good Morning': 'Barbell', 'Dumbbell RDL': 'Dumbbell',
  'Bulgarian Split Squat': 'Dumbbell', 'Nordic Curl': 'Bodyweight', 'Leg-Press Calf Raise': 'Machine', 'Single-Leg Calf Raise': 'Bodyweight',
}

/** Simplified front body-map zones (viewBox 0 0 100 206). */
export const FRONT_ZONES: Zone[] = [
  { x: 39, y: 3, w: 22, h: 22, rx: 11, m: null },
  { x: 44, y: 23, w: 12, h: 8, rx: 3, m: null },
  { x: 15, y: 33, w: 22, h: 18, rx: 9, m: ['Front Delts'] },
  { x: 63, y: 33, w: 22, h: 18, rx: 9, m: ['Front Delts'] },
  { x: 10, y: 38, w: 7, h: 16, rx: 3.5, m: ['Side Delts'] },
  { x: 83, y: 38, w: 7, h: 16, rx: 3.5, m: ['Side Delts'] },
  { x: 32, y: 38, w: 36, h: 24, rx: 8, m: ['Chest', 'Upper Chest'] },
  { x: 36, y: 64, w: 28, h: 30, rx: 6, m: null },
  { x: 14, y: 50, w: 10, h: 30, rx: 5, m: ['Biceps'] },
  { x: 76, y: 50, w: 10, h: 30, rx: 5, m: ['Biceps'] },
  { x: 12, y: 82, w: 9, h: 28, rx: 4, m: ['Forearms'] },
  { x: 79, y: 82, w: 9, h: 28, rx: 4, m: ['Forearms'] },
  { x: 34, y: 94, w: 32, h: 14, rx: 6, m: null },
  { x: 34, y: 108, w: 14, h: 50, rx: 6, m: ['Quads'] },
  { x: 52, y: 108, w: 14, h: 50, rx: 6, m: ['Quads'] },
  { x: 34, y: 160, w: 14, h: 42, rx: 5, m: null },
  { x: 52, y: 160, w: 14, h: 42, rx: 5, m: null },
]

/** Simplified back body-map zones (viewBox 0 0 100 206). */
export const BACK_ZONES: Zone[] = [
  { x: 39, y: 3, w: 22, h: 22, rx: 11, m: null },
  { x: 44, y: 23, w: 12, h: 8, rx: 3, m: null },
  { x: 36, y: 28, w: 28, h: 16, rx: 6, m: ['Traps'] },
  { x: 15, y: 33, w: 22, h: 18, rx: 9, m: ['Rear Delts'] },
  { x: 63, y: 33, w: 22, h: 18, rx: 9, m: ['Rear Delts'] },
  { x: 32, y: 46, w: 36, h: 44, rx: 8, m: ['Lats', 'Rhomboids', 'Back'] },
  { x: 14, y: 50, w: 10, h: 30, rx: 5, m: ['Triceps'] },
  { x: 76, y: 50, w: 10, h: 30, rx: 5, m: ['Triceps'] },
  { x: 12, y: 82, w: 9, h: 28, rx: 4, m: null },
  { x: 79, y: 82, w: 9, h: 28, rx: 4, m: null },
  { x: 32, y: 92, w: 36, h: 20, rx: 10, m: ['Glutes'] },
  { x: 34, y: 114, w: 14, h: 44, rx: 6, m: ['Hamstrings'] },
  { x: 52, y: 114, w: 14, h: 44, rx: 6, m: ['Hamstrings'] },
  { x: 34, y: 162, w: 14, h: 40, rx: 5, m: ['Calves'] },
  { x: 52, y: 162, w: 14, h: 40, rx: 5, m: ['Calves'] },
]

export const RANKS: Rank[] = [
  { name: 'ROOKIE', min: 0 },
  { name: 'BUILDER', min: 1000 },
  { name: 'GRINDER', min: 2500 },
  { name: 'BEAST', min: 5000 },
  { name: 'TITAN', min: 9000 },
  { name: 'LEGEND', min: 15000 },
]

/** Bodyweight ratios used to tailor starting weights per lift. */
export const TAILOR_RATIOS: Record<number, number> = {
  1: 1.0, 2: 0.6, 3: 0.28, 4: 0.45, 5: 0.18, 6: 1.7, 7: 0.2, 8: 0.9,
  9: 0.8, 10: 0.4, 11: 1.4, 12: 1.2, 13: 2.4, 14: 0.6, 15: 1.0,
}

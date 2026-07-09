export type Group = 'Push' | 'Pull' | 'Legs' | 'Upper' | 'Lower' | 'Rest'
export type Role = 'key' | 'main' | 'accessory'
export type Unit = 'kg' | 'lb'

/** An alternative movement you can swap in for a lift. */
export interface Alt {
  /** name */
  n: string
  /** why you'd pick it */
  w: string
  start: number
  current: number
  goal: number
  inc: number
}

export interface Exercise {
  id: number
  group: Group
  name: string
  primary: string
  muscles: string[]
  scheme: string
  inc: number
  start: number
  current: number
  goal: number
  tempo: [number, number, number]
  hist: number[]
  cues: string[]
  mistakes: string[]
  role: Role
  alts: Alt[]
}

/** A body-map zone (viewBox 0 0 100 206). `m: null` zones are neutral filler. */
export interface Zone {
  x: number
  y: number
  w: number
  h: number
  rx: number
  m: string[] | null
}

export interface Rank {
  name: string
  min: number
}

export type MuscleState = 'done' | 'todo'

/** A single logged set inside an active workout. */
export interface WorkoutSet {
  weight: number
  reps: number
  goalReps: number
  target: number
  prev: string
  done: boolean
}

export interface WorkoutExercise {
  id: number
  name: string
  muscle: string
  next: number
  group: Group
  sets: WorkoutSet[]
}

export interface Workout {
  type: Group
  exercises: WorkoutExercise[]
}

/** A completed training session, saved to real history. */
export interface Session {
  id: string
  /** local YYYY-MM-DD */
  date: string
  type: Group
  exCount: number
  durationSec: number
  volumeKg: number
  hitCount: number
  setsDone: number
}

export type SummaryStatus = 'hit' | 'miss' | 'partial' | 'skipped'

export interface SummaryExercise {
  name: string
  status: SummaryStatus
  setsDone: number
  setsPlanned: number
  muscles: string[]
}

export interface Summary {
  type: Group
  duration: number
  totalVolume: number
  setsDone: number
  setsPlanned: number
  hitCount: number
  missCount: number
  exercises: SummaryExercise[]
  xpGained: number
  leveledUp: boolean
  newRank: string | null
  rankPct: number
  rankNext: string | null
}

export interface WeightEntry {
  label: string
  w: number
}

export interface Profile {
  bw: string
  height: string
}

export type FlashKind = { good: boolean; msg: string }

export type Screen =
  | 'home'
  | 'train'
  | 'library'
  | 'detail'
  | 'progress'
  | 'you'
  | 'program'
  | 'history'
  | 'body'
  | 'summary'
  | 'setup'
  | 'achievements'

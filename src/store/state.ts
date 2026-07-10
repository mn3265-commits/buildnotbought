import { ROTATION } from '../data/exercises'
import type { FlashKind, Group, LiftProgress, Profile, Screen, Session, Summary, Unit, WeightEntry, Workout } from '../data/types'

export interface AppState {
  // ── persisted ──
  program: Group[]
  profile: Profile
  tailoredDone: boolean
  weightLog: WeightEntry[]
  xp: number
  sessionsCompleted: number
  targetsHitTotal: number
  units: Record<string, Unit>
  swaps: Record<number, string>
  sessions: Session[]
  /**
   * Earned progression per movement name. Absent = never trained, so the
   * seeded/tailored baseline still applies. Written only by FINISH_WORKOUT.
   */
  lifts: Record<string, LiftProgress>

  // ── ephemeral / navigation ──
  screen: Screen
  filter: string
  exId: number
  progId: number
  workout: Workout | null
  elapsed: number
  rest: number
  restActive: boolean
  restOwner: { ei: number; si: number } | null
  restDur: number
  lastSummary: Summary | null
  logInput: string
  logModalOpen: boolean
  openSwap: number | null
  sharing: boolean
  flash: FlashKind | null
}

export const initialState: AppState = {
  program: ROTATION.slice(),
  profile: { bw: '', height: '' },
  tailoredDone: false,
  weightLog: [],
  xp: 0,
  sessionsCompleted: 0,
  targetsHitTotal: 0,
  units: {},
  swaps: {},
  sessions: [],
  lifts: {},

  screen: 'home',
  filter: 'All',
  exId: 11,
  progId: 11,
  workout: null,
  elapsed: 0,
  rest: 0,
  restActive: false,
  restOwner: null,
  restDur: 120,
  lastSummary: null,
  logInput: '',
  logModalOpen: false,
  openSwap: null,
  sharing: false,
  flash: null,
}

// Only these keys survive a refresh (personalized data). Live workout / nav is transient.
export const PERSIST_KEYS = [
  'program',
  'profile',
  'tailoredDone',
  'weightLog',
  'xp',
  'sessionsCompleted',
  'targetsHitTotal',
  'units',
  'swaps',
  'sessions',
  'lifts',
] as const

export const STORAGE_KEY = 'gym-tracker:v2'

export function loadPersisted(): Partial<AppState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const k of PERSIST_KEYS) {
      if (k in parsed) out[k] = parsed[k]
    }
    return out as Partial<AppState>
  } catch {
    return {}
  }
}

export function savePersisted(state: AppState): void {
  try {
    const out: Record<string, unknown> = {}
    for (const k of PERSIST_KEYS) out[k] = state[k]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out))
  } catch {
    /* storage unavailable — run in-memory */
  }
}

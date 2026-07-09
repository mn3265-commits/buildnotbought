import { initialState, type AppState } from './state'
import { SETTINGS } from './settings'
import type { FlashKind, Group, Screen, Session, Summary, SummaryStatus, Unit, Workout, WorkoutExercise } from '../data/types'
import { exercisesForType, fmtWeight, nextWeight, rankInfo, repTop, setCount, tailoredExercises } from '../lib/calc'
import { dayKey } from '../lib/day'

export type Action =
  | { type: 'NAV'; screen: Screen }
  | { type: 'OPEN_EX'; id: number }
  | { type: 'SET_PROG'; id: number }
  | { type: 'SET_FILTER'; filter: string }
  | { type: 'SET_PROFILE_FIELD'; k: 'bw' | 'height'; v: string }
  | { type: 'SET_LOG_INPUT'; v: string }
  | { type: 'OPEN_LOG' }
  | { type: 'CLOSE_LOG' }
  | { type: 'ADD_WEIGHT' }
  | { type: 'GENERATE_TARGETS' }
  | { type: 'TOGGLE_SWAP'; id: number }
  | { type: 'CHOOSE_SWAP'; id: number; name: string | null }
  | { type: 'SET_UNIT'; name: string; unit: Unit }
  | { type: 'START_WORKOUT'; trainType: Group }
  | { type: 'HYDRATE'; data: Partial<AppState> }
  | { type: 'TOGGLE_SET'; ei: number; si: number }
  | { type: 'BUMP'; ei: number; si: number; d: number }
  | { type: 'BUMP_REPS'; ei: number; si: number; d: number }
  | { type: 'ADD_SET'; ei: number }
  | { type: 'TICK_REST' }
  | { type: 'ADD_REST'; sec: number }
  | { type: 'SKIP_REST' }
  | { type: 'TICK_ELAPSED' }
  | { type: 'FINISH_WORKOUT' }
  | { type: 'CLOSE_SUMMARY' }
  | { type: 'SET_SHARING'; v: boolean }
  | { type: 'CLEAR_FLASH' }
  | { type: 'CYCLE_DAY'; i: number }
  | { type: 'RESET' }

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T

const effEx = (s: AppState) => tailoredExercises(s.profile.bw, s.tailoredDone)
const unitOf = (s: AppState, name: string): Unit => s.units[name] || 'kg'

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.data }
    case 'RESET':
      return { ...initialState }
    case 'NAV':
      return { ...state, screen: action.screen }
    case 'OPEN_EX':
      return { ...state, exId: action.id, screen: 'detail' }
    case 'SET_PROG':
      return { ...state, progId: action.id }
    case 'SET_FILTER':
      return { ...state, filter: action.filter }

    case 'SET_PROFILE_FIELD':
      return { ...state, profile: { ...state.profile, [action.k]: action.v } }

    case 'SET_LOG_INPUT':
      return { ...state, logInput: action.v }
    case 'OPEN_LOG':
      return { ...state, logModalOpen: true, logInput: '' }
    case 'CLOSE_LOG':
      return { ...state, logModalOpen: false, logInput: '' }

    case 'ADD_WEIGHT': {
      const w = parseFloat(state.logInput)
      if (!w || w < 25) return state
      const rounded = Math.round(w * 10) / 10
      return {
        ...state,
        weightLog: [...state.weightLog, { label: 'This week', w: rounded }].slice(-10),
        profile: { ...state.profile, bw: String(w) },
        logInput: '',
        logModalOpen: false,
      }
    }

    case 'GENERATE_TARGETS': {
      const bw = parseFloat(state.profile.bw)
      if (!bw || bw < 25) return state
      const log = state.weightLog
      const bwNum = Math.round(bw * 10) / 10
      const shouldLog = !log.length || log[log.length - 1]!.w !== bw
      return {
        ...state,
        tailoredDone: true,
        screen: 'home',
        weightLog: shouldLog ? [...log, { label: 'This week', w: bwNum }].slice(-10) : log,
      }
    }

    case 'TOGGLE_SWAP':
      return { ...state, openSwap: state.openSwap === action.id ? null : action.id }

    case 'CHOOSE_SWAP': {
      const { id, name } = action
      const sw = { ...state.swaps }
      if (name == null) delete sw[id]
      else sw[id] = name
      const src = effEx(state).find((x) => x.id === id)
      if (!src) return { ...state, swaps: sw, openSwap: null }
      const altObj = name ? src.alts.find((a) => a.n === name) : null
      const stats = altObj || src
      const dispName = altObj ? altObj.n : src.name
      const nx = Math.min(stats.current + stats.inc, stats.goal)
      const rt = repTop(src)
      let w = state.workout
      if (w) {
        w = clone(w)
        const wi = w.exercises.findIndex((e2) => e2.id === id)
        if (wi > -1) {
          w.exercises[wi]!.next = nx
          w.exercises[wi]!.sets = w.exercises[wi]!.sets.map(() => ({
            weight: nx,
            reps: rt,
            goalReps: rt,
            target: nx,
            prev: `${fmtWeight(stats.current, unitOf(state, dispName))} × ${rt}`,
            done: false,
          }))
        }
      }
      return { ...state, swaps: sw, openSwap: null, workout: w }
    }

    case 'SET_UNIT':
      return { ...state, units: { ...state.units, [action.name]: action.unit } }

    case 'START_WORKOUT': {
      const ex = effEx(state)
      const trainType = action.trainType
      const todayEx = exercisesForType(ex, trainType)
      const buildSets = (e: (typeof todayEx)[number]) => {
        const cnt = setCount(e)
        const nx = nextWeight(e)
        const rt = repTop(e)
        return Array.from({ length: cnt }, () => ({
          weight: nx,
          reps: rt,
          goalReps: rt,
          target: nx,
          prev: `${fmtWeight(e.current, unitOf(state, e.name))} × ${rt}`,
          done: false,
        }))
      }
      const workout: Workout = {
        type: trainType,
        exercises: todayEx.map<WorkoutExercise>((e) => ({
          id: e.id,
          name: e.name,
          muscle: e.primary,
          next: nextWeight(e),
          group: e.group,
          sets: buildSets(e),
        })),
      }
      return { ...state, workout, elapsed: 0, screen: 'train' }
    }

    case 'TICK_ELAPSED':
      return state.workout ? { ...state, elapsed: state.elapsed + 1 } : state

    case 'TOGGLE_SET': {
      if (!state.workout) return state
      const { ei, si } = action
      const w = clone(state.workout)
      const set = w.exercises[ei]!.sets[si]!
      const willBeDone = !set.done
      set.done = willBeDone
      let flash: FlashKind | null = null
      if (willBeDone) {
        if (set.weight >= set.target && set.reps >= set.goalReps) {
          flash = { good: true, msg: `SET ${si + 1} · TARGET HIT` }
        } else if (set.weight < set.target) {
          flash = { good: false, msg: `SET ${si + 1} · UNDER TARGET WEIGHT` }
        } else {
          const short = set.goalReps - set.reps
          flash = { good: false, msg: `SET ${si + 1} · ${short} REP${short > 1 ? 'S' : ''} SHORT` }
        }
      }
      if (willBeDone) {
        const dur = SETTINGS.restSeconds
        return { ...state, workout: w, flash, rest: dur, restDur: dur, restActive: true, restOwner: { ei, si } }
      }
      return { ...state, workout: w, flash }
    }

    case 'BUMP': {
      if (!state.workout) return state
      const w = clone(state.workout)
      const cell = w.exercises[action.ei]!.sets[action.si]!
      cell.weight = Math.max(0, Math.round((cell.weight + action.d) * 2) / 2)
      return { ...state, workout: w }
    }

    case 'BUMP_REPS': {
      if (!state.workout) return state
      const w = clone(state.workout)
      const cell = w.exercises[action.ei]!.sets[action.si]!
      cell.reps = Math.max(0, cell.reps + action.d)
      return { ...state, workout: w }
    }

    case 'ADD_SET': {
      if (!state.workout) return state
      const w = clone(state.workout)
      const arr = w.exercises[action.ei]!.sets
      const last = arr[arr.length - 1]!
      arr.push({ weight: last.weight, reps: last.reps, goalReps: last.goalReps, target: last.target, prev: '—', done: false })
      return { ...state, workout: w }
    }

    case 'TICK_REST': {
      if (!state.restActive) return state
      if (state.rest <= 1) return { ...state, rest: 0, restActive: false, restOwner: null }
      return { ...state, rest: state.rest - 1 }
    }
    case 'ADD_REST':
      return { ...state, rest: Math.max(0, state.rest + action.sec) }
    case 'SKIP_REST':
      return { ...state, restActive: false, rest: 0, restOwner: null }

    case 'FINISH_WORKOUT': {
      const w = state.workout
      let summary: Summary | null = null
      if (w) {
        const ex = effEx(state)
        let totalVolume = 0
        let setsDone = 0
        let setsPlanned = 0
        let hitCount = 0
        let missCount = 0
        const exercises = w.exercises.map((exi) => {
          const src = ex.find((x) => x.id === exi.id)!
          const swapName = state.swaps[exi.id] || src.name
          const doneSets = exi.sets.filter((s) => s.done)
          setsDone += doneSets.length
          setsPlanned += exi.sets.length
          doneSets.forEach((s) => {
            totalVolume += s.weight * s.reps
          })
          const allDone = exi.sets.length > 0 && exi.sets.every((s) => s.done)
          const allMet = allDone && exi.sets.every((s) => s.weight >= s.target && s.reps >= s.goalReps)
          let status: SummaryStatus = 'skipped'
          if (allDone) status = allMet ? 'hit' : 'miss'
          else if (doneSets.length > 0) status = 'partial'
          if (status === 'hit') hitCount++
          if (status === 'miss') missCount++
          return { name: swapName, status, setsDone: doneSets.length, setsPlanned: exi.sets.length, muscles: src.muscles }
        })
        const xpGained = setsDone > 0 ? setsDone * 10 + hitCount * 50 + 100 : 0
        const before = rankInfo(state.xp)
        const after = rankInfo(state.xp + xpGained)
        summary = {
          type: w.type,
          duration: state.elapsed,
          totalVolume,
          setsDone,
          setsPlanned,
          hitCount,
          missCount,
          exercises,
          xpGained,
          leveledUp: after.idx > before.idx,
          newRank: after.name,
          rankPct: after.pct,
          rankNext: after.next,
        }
      }
      const xpGained = summary?.xpGained ?? 0
      let sessions = state.sessions
      if (summary && summary.setsDone > 0) {
        const rec: Session = {
          id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
          date: dayKey(new Date()),
          type: summary.type,
          exCount: summary.exercises.length,
          durationSec: summary.duration,
          volumeKg: Math.round(summary.totalVolume),
          hitCount: summary.hitCount,
          setsDone: summary.setsDone,
        }
        sessions = [...state.sessions, rec].slice(-500)
      }
      return {
        ...state,
        workout: null,
        restActive: false,
        restOwner: null,
        rest: 0,
        flash: null,
        lastSummary: summary,
        screen: summary ? 'summary' : 'home',
        sessions,
        xp: state.xp + xpGained,
        sessionsCompleted: summary && summary.setsDone > 0 ? state.sessionsCompleted + 1 : state.sessionsCompleted,
        targetsHitTotal: summary && summary.setsDone > 0 ? state.targetsHitTotal + summary.hitCount : state.targetsHitTotal,
      }
    }

    case 'CLOSE_SUMMARY':
      return { ...state, screen: 'home' }
    case 'SET_SHARING':
      return { ...state, sharing: action.v }
    case 'CLEAR_FLASH':
      return { ...state, flash: null }

    case 'CYCLE_DAY': {
      const order: Group[] = ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Rest']
      const p = state.program.slice()
      p[action.i] = order[(order.indexOf(p[action.i]!) + 1) % order.length]!
      return { ...state, program: p }
    }

    default:
      return state
  }
}

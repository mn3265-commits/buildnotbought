import * as api from '../lib/api'
import { PERSIST_KEYS, type AppState } from './state'

export type PersistedBlob = Partial<AppState>

/** Extract only the personalized keys we sync/persist. */
export function pickPersisted(state: AppState): PersistedBlob {
  const out: Record<string, unknown> = {}
  for (const k of PERSIST_KEYS) out[k] = state[k]
  return out as PersistedBlob
}

export type LoadStatus = 'ok' | 'empty' | 'error'

/** Wire key carrying the snapshot time inside the synced blob. */
const TS_FIELD = '_ts'

/**
 * Load a user's saved blob from the cloud.
 * - 'ok'    → a row exists; `data` is the domain blob, `ts` when it was saved
 * - 'empty' → query succeeded but no row (brand-new account)
 * - 'error' → network/offline failure — caller must NOT wipe or overwrite data
 *
 * The blob carries a `_ts` stamp so the caller can tell a fresh cloud copy from
 * one older than unsynced offline edits. `_ts` is stripped from the returned
 * `data` so it never leaks into app state.
 */
export async function loadRemote(_userId: string): Promise<{ status: LoadStatus; data: PersistedBlob | null; ts: number }> {
  try {
    const { data } = await api.getState()
    if (data == null) return { status: 'empty', data: null, ts: 0 }
    const raw = data as Record<string, unknown>
    const ts = Number(raw[TS_FIELD]) || 0
    const clean = { ...raw }
    delete clean[TS_FIELD]
    return { status: 'ok', data: clean as PersistedBlob, ts }
  } catch (e) {
    console.warn('sync load failed', e)
    return { status: 'error', data: null, ts: 0 }
  }
}

/**
 * Upsert a user's blob to the cloud, stamped with `ts` (the local save time) so
 * another device — or this one after being offline — can resolve which copy is
 * newer. A failed push (offline) is swallowed: the local copy is authoritative
 * and the next successful push, or a reopen, carries the changes up.
 */
export async function saveRemote(_userId: string, blob: PersistedBlob, ts: number): Promise<void> {
  try {
    await api.putState({ ...blob, [TS_FIELD]: ts })
  } catch (e) {
    console.warn('sync save failed', e)
  }
}

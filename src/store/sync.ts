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

/**
 * Load a user's saved blob from the local backend.
 * - 'ok'    → a row exists, use its data
 * - 'empty' → query succeeded but no row (brand-new account)
 * - 'error' → network/other failure — caller must NOT wipe or overwrite data
 *
 * `_userId` is kept for call-site compatibility; the backend identifies the
 * user from the auth token, not this argument.
 */
export async function loadRemote(_userId: string): Promise<{ status: LoadStatus; data: PersistedBlob | null }> {
  try {
    const { data } = await api.getState()
    if (data == null) return { status: 'empty', data: null }
    return { status: 'ok', data: data as PersistedBlob }
  } catch (e) {
    console.warn('sync load failed', e)
    return { status: 'error', data: null }
  }
}

/** Upsert a user's blob to the local backend. */
export async function saveRemote(_userId: string, blob: PersistedBlob): Promise<void> {
  try {
    await api.putState(blob)
  } catch (e) {
    console.warn('sync save failed', e)
  }
}

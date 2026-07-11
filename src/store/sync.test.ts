import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the network layer so we can assert exactly what crosses the wire.
const getState = vi.fn()
const putState = vi.fn()
vi.mock('../lib/api', () => ({ getState: () => getState(), putState: (d: unknown) => putState(d) }))

import { loadRemote, saveRemote } from './sync'

beforeEach(() => {
  getState.mockReset()
  putState.mockReset()
})

describe('saveRemote', () => {
  it('stamps the blob with the save time', async () => {
    putState.mockResolvedValue(undefined)
    await saveRemote('u', { xp: 5 } as never, 1234)
    expect(putState).toHaveBeenCalledWith({ xp: 5, _ts: 1234 })
  })

  it('swallows an offline failure instead of throwing', async () => {
    putState.mockRejectedValue(new Error('offline'))
    await expect(saveRemote('u', { xp: 5 } as never, 1)).resolves.toBeUndefined()
  })
})

describe('loadRemote', () => {
  it('returns the server ts and strips _ts from the data', async () => {
    getState.mockResolvedValue({ data: { xp: 9, _ts: 5000 } })
    const r = await loadRemote('u')
    expect(r.status).toBe('ok')
    expect(r.ts).toBe(5000)
    expect(r.data).toEqual({ xp: 9 }) // _ts must not leak into app state
  })

  it('treats a blob with no _ts as ts 0 (older than any local edit)', async () => {
    getState.mockResolvedValue({ data: { xp: 9 } })
    const r = await loadRemote('u')
    expect(r.ts).toBe(0)
    expect(r.data).toEqual({ xp: 9 })
  })

  it('reports empty for a brand-new account', async () => {
    getState.mockResolvedValue({ data: null })
    expect((await loadRemote('u')).status).toBe('empty')
  })

  it('reports error when offline, never throwing', async () => {
    getState.mockRejectedValue(new Error('offline'))
    const r = await loadRemote('u')
    expect(r.status).toBe('error')
    expect(r.data).toBeNull()
  })
})

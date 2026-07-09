// Client for the local backend (server/). Same-origin, so paths are relative —
// this works unchanged whether you open localhost or the ngrok URL.
export interface ApiUser {
  id: string
  email: string
}

const TOKEN_KEY = 'gym-tracker:token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable */
  }
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
  })
  const body = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new Error(body?.error || `Request failed (${res.status})`)
  return body
}

export async function signUp(email: string, password: string): Promise<{ user: ApiUser }> {
  const { user, token } = await api<{ user: ApiUser; token: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(token)
  return { user }
}

export async function signIn(email: string, password: string): Promise<{ user: ApiUser }> {
  const { user, token } = await api<{ user: ApiUser; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(token)
  return { user }
}

export async function fetchSession(): Promise<ApiUser | null> {
  if (!getToken()) return null
  try {
    const { user } = await api<{ user: ApiUser | null }>('/auth/session')
    return user
  } catch {
    return null
  }
}

export async function signOut(): Promise<void> {
  try {
    await api('/auth/logout', { method: 'POST' })
  } catch {
    /* ignore — clear token regardless */
  }
  setToken(null)
}

export async function getState(): Promise<{ data: unknown | null }> {
  return api<{ data: unknown | null }>('/state')
}

export async function putState(data: unknown): Promise<void> {
  await api('/state', { method: 'PUT', body: JSON.stringify({ data }) })
}

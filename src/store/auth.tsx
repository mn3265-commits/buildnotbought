import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as api from '../lib/api'
import type { ApiUser } from '../lib/api'

interface AuthResult {
  error: { message: string } | null
}

interface AuthContextValue {
  user: ApiUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<AuthResult & { needsConfirmation: boolean }>
  signOut: () => Promise<void>
}

const AuthCtx = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore the session on load from a stored token (if any).
  useEffect(() => {
    let cancelled = false
    api.fetchSession().then((u) => {
      if (!cancelled) {
        setUser(u)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        try {
          const { user: u } = await api.signIn(email, password)
          setUser(u)
          return { error: null }
        } catch (e) {
          return { error: { message: e instanceof Error ? e.message : 'Sign in failed.' } }
        }
      },
      signUp: async (email, password) => {
        try {
          const { user: u } = await api.signUp(email, password)
          setUser(u)
          // Local accounts sign in immediately — no email confirmation step.
          return { error: null, needsConfirmation: false }
        } catch (e) {
          return { error: { message: e instanceof Error ? e.message : 'Sign up failed.' }, needsConfirmation: false }
        }
      },
      signOut: async () => {
        await api.signOut()
        setUser(null)
      },
    }),
    [user, loading],
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

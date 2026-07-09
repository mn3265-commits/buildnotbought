// Local backend for Gym Tracker: serves the built app + a tiny JSON API,
// backed by SQLite. Replaces Supabase (auth + per-user state blob).
// Expose to your phone with:  ngrok http 3000
import express from 'express'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { db } from './db.js'
import { login, logout, signup, userForToken } from './auth.js'

const here = dirname(fileURLToPath(import.meta.url))
const DIST = resolve(here, '..', 'dist-single')
const PORT = Number(process.env.PORT || 3000)

const app = express()
app.use(express.json({ limit: '5mb' }))

// ── helpers ──
const bearer = (req) => (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || null
function requireUser(req, res) {
  const user = userForToken(bearer(req))
  if (!user) {
    res.status(401).json({ error: 'Not authenticated.' })
    return null
  }
  return user
}

// ── auth ──
app.post('/api/auth/signup', (req, res) => {
  const { email, password } = req.body || {}
  const result = signup(email, password)
  if (result.error) return res.status(400).json(result)
  res.json(result) // { user, token }
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const result = login(email, password)
  if (result.error) return res.status(401).json(result)
  res.json(result) // { user, token }
})

app.get('/api/auth/session', (req, res) => {
  const user = userForToken(bearer(req))
  res.json({ user: user || null })
})

app.post('/api/auth/logout', (req, res) => {
  logout(bearer(req))
  res.json({ ok: true })
})

// ── per-user state blob (was the Supabase `app_state` table) ──
app.get('/api/state', (req, res) => {
  const user = requireUser(req, res)
  if (!user) return
  const row = db.prepare('SELECT data FROM app_state WHERE user_id = ?').get(user.id)
  if (!row) return res.json({ data: null }) // brand-new account
  res.json({ data: JSON.parse(row.data) })
})

app.put('/api/state', (req, res) => {
  const user = requireUser(req, res)
  if (!user) return
  const data = JSON.stringify((req.body && req.body.data) ?? {})
  db.prepare(
    `INSERT INTO app_state (user_id, data, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
  ).run(user.id, data, new Date().toISOString())
  res.json({ ok: true })
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// ── static app (built single-file bundle) with SPA fallback ──
if (existsSync(DIST)) {
  app.use(express.static(DIST))
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(resolve(DIST, 'index.html')))
} else {
  console.warn('[server] dist-single/ not built yet — run `npm run build` to serve the app. API is live.')
}

app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}  (API under /api)`) // ngrok http ${PORT} to share
})

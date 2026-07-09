// Password hashing (scrypt, from node:crypto — no dependencies) + token sessions.
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { db } from './db.js'

function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const hash = Buffer.from(hashHex, 'hex')
  const test = scryptSync(password, Buffer.from(saltHex, 'hex'), 64)
  return hash.length === test.length && timingSafeEqual(hash, test)
}

const nowISO = () => new Date().toISOString()

/** Create an account and start a session. Returns { user, token } or { error }. */
export function signup(email, password) {
  email = String(email || '').trim().toLowerCase()
  if (!/\S+@\S+\.\S+/.test(email)) return { error: 'Enter a valid email address.' }
  if (String(password || '').length < 6) return { error: 'Password must be at least 6 characters.' }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) return { error: 'An account with this email already exists.' }

  const id = randomUUID()
  db.prepare('INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)').run(
    id,
    email,
    hashPassword(password),
    nowISO(),
  )
  const token = issueToken(id)
  return { user: { id, email }, token }
}

/** Verify credentials and start a session. Returns { user, token } or { error }. */
export function login(email, password) {
  email = String(email || '').trim().toLowerCase()
  const row = db.prepare('SELECT id, email, password_hash FROM users WHERE email = ?').get(email)
  if (!row || !verifyPassword(password, row.password_hash)) {
    return { error: 'Invalid email or password.' }
  }
  const token = issueToken(row.id)
  return { user: { id: row.id, email: row.email }, token }
}

function issueToken(userId) {
  const token = randomBytes(32).toString('hex')
  db.prepare('INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)').run(token, userId, nowISO())
  return token
}

/** Resolve a bearer token to { id, email } or null. */
export function userForToken(token) {
  if (!token) return null
  const row = db
    .prepare('SELECT u.id AS id, u.email AS email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?')
    .get(token)
  return row || null
}

export function logout(token) {
  if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

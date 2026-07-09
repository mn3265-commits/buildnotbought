# Gym Tracker

A personalized, dark/athletic gym tracker for muscle gain — built from a Claude Design
prototype into a real React app. Track a Push · Pull · Legs · Rest · Lower · Upper · Rest
split, log workouts against **target weights** that tell you exactly what to hit to grow,
swap movements when equipment is busy, and watch a live body map light up as you train.

Mobile-first single-page app (390×844 phone frame), state persisted to `localStorage`.

## Features

- **Home** — current rank & XP, week streak, today's split day, week strip, next-target lifts.
- **Train** — live logging with the killer feature: a per-exercise **target banner**
  ("Do all 4 sets × 6 reps at 105 kg") that turns green when smashed. Per-set weight/rep
  steppers, target hit/miss flashes, an inline **rest timer** (−15/+15/Skip), per-exercise
  **KG/LB** toggle, in-workout **movement swaps**, and a live **muscle map**.
- **Library + Exercise Detail** — every lift with role badge (KEY LIFT / CORE / EXTRA),
  equipment, animated tempo guide, a drop-in form-video slot, muscles worked, how-to cues,
  mistakes to avoid, and swap alternatives (each with its own weight range).
- **Progress** — per-lift goal chart (start → current → next → goal) and all-lifts overview.
- **You** — profile hub → Program builder, History calendar, Body Stats, Targets, Achievements.
- **Program builder** — tap any day to cycle its focus.
- **Body Stats** — bodyweight trend, BMI, protein target, a weekly log **popup** that
  previews BMI/protein as you type, measurements, and progress-photo slots.
- **Session Summary** — recap with duration, volume, targets hit, rank-up, muscle map,
  per-exercise HIT/MISSED/PARTIAL/SKIPPED, and a **transparent-PNG share card** for stories.
- **Setup** — enter bodyweight + height to auto-tailor realistic starting weights for every lift.

## Tech

- **React 18 + TypeScript + Vite**
- Central store: `useReducer` + Context, timers via effects, persistence to `localStorage`
  (`src/store/`). Pure calc/logic in `src/lib/calc.ts`, seed data in `src/data/`.
- The per-screen view model (`src/store/viewModel.ts`) is a faithful port of the prototype's
  render logic; screens (`src/screens/`) mirror the prototype markup with inline styles for
  pixel fidelity.

## Develop

```bash
npm install
npm run dev        # runs the API (:3000) + Vite dev server together; Vite proxies /api → :3000
npm run typecheck  # tsc, no emit
```

## Backend & data

Accounts and per-user data live in a **local SQLite file** (`data/gym.db`), served by a
tiny Express API in `server/` — no Supabase, no cloud. The client talks to it via relative
`/api/...` paths (`src/lib/api.ts`), so the same build works on `localhost` or through an
ngrok tunnel.

- `POST /api/auth/signup` · `POST /api/auth/login` · `GET /api/auth/session` · `POST /api/auth/logout`
- `GET /api/state` · `PUT /api/state` — the personalized JSON blob, one row per account
- Passwords are hashed with scrypt; sessions are bearer tokens stored in `localStorage`.
- `data/` is git-ignored — your database never leaves your machine.

## Run & share (localhost + ngrok)

```bash
npm start          # build the single-file app + serve app and API on http://localhost:3000
# in another terminal:
npm run tunnel     # ngrok http 3000 → a public https URL you can open on your phone
```

First-time ngrok setup: `brew install ngrok`, then `ngrok config add-authtoken <token>`
(from https://dashboard.ngrok.com). Open the printed `https://…ngrok…app` URL on your
phone, sign up once, and your data persists to the SQLite file on your Mac.

The app uses the Anton / Archivo / Archivo Expanded webfonts from Google Fonts (see
`index.html`); it degrades to system fonts where that CDN is unreachable.

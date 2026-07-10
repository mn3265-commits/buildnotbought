import { useEffect, useState } from 'react'
import { patternFor, tempoTiming, type Pattern, type Pose } from '../data/movements'
import { VOLT } from '../data/tokens'

/** Honour the OS "reduce motion" setting — the figure freezes at the top of the rep. */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/**
 * An animated, tempo-accurate demonstration of a movement.
 *
 * The figure is a joint hierarchy (pelvis → torso → shoulder → elbow, and
 * pelvis → hip → knee). Each joint sits in its own <g>: an outer group carries
 * the translate down the limb, an inner group carries only the rotation, so a
 * joint always pivots on itself. The rotation tweens top → bottom → hold → top
 * over the exercise's real tempo, which is why the loop matches the prescription.
 */

const LIMB = 4.4
const DIM = '#3a3a44'

// segment lengths
const TORSO = 26
const UPPER_ARM = 13
const FOREARM = 13
const THIGH = 18
const SHIN = 18

interface Props {
  /** movement name, e.g. "Back Squat" */
  name: string
  tempo: [number, number, number]
  /** force-freeze the loop; reduced-motion users freeze automatically */
  paused?: boolean
}

const SPLINES = '.42 0 .58 1;0 0 1 1;.42 0 .58 1'

/**
 * One joint: rotates top → bottom → hold → top.
 * When frozen it must still hold the top pose — an unrotated joint would
 * collapse the figure into a meaningless T.
 */
function Joint({
  from,
  to,
  dur,
  keyTimes,
  paused,
  children,
}: {
  from: number
  to: number
  dur: number
  keyTimes: string
  paused: boolean
  children: React.ReactNode
}) {
  if (paused || from === to) return <g transform={`rotate(${from})`}>{children}</g>
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values={`${from};${to};${to};${from}`}
        keyTimes={keyTimes}
        calcMode="spline"
        keySplines={SPLINES}
        dur={`${dur}s`}
        repeatCount="indefinite"
      />
      {children}
    </g>
  )
}

/** Pelvis travel — what actually makes a squat look deep. */
function Travel({
  a,
  b,
  dur,
  keyTimes,
  paused,
  children,
}: {
  a: Pose
  b: Pose
  dur: number
  keyTimes: string
  paused: boolean
  children: React.ReactNode
}) {
  if (paused || (a.dx === b.dx && a.dy === b.dy)) return <g transform={`translate(${a.dx},${a.dy})`}>{children}</g>
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values={`${a.dx},${a.dy};${b.dx},${b.dy};${b.dx},${b.dy};${a.dx},${a.dy}`}
        keyTimes={keyTimes}
        calcMode="spline"
        keySplines={SPLINES}
        dur={`${dur}s`}
        repeatCount="indefinite"
      />
      {children}
    </g>
  )
}

function Prop({ p }: { p: Pattern['prop'] }) {
  const s = { stroke: '#2c2c34', strokeWidth: 3, strokeLinecap: 'round' as const }
  const floor = <line x1="12" y1="96" x2="88" y2="96" {...s} />
  switch (p) {
    case 'bench':
      return (
        <>
          {floor}
          <line x1="20" y1="70" x2="80" y2="70" {...s} strokeWidth={5} />
        </>
      )
    case 'incline':
      return (
        <>
          {floor}
          <line x1="26" y1="88" x2="72" y2="44" {...s} strokeWidth={5} />
        </>
      )
    case 'legPress':
      return (
        <>
          {floor}
          <line x1="26" y1="88" x2="84" y2="46" {...s} strokeWidth={5} />
        </>
      )
    case 'seat':
      return (
        <>
          {floor}
          <line x1="30" y1="80" x2="66" y2="80" {...s} strokeWidth={5} />
          <line x1="30" y1="80" x2="30" y2="58" {...s} />
        </>
      )
    case 'bar':
      return <line x1="20" y1="12" x2="80" y2="12" {...s} strokeWidth={4} />
    case 'cable':
      return (
        <>
          <line x1="72" y1="8" x2="72" y2="22" {...s} strokeWidth={2} />
          <line x1="60" y1="8" x2="84" y2="8" {...s} />
        </>
      )
    default:
      return floor
  }
}

function Load({ pattern }: { pattern: Pattern }) {
  if (pattern.load === 'none') return null
  if (pattern.load === 'barbell') {
    return (
      <>
        <circle cx="0" cy="0" r="6.5" fill="none" stroke={VOLT} strokeWidth="2.6" />
        <circle cx="0" cy="0" r="1.6" fill={VOLT} />
      </>
    )
  }
  if (pattern.load === 'dumbbell') {
    return <rect x="-5" y="-2.6" width="10" height="5.2" rx="2.2" fill={VOLT} />
  }
  return <circle cx="0" cy="0" r="3.2" fill={VOLT} />
}

export function MovementPreview({ name, tempo, paused: forcePaused = false }: Props) {
  const reduced = usePrefersReducedMotion()
  const paused = forcePaused || reduced
  const pattern = patternFor(name)
  const { dur, keyTimes } = tempoTiming(tempo)
  const a: Pose = pattern.top
  const b: Pose = pattern.bottom
  const j = (from: number, to: number, children: React.ReactNode) => (
    <Joint from={from} to={to} dur={dur} keyTimes={keyTimes} paused={paused}>
      {children}
    </Joint>
  )

  const { x: ox, y: oy } = pattern.origin ?? { x: 46, y: 56 }

  const arm = (color: string, width: number, showLoad: boolean) => (
    <g transform={`translate(0,${-TORSO + 2})`}>
      {j(
        a.shoulder,
        b.shoulder,
        <>
          <line x1="0" y1="0" x2="0" y2={UPPER_ARM} stroke={color} strokeWidth={width} strokeLinecap="round" />
          <g transform={`translate(0,${UPPER_ARM})`}>
            {j(
              a.elbow,
              b.elbow,
              <>
                <line x1="0" y1="0" x2="0" y2={FOREARM} stroke={color} strokeWidth={width} strokeLinecap="round" />
                {showLoad && (
                  <g transform={`translate(0,${FOREARM})`}>
                    <Load pattern={pattern} />
                  </g>
                )}
              </>,
            )}
          </g>
        </>,
      )}
    </g>
  )

  const leg = (color: string, width: number) =>
    j(
      a.hip,
      b.hip,
      <>
        <line x1="0" y1="0" x2="0" y2={THIGH} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <g transform={`translate(0,${THIGH})`}>
          {j(
            a.knee,
            b.knee,
            <>
              <line x1="0" y1="0" x2="0" y2={SHIN} stroke={color} strokeWidth={width} strokeLinecap="round" />
              <line x1="0" y1={SHIN} x2="7" y2={SHIN} stroke={color} strokeWidth={width * 0.8} strokeLinecap="round" />
            </>,
          )}
        </g>
      </>,
    )

  return (
    <svg viewBox="0 0 100 104" style={{ width: '100%', height: '100%', display: 'block' }} aria-label={`${name} demonstration`} role="img">
      <Prop p={pattern.prop} />

      <g transform={`translate(${ox},${oy})${pattern.rootRot ? ` rotate(${pattern.rootRot})` : ''}`}>
        <Travel a={a} b={b} dur={dur} keyTimes={keyTimes} paused={paused}>
          {/* far limbs sit behind and slightly off-axis, so they read as depth
              rather than as a perfectly overlapping duplicate */}
          <g transform="translate(-3.5,0)" opacity="0.75">
            {leg(DIM, LIMB * 0.85)}
          </g>

          {j(
            a.torso,
            b.torso,
            <>
              <g transform="translate(-3.5,0)" opacity="0.75">
                {arm(DIM, LIMB * 0.85, false)}
              </g>
              <line x1="0" y1="0" x2="0" y2={-TORSO} stroke="#F4F4F5" strokeWidth={LIMB + 1.2} strokeLinecap="round" />
              <circle cx="0" cy={-TORSO - 8} r="6.4" fill="none" stroke="#F4F4F5" strokeWidth="2.6" />
              {arm('#F4F4F5', LIMB, pattern.load !== 'none')}
            </>,
          )}

          {leg('#F4F4F5', LIMB)}
        </Travel>
      </g>
    </svg>
  )
}

import { useEffect, useState } from 'react'
import { SEG, distPt, patternFor, repPath, sceneSkeleton, tempoTiming, type Pattern, type Pose } from '../data/movements'
import { VOLT } from '../data/tokens'

/**
 * An animated, tempo-accurate demonstration of a movement.
 *
 * A stick figure alone is unreadable — you can't tell a squat from a good
 * morning. Three things carry the meaning instead:
 *   1. the equipment, drawn properly (a rack, a bench, a cable stack);
 *   2. a ghost of the far end of the rep, so both positions are visible at once;
 *   3. an arrow along the path the bar actually travels.
 *
 * The figure is a joint hierarchy (pelvis → torso → shoulder → elbow, and
 * pelvis → hip → knee). An outer <g> carries the translate down the limb, an
 * inner <g> carries only the rotation, so a joint always pivots on itself.
 * Rotations tween top → bottom → hold → top over the lift's real tempo.
 */

const BONE = 5.4
const BODY = '#F4F4F5'
const GHOST = '#4a4a55'
const STEEL = '#33333c'

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

const SPLINES = '.42 0 .58 1;0 0 1 1;.42 0 .58 1'

interface Timing {
  dur: number
  keyTimes: string
  paused: boolean
}

/** One joint. Frozen, it must still hold its pose — an unrotated joint is a broken T. */
function Joint({ from, to, t, children }: { from: number; to: number; t: Timing; children: React.ReactNode }) {
  if (t.paused || from === to) return <g transform={`rotate(${from})`}>{children}</g>
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values={`${from};${to};${to};${from}`}
        keyTimes={t.keyTimes}
        calcMode="spline"
        keySplines={SPLINES}
        dur={`${t.dur}s`}
        repeatCount="indefinite"
      />
      {children}
    </g>
  )
}

/** Pelvis travel — what actually makes a squat look deep. */
function Travel({ a, b, t, children }: { a: Pose; b: Pose; t: Timing; children: React.ReactNode }) {
  if (t.paused || (a.dx === b.dx && a.dy === b.dy)) return <g transform={`translate(${a.dx},${a.dy})`}>{children}</g>
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values={`${a.dx},${a.dy};${b.dx},${b.dy};${b.dx},${b.dy};${a.dx},${a.dy}`}
        keyTimes={t.keyTimes}
        calcMode="spline"
        keySplines={SPLINES}
        dur={`${t.dur}s`}
        repeatCount="indefinite"
      />
      {children}
    </g>
  )
}

/** The load in the hands. Drawn at the wrist, so it follows the arm for free. */
function Load({ load, color }: { load: Pattern['load']; color: string }) {
  if (load === 'none') return null
  if (load === 'barbell')
    return (
      <>
        <line x1="-7" y1="0" x2="7" y2="0" stroke={color} strokeWidth="1.6" />
        <circle cx="0" cy="0" r="6.2" fill="none" stroke={color} strokeWidth="2.8" />
      </>
    )
  if (load === 'dumbbell')
    return (
      <>
        <line x1="0" y1="-4.6" x2="0" y2="4.6" stroke={color} strokeWidth="1.6" />
        <rect x="-3.4" y="-5.6" width="6.8" height="3" rx="1.2" fill={color} />
        <rect x="-3.4" y="2.6" width="6.8" height="3" rx="1.2" fill={color} />
      </>
    )
  return <rect x="-5" y="-1.8" width="10" height="3.6" rx="1.8" fill={color} />
}

/** Equipment. This is most of what tells you which lift you're looking at. */
function Rig({ pattern }: { pattern: Pattern }) {
  const s = { stroke: STEEL, strokeLinecap: 'round' as const }
  const floor = <line x1="8" y1="96" x2="92" y2="96" {...s} strokeWidth={3} />
  switch (pattern.prop) {
    case 'bench':
      return (
        <>
          {floor}
          <line x1="20" y1="64" x2="64" y2="64" {...s} strokeWidth={6} />
          <line x1="26" y1="66" x2="26" y2="96" {...s} strokeWidth={3} />
          <line x1="60" y1="66" x2="60" y2="96" {...s} strokeWidth={3} />
        </>
      )
    case 'incline':
      return (
        <>
          {floor}
          <line x1="26" y1="90" x2="72" y2="44" {...s} strokeWidth={6} />
          <line x1="30" y1="90" x2="30" y2="96" {...s} strokeWidth={3} />
          <line x1="66" y1="52" x2="66" y2="96" {...s} strokeWidth={3} />
        </>
      )
    case 'legPress':
      return (
        <>
          {floor}
          {/* the sled */}
          <line x1="58" y1="74" x2="90" y2="42" {...s} strokeWidth={6} />
          <line x1="20" y1="88" x2="54" y2="88" {...s} strokeWidth={5} />
          <line x1="24" y1="90" x2="24" y2="96" {...s} strokeWidth={3} />
        </>
      )
    case 'seat':
      return (
        <>
          {floor}
          <line x1="30" y1="80" x2="66" y2="80" {...s} strokeWidth={6} />
          <line x1="30" y1="80" x2="30" y2="56" {...s} strokeWidth={5} />
          <line x1="48" y1="82" x2="48" y2="96" {...s} strokeWidth={3} />
        </>
      )
    case 'bar':
      return (
        <>
          {floor}
          <line x1="18" y1="15" x2="82" y2="15" {...s} strokeWidth={4} />
          <line x1="20" y1="15" x2="20" y2="96" {...s} strokeWidth={2.4} />
          <line x1="80" y1="15" x2="80" y2="96" {...s} strokeWidth={2.4} />
        </>
      )
    case 'cable':
      return (
        <>
          {floor}
          {/* stack + pulley */}
          <rect x="70" y="20" width="16" height="40" rx="2" fill="none" stroke={STEEL} strokeWidth="2.4" />
          <line x1="70" y1="30" x2="86" y2="30" {...s} strokeWidth={2} />
          <line x1="70" y1="40" x2="86" y2="40" {...s} strokeWidth={2} />
        </>
      )
    case 'rack':
      return (
        <>
          {floor}
          <line x1="14" y1="96" x2="14" y2="30" {...s} strokeWidth={2.6} opacity="0.6" />
          <line x1="14" y1="36" x2="23" y2="34" {...s} strokeWidth={2.6} opacity="0.6" />
          <line x1="86" y1="96" x2="86" y2="30" {...s} strokeWidth={2.6} opacity="0.6" />
          <line x1="86" y1="36" x2="77" y2="34" {...s} strokeWidth={2.6} opacity="0.6" />
        </>
      )
    default:
      return floor
  }
}

/** The articulated body. `from`/`to` equal ⇒ a static pose, used for the ghost. */
function Figure({
  pattern,
  from,
  to,
  t,
  color,
  opacity = 1,
  showLoad = true,
}: {
  pattern: Pattern
  from: Pose
  to: Pose
  t: Timing
  color: string
  opacity?: number
  showLoad?: boolean
}) {
  const j = (a: number, b: number, children: React.ReactNode) => (
    <Joint from={a} to={b} t={t}>
      {children}
    </Joint>
  )
  const bone = (len: number, w = BONE) => <line x1="0" y1="0" x2="0" y2={len} stroke={color} strokeWidth={w} strokeLinecap="round" />

  const arm = (w: number, load: boolean) => (
    <g transform={`translate(0,${-SEG.TORSO + 2})`}>
      {j(
        from.shoulder,
        to.shoulder,
        <>
          {bone(SEG.UPPER_ARM, w)}
          <g transform={`translate(0,${SEG.UPPER_ARM})`}>
            {j(
              from.elbow,
              to.elbow,
              <>
                {bone(SEG.FOREARM, w)}
                <g transform={`translate(0,${SEG.FOREARM})`}>{load && <Load load={pattern.load} color={color === BODY ? VOLT : color} />}</g>
              </>,
            )}
          </g>
        </>,
      )}
    </g>
  )

  const leg = (w: number) =>
    j(
      from.hip,
      to.hip,
      <>
        {bone(SEG.THIGH, w)}
        <g transform={`translate(0,${SEG.THIGH})`}>
          {j(
            from.knee,
            to.knee,
            <>
              {bone(SEG.SHIN, w)}
              <line x1="-1" y1={SEG.SHIN} x2="8" y2={SEG.SHIN} stroke={color} strokeWidth={w * 0.85} strokeLinecap="round" />
            </>,
          )}
        </g>
      </>,
    )

  const o = pattern.origin ?? { x: 46, y: 56 }
  return (
    <g transform={`translate(${o.x},${o.y})${pattern.rootRot ? ` rotate(${pattern.rootRot})` : ''}`} opacity={opacity}>
      <Travel a={from} b={to} t={t}>
        <g transform="translate(-3.6,0)" opacity="0.55">{leg(BONE * 0.8)}</g>
        {j(
          from.torso,
          to.torso,
          <>
            <g transform="translate(-3.6,0)" opacity="0.55">{arm(BONE * 0.8, false)}</g>
            <line x1="0" y1="2" x2="0" y2={-SEG.TORSO} stroke={color} strokeWidth={BONE + 2.6} strokeLinecap="round" />
            <circle cx="0" cy={-SEG.TORSO - 8} r="7" fill="none" stroke={color} strokeWidth="3" />
            {arm(BONE, showLoad)}
          </>,
        )}
        {leg(BONE)}
      </Travel>
    </g>
  )
}

interface Props {
  name: string
  tempo: [number, number, number]
  paused?: boolean
}

export function MovementPreview({ name, tempo, paused: forcePaused = false }: Props) {
  const reduced = usePrefersReducedMotion()
  const paused = forcePaused || reduced
  const pattern = patternFor(name)
  const { dur, keyTimes } = tempoTiming(tempo)
  const t: Timing = { dur, keyTimes, paused }

  const path = repPath(pattern)
  const long = distPt(path.from, path.to) > 6
  const kt = keyTimes.split(';')

  // The cable must physically connect the pulley to the hand.
  const PULLEY = pattern.pulley
  const handTop = sceneSkeleton(pattern, pattern.top).hand
  const handBottom = sceneSkeleton(pattern, pattern.bottom).hand

  const phases: [string, number][] = [
    ['LOWER', tempo[0]],
    ['HOLD', tempo[1]],
    ['DRIVE', tempo[2]],
  ]

  return (
    <svg viewBox="0 0 100 104" style={{ width: '100%', height: '100%', display: 'block' }} role="img" aria-label={`${name} demonstration`}>
      <defs>
        <marker id="mp-arrow" markerWidth="5" markerHeight="5" refX="2.6" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={VOLT} opacity="0.85" />
        </marker>
      </defs>

      <Rig pattern={pattern} />

      {/* where the rep ends — both positions readable at a glance */}
      <Figure pattern={pattern} from={pattern.bottom} to={pattern.bottom} t={{ ...t, paused: true }} color={GHOST} opacity={0.5} showLoad={false} />

      {/* the path the bar travels */}
      {long && (
        <line
          x1={path.from.x.toFixed(1)}
          y1={path.from.y.toFixed(1)}
          x2={path.to.x.toFixed(1)}
          y2={path.to.y.toFixed(1)}
          stroke={VOLT}
          strokeWidth="1.1"
          strokeDasharray="2.5 2.5"
          opacity="0.5"
          markerEnd="url(#mp-arrow)"
        />
      )}

      {PULLEY && (
        <>
          <line x1={PULLEY.x} y1={PULLEY.y + 2} x2={PULLEY.x} y2={PULLEY.y + 8} stroke={STEEL} strokeWidth="2" opacity="0.8" />
          <circle cx={PULLEY.x} cy={PULLEY.y} r="3.2" fill="none" stroke={STEEL} strokeWidth="2" />
        </>
      )}
      {PULLEY && (
        <line x1={PULLEY.x} y1={PULLEY.y} x2={handTop.x.toFixed(1)} y2={handTop.y.toFixed(1)} stroke={STEEL} strokeWidth="1.6">
          {!paused && (
            <>
              <animate
                attributeName="x2"
                values={`${handTop.x};${handBottom.x};${handBottom.x};${handTop.x}`}
                keyTimes={keyTimes}
                calcMode="spline"
                keySplines={SPLINES}
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="y2"
                values={`${handTop.y};${handBottom.y};${handBottom.y};${handTop.y}`}
                keyTimes={keyTimes}
                calcMode="spline"
                keySplines={SPLINES}
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
            </>
          )}
        </line>
      )}

      <Figure pattern={pattern} from={pattern.top} to={pattern.bottom} t={t} color={BODY} />

      {/* which phase of the tempo you're in, in sync with the figure.
          discrete, so a label snaps on for its slice instead of cross-fading */}
      {!paused &&
        phases.map(([label, secs], i) => {
          if (secs <= 0) return null
          const vals = ['1;0;0;0', '0;1;0;0', '0;0;1;0'][i]!
          return (
            <text key={label} x="6" y="10" fill={VOLT} fontSize="6.4" fontWeight="700" fontFamily="Archivo, sans-serif" opacity="0">
              <animate
                attributeName="opacity"
                values={vals}
                keyTimes={`${kt[0]};${kt[1]};${kt[2]};${kt[3]}`}
                calcMode="discrete"
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
              {label} {secs}s
            </text>
          )
        })}
    </svg>
  )
}

import { FIGURE_CREDIT, figureFor } from '../data/figures'

/**
 * The two ends of the movement, side by side.
 *
 * Two still frames beat a looping figure here: you can compare the positions
 * without waiting for the loop to come round, and there's nothing to "read".
 * The art is black-on-white line work, inverted in CSS to sit on the dark UI.
 *
 * Everkinetic names its frames `relaxation` and `tension` — the target muscle
 * lengthened, then contracted. That is NOT "start then end of a rep": a squat
 * and a bench press both *begin* at the contracted end. So the frames are
 * labelled STRETCH -> CONTRACT, which is true for all fifteen lifts.
 */
export function ExerciseFigure({ name }: { name: string }) {
  const fig = figureFor(name)
  if (!fig) return null

  const frame = (phase: 'start' | 'end', label: string, alt: string) => (
    <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
      <img
        src={`/exercise/${fig.slug}-${phase}.svg`}
        alt={`${name}, ${alt}`}
        loading="lazy"
        style={{
          width: '100%',
          height: 168,
          objectFit: 'contain',
          display: 'block',
          // the art is dark-on-white; invert it, then let `screen` drop the now-black
          // backdrop so the card colour shows through instead of a black rectangle
          filter: 'invert(1)',
          mixBlendMode: 'screen',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: 6,
          bottom: 0,
          fontFamily: "'Archivo'",
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '.7px',
          color: phase === 'end' ? '#CCFF00' : '#61616a',
        }}
      >
        {label}
      </span>
    </div>
  )

  return (
    <div style={{ background: '#0f0f12', border: '1px solid #2a2a31', borderRadius: 18, padding: '12px 12px 8px' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {frame('start', 'STRETCH', 'muscle lengthened')}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#33333b" strokeWidth="2.4" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        {frame('end', 'CONTRACT', 'muscle contracted')}
      </div>

      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        {fig.variantNote ? (
          <span style={{ fontFamily: "'Archivo'", fontSize: 9, fontWeight: 600, color: '#7d6a2c' }}>illustration {fig.variantNote}</span>
        ) : (
          <span />
        )}
        <a
          href={FIGURE_CREDIT.licenseUrl}
          target="_blank"
          rel="noreferrer noopener"
          style={{ fontFamily: "'Archivo'", fontSize: 9, fontWeight: 600, color: '#4a4a52', textDecoration: 'none', flexShrink: 0 }}
        >
          {FIGURE_CREDIT.author} · {FIGURE_CREDIT.license}
        </a>
      </div>
    </div>
  )
}

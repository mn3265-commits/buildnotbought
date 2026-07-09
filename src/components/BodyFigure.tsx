import type { RenderedZone } from '../lib/calc'

/** Renders one silhouette (front or back) from resolved body-map zones. */
export function BodyFigure({ zones, width, height }: { zones: RenderedZone[]; width: number; height: number }) {
  return (
    <svg viewBox="0 0 100 206" width={width} height={height}>
      {zones.map((z, i) => (
        <rect
          key={i}
          x={z.x}
          y={z.y}
          width={z.w}
          height={z.h}
          rx={z.rx}
          fill={z.fill}
          stroke={z.stroke}
          strokeWidth={z.strokeWidth}
          strokeDasharray={z.dash}
        />
      ))}
    </svg>
  )
}

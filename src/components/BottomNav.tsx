import type { ViewModel } from '../store/viewModel'

export function BottomNav({ vm }: { vm: ViewModel }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 88,
        background: 'linear-gradient(transparent,#0B0B0D 34%)',
        zIndex: 30,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        padding: '14px 12px 0',
        borderTop: '1px solid #1b1b1f',
      }}
    >
      {vm.nav.map((n) => (
        <div key={n.key} onClick={n.onTap} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={n.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={n.d} />
          </svg>
          <span style={{ fontFamily: "'Archivo'", fontSize: 10, fontWeight: 700, color: n.color, letterSpacing: '.2px' }}>{n.label}</span>
        </div>
      ))}
    </div>
  )
}

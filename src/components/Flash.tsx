import type { ViewModel } from '../store/viewModel'

/** Target success/miss toast that slides in when a set is checked off. */
export function Flash({ vm }: { vm: ViewModel }) {
  if (!vm.flash) return null
  return (
    <div
      style={{
        position: 'absolute',
        top: 62,
        left: 16,
        right: 16,
        zIndex: 45,
        background: vm.flashBg,
        border: `1px solid ${vm.flashBorder}`,
        borderRadius: 14,
        padding: '13px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 16px 40px rgba(0,0,0,.5)',
        animation: 'fadeUp .22s ease both',
      }}
    >
      {vm.flashGood ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={vm.flashAccent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={vm.flashAccent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
      )}
      <span style={{ fontFamily: "'Anton'", fontSize: 16, color: vm.flashAccent, letterSpacing: '.5px' }}>{vm.flashMsg}</span>
    </div>
  )
}

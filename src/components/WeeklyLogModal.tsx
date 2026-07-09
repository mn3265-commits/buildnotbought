import type { ViewModel } from '../store/viewModel'

/** Bottom-sheet popup to log this week's bodyweight and preview BMI + protein. */
export function WeeklyLogModal({ vm }: { vm: ViewModel }) {
  if (!vm.logModalOpen) return null
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        background: 'rgba(5,5,6,.72)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={vm.closeLog}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'linear-gradient(160deg,#1b1b20,#101013)',
          border: '1px solid #2f3d0a',
          borderRadius: 26,
          padding: '24px 22px 22px',
          boxShadow: '0 -20px 60px rgba(0,0,0,.6)',
          animation: 'fadeUp .28s ease both',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: "'Anton'", fontSize: 26, color: '#F4F4F5', textTransform: 'uppercase' }}>Log this week</span>
          <button
            onClick={vm.closeLog}
            style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #33333b', background: '#17171b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a93" strokeWidth="2.4" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={{ fontFamily: "'Archivo'", fontSize: 13, color: '#8a8a93', fontWeight: 500, marginBottom: 18 }}>
          Enter today's bodyweight — we'll update your BMI and protein target.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0f0f12', border: '1px solid #33333b', borderRadius: 14, padding: '6px 16px', marginBottom: 18 }}>
          <input
            type="number"
            inputMode="decimal"
            value={vm.logInput}
            onChange={(e) => vm.onLogInput(e.target.value)}
            placeholder="0"
            style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 0', color: '#F4F4F5', fontFamily: "'Anton'", fontSize: 38, outline: 'none', width: '100%' }}
          />
          <span style={{ fontFamily: "'Archivo'", fontSize: 16, fontWeight: 700, color: '#8a8a93' }}>kg</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 20 }}>
          <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 16, padding: 15 }}>
            <div style={{ fontFamily: "'Archivo'", fontSize: 11, fontWeight: 800, color: '#7d7d86', letterSpacing: '.4px', textTransform: 'uppercase' }}>BMI</div>
            <div style={{ fontFamily: "'Anton'", fontSize: 30, color: '#F4F4F5', lineHeight: 1, marginTop: 6 }}>{vm.logPreviewBmi}</div>
            {vm.logNeedsHeight && (
              <div onClick={vm.goSetup} style={{ cursor: 'pointer', fontFamily: "'Archivo'", fontSize: 11, color: '#CCFF00', fontWeight: 700, marginTop: 5 }}>
                Add height ›
              </div>
            )}
          </div>
          <div style={{ background: '#141417', border: '1px solid #2f3d0a', borderRadius: 16, padding: 15 }}>
            <div style={{ fontFamily: "'Archivo'", fontSize: 11, fontWeight: 800, color: '#a9c93f', letterSpacing: '.4px', textTransform: 'uppercase' }}>Protein / day</div>
            <div style={{ fontFamily: "'Anton'", fontSize: 30, color: '#CCFF00', lineHeight: 1, marginTop: 6 }}>
              {vm.logPreviewProtein}
              <span style={{ fontSize: 14, color: '#54545c' }}> g</span>
            </div>
          </div>
        </div>

        {vm.logCanSave ? (
          <button
            onClick={vm.addWeight}
            style={{ width: '100%', border: 'none', cursor: 'pointer', background: '#CCFF00', color: '#0B0B0D', fontFamily: "'Archivo Expanded','Archivo'", fontWeight: 800, fontSize: 16, padding: 16, borderRadius: 15 }}
          >
            SAVE THIS WEEK
          </button>
        ) : (
          <div style={{ width: '100%', background: '#17171b', border: '1px solid #26262c', color: '#54545c', fontFamily: "'Archivo Expanded','Archivo'", fontWeight: 800, fontSize: 16, padding: 16, borderRadius: 15, textAlign: 'center' }}>
            ENTER YOUR WEIGHT
          </div>
        )}
      </div>
    </div>
  )
}

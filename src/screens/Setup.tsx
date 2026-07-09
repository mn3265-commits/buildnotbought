import type { ViewModel } from '../store/viewModel'

export function Setup({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '6px 20px 0', animation: 'fadeUp .3s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button
          onClick={vm.goHome}
          style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #2a2a31', background: '#141417', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4F4F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div style={{ fontFamily: "'Anton'", fontSize: 26, color: '#F4F4F5', textTransform: 'uppercase' }}>Tailor my weights</div>
      </div>
      <div style={{ fontFamily: "'Archivo'", fontSize: 13, color: '#8a8a93', fontWeight: 500, margin: '0 2px 20px', lineHeight: 1.5 }}>
        Enter your bodyweight and height. We'll set a realistic starting weight for every lift using strength-to-bodyweight ratios — then you refine from there.
      </div>

      <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: 18, marginBottom: 14 }}>
        <label style={{ fontFamily: "'Archivo'", fontSize: 12, fontWeight: 700, color: '#7d7d86', letterSpacing: '.4px', textTransform: 'uppercase' }}>Bodyweight</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <input
            type="number"
            inputMode="decimal"
            value={vm.profileBw}
            onChange={(e) => vm.onBw(e.target.value)}
            placeholder="0"
            style={{ flex: 1, background: '#0f0f12', border: '1px solid #33333b', borderRadius: 12, padding: '14px 16px', color: '#F4F4F5', fontFamily: "'Anton'", fontSize: 24, outline: 'none', width: '100%' }}
          />
          <span style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 700, color: '#8a8a93' }}>kg</span>
        </div>
      </div>

      <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: 18, marginBottom: 22 }}>
        <label style={{ fontFamily: "'Archivo'", fontSize: 12, fontWeight: 700, color: '#7d7d86', letterSpacing: '.4px', textTransform: 'uppercase' }}>Height</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
          <input
            type="number"
            inputMode="decimal"
            value={vm.profileHeight}
            onChange={(e) => vm.onHeight(e.target.value)}
            placeholder="0"
            style={{ flex: 1, background: '#0f0f12', border: '1px solid #33333b', borderRadius: 12, padding: '14px 16px', color: '#F4F4F5', fontFamily: "'Anton'", fontSize: 24, outline: 'none', width: '100%' }}
          />
          <span style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 700, color: '#8a8a93' }}>cm</span>
        </div>
      </div>

      {vm.canGenerate && (
        <button
          onClick={vm.generateTargets}
          style={{ width: '100%', border: 'none', cursor: 'pointer', background: '#CCFF00', color: '#0B0B0D', fontFamily: "'Archivo Expanded','Archivo'", fontWeight: 800, fontSize: 16, padding: 17, borderRadius: 16 }}
        >
          GENERATE MY STARTING WEIGHTS
        </button>
      )}
      {vm.notCanGenerate && (
        <div style={{ width: '100%', background: '#17171b', border: '1px solid #26262c', color: '#54545c', fontFamily: "'Archivo Expanded','Archivo'", fontWeight: 800, fontSize: 16, padding: 17, borderRadius: 16, textAlign: 'center' }}>
          ENTER YOUR BODYWEIGHT
        </div>
      )}
      <div style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#54545c', fontWeight: 500, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
        These are starting estimates — always warm up and adjust to what feels right.
      </div>
    </div>
  )
}

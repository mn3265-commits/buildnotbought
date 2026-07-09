import type { ViewModel } from '../store/viewModel'

export function Program({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '6px 20px 0', animation: 'fadeUp .3s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={vm.goHome} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #2a2a31', background: '#141417', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4F4F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div style={{ fontFamily: "'Anton'", fontSize: 26, color: '#F4F4F5', textTransform: 'uppercase' }}>My Split</div>
      </div>
      <div style={{ fontFamily: "'Archivo'", fontSize: 13, color: '#8a8a93', fontWeight: 500, marginBottom: 16, lineHeight: 1.5 }}>Tap a day to cycle its focus. Your rotation: Push · Pull · Legs · Rest · Lower · Upper · Rest.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {vm.programDays.map((d, i) => (
          <div key={i} onClick={d.onTap} style={{ cursor: 'pointer', background: '#141417', border: `1px solid ${d.border}`, borderRadius: 16, padding: '15px 17px', display: 'flex', alignItems: 'center', gap: 15 }}>
            <div style={{ width: 46, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Archivo'", fontSize: 11, fontWeight: 700, color: '#7d7d86', letterSpacing: '.5px' }}>{d.dayShort}</div>
              <div style={{ fontFamily: "'Anton'", fontSize: 22, color: d.color, lineHeight: 1 }}>{d.date}</div>
            </div>
            <div style={{ width: 1, height: 34, background: '#26262c' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Archivo Expanded','Archivo'", fontSize: 17, fontWeight: 800, color: d.textColor }}>{d.type}</div>
              <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 500 }}>{d.sub}</div>
            </div>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: d.color, boxShadow: `0 0 10px ${d.glow}` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

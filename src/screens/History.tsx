import type { ViewModel } from '../store/viewModel'

export function History({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '6px 20px 0', animation: 'fadeUp .3s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button onClick={vm.goHome} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #2a2a31', background: '#141417', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4F4F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div style={{ fontFamily: "'Anton'", fontSize: 26, color: '#F4F4F5', textTransform: 'uppercase' }}>{vm.cal.month}</div>
      </div>

      <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 20, padding: '16px 14px', marginBottom: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
          {vm.cal.dow.map((w, i) => (
            <div key={i} style={{ textAlign: 'center', fontFamily: "'Archivo'", fontSize: 10, fontWeight: 700, color: '#54545c' }}>{w}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
          {vm.cal.cells.map((c, i) => (
            <div key={i} style={{ aspectRatio: 1, borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <span style={{ fontFamily: "'Archivo'", fontSize: 12, fontWeight: 700, color: c.textColor }}>{c.n}</span>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontFamily: "'Archivo Expanded','Archivo'", fontSize: 14, fontWeight: 800, color: '#F4F4F5', margin: '0 2px 12px' }}>Recent sessions</div>
      {!vm.hasSessions && (
        <div style={{ background: '#141417', border: '1px dashed #2a2a31', borderRadius: 15, padding: '22px 16px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Archivo'", fontSize: 14, fontWeight: 700, color: '#c8c8ce' }}>No sessions yet</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 500, marginTop: 4 }}>Finish a workout and it'll show up here.</div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {vm.sessions.map((s, i) => (
          <div key={i} style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 15, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 44, textAlign: 'center', borderRight: '1px solid #26262c', paddingRight: 11 }}>
              <div style={{ fontFamily: "'Anton'", fontSize: 20, color: s.color, lineHeight: 1 }}>{s.date}</div>
              <div style={{ fontFamily: "'Archivo'", fontSize: 10, color: '#7d7d86', fontWeight: 700 }}>{s.dow}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5' }}>{s.type} Day</div>
              <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 500 }}>{s.exCount} exercises · {s.duration} · {s.volume}</div>
            </div>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: '#12240f', border: '1px solid #1e3a17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3DDC84" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

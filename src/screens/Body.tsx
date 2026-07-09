import { ImageSlot } from '../components/ImageSlot'
import type { ViewModel } from '../store/viewModel'

export function Body({ vm }: { vm: ViewModel }) {
  const b = vm.body
  return (
    <div style={{ padding: '6px 20px 0', animation: 'fadeUp .3s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button onClick={vm.goYou} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #2a2a31', background: '#141417', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4F4F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div style={{ fontFamily: "'Anton'", fontSize: 26, color: '#F4F4F5', textTransform: 'uppercase' }}>Body Stats</div>
      </div>

      <div style={{ background: 'linear-gradient(150deg,#1b1b20,#101013)', border: '1px solid #2a2a31', borderRadius: 22, padding: 20, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Archivo'", fontSize: 12, fontWeight: 700, color: '#7d7d86', letterSpacing: '.5px', textTransform: 'uppercase' }}>Bodyweight</div>
            <div style={{ fontFamily: "'Anton'", fontSize: 52, color: '#F4F4F5', lineHeight: 1, marginTop: 2 }}>{b.weight}<span style={{ fontSize: 22, color: '#54545c' }}> kg</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Archivo'", fontSize: 13, fontWeight: 800, color: b.gainColor }}>{b.gainArrow} {b.gain} kg</div>
            <div style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#7d7d86', fontWeight: 600 }}>logged range</div>
            <div style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#a9c93f', fontWeight: 700, marginTop: 6 }}>goal {b.goal} kg</div>
          </div>
        </div>
        <svg viewBox="0 0 300 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, marginTop: 14 }}>
          <polyline points={b.linePts} fill="none" stroke="#3DDC84" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* BMI + protein */}
      {b.hasProfile && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 14 }}>
          <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: 16 }}>
            <div style={{ fontFamily: "'Archivo'", fontSize: 11, fontWeight: 700, color: '#7d7d86', letterSpacing: '.4px', textTransform: 'uppercase' }}>BMI</div>
            {b.bmi && (
              <>
                <div style={{ fontFamily: "'Anton'", fontSize: 34, color: '#F4F4F5', lineHeight: 1, marginTop: 6 }}>{b.bmi.value}</div>
                <span style={{ display: 'inline-block', marginTop: 8, fontFamily: "'Archivo'", fontSize: 11, fontWeight: 800, color: b.bmi.color, background: '#0f0f12', border: '1px solid #26262c', padding: '4px 9px', borderRadius: 8 }}>{b.bmi.cat}</span>
              </>
            )}
            {b.noBmi && (
              <div onClick={vm.goSetup} style={{ cursor: 'pointer', fontFamily: "'Archivo'", fontSize: 13, color: '#CCFF00', fontWeight: 700, marginTop: 10 }}>Add your height ›</div>
            )}
          </div>
          <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: 16 }}>
            <div style={{ fontFamily: "'Archivo'", fontSize: 11, fontWeight: 700, color: '#7d7d86', letterSpacing: '.4px', textTransform: 'uppercase' }}>Protein / day</div>
            <div style={{ fontFamily: "'Anton'", fontSize: 34, color: '#CCFF00', lineHeight: 1, marginTop: 6 }}>{b.protein.target}<span style={{ fontSize: 15, color: '#54545c' }}> g</span></div>
            <div style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#8a8a93', fontWeight: 600, marginTop: 8 }}>{b.protein.low}–{b.protein.high} g for muscle gain</div>
          </div>
        </div>
      )}
      {b.noProfile && (
        <div onClick={vm.goSetup} style={{ cursor: 'pointer', background: 'linear-gradient(100deg,#1c2408,#141417)', border: '1px solid #2f3d0a', borderRadius: 16, padding: '14px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 20v-8M6 20h12" /><circle cx="12" cy="12" r="2.2" /></svg>
          <div style={{ flex: 1, fontFamily: "'Archivo'", fontSize: 13, color: '#e9f3c8', fontWeight: 600 }}>Add bodyweight & height to see BMI and your protein target</div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </div>
      )}

      {/* weekly weight tracker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 2px 12px' }}>
        <span style={{ fontFamily: "'Archivo Expanded','Archivo'", fontSize: 14, fontWeight: 800, color: '#F4F4F5' }}>Weekly log</span>
        <button onClick={vm.openLog} style={{ border: 'none', cursor: 'pointer', background: '#CCFF00', color: '#0B0B0D', fontFamily: "'Archivo'", fontWeight: 800, fontSize: 12, padding: '8px 14px', borderRadius: 11, display: 'flex', alignItems: 'center', gap: 5, letterSpacing: '.3px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0B0B0D" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>LOG THIS WEEK
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 15px 6px' }}>
        <span style={{ flex: 1, fontFamily: "'Archivo'", fontSize: 9, fontWeight: 800, letterSpacing: '.6px', color: '#54545c' }}>WEEK</span>
        <span style={{ width: 64, textAlign: 'right', fontFamily: "'Archivo'", fontSize: 9, fontWeight: 800, letterSpacing: '.6px', color: '#54545c' }}>WEIGHT</span>
        <span style={{ width: 44, textAlign: 'right', fontFamily: "'Archivo'", fontSize: 9, fontWeight: 800, letterSpacing: '.6px', color: '#54545c' }}>BMI</span>
        <span style={{ width: 56, textAlign: 'right', fontFamily: "'Archivo'", fontSize: 9, fontWeight: 800, letterSpacing: '.6px', color: '#54545c' }}>PROTEIN</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {b.logRows.map((r, i) => (
          <div key={i} style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 13, padding: '12px 15px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Archivo'", fontSize: 13, fontWeight: 700, color: '#F4F4F5' }}>{r.label}</div>
              <div style={{ fontFamily: "'Archivo'", fontSize: 11, fontWeight: 800, color: r.deltaColor, marginTop: 1 }}>{r.deltaStr} kg</div>
            </div>
            <span style={{ width: 64, textAlign: 'right', fontFamily: "'Anton'", fontSize: 18, color: '#F4F4F5' }}>{r.w}</span>
            <span style={{ width: 44, textAlign: 'right', fontFamily: "'Anton'", fontSize: 16, color: '#c8c8ce' }}>{r.bmi}</span>
            <span style={{ width: 56, textAlign: 'right', fontFamily: "'Anton'", fontSize: 16, color: '#CCFF00' }}>{r.protein}<span style={{ fontFamily: "'Archivo'", fontSize: 9, color: '#54545c', fontWeight: 700 }}>g</span></span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 16 }}>
        {b.measures.map((m, i) => (
          <div key={i} style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 16, padding: 15 }}>
            <div style={{ fontFamily: "'Archivo'", fontSize: 11, fontWeight: 700, color: '#7d7d86', letterSpacing: '.4px', textTransform: 'uppercase' }}>{m.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 5 }}>
              <span style={{ fontFamily: "'Anton'", fontSize: 26, color: '#F4F4F5', lineHeight: 1 }}>{m.val}</span>
              <span style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 600 }}>cm</span>
              <span style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#3DDC84', fontWeight: 800, marginLeft: 'auto' }}>{m.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "'Archivo Expanded','Archivo'", fontSize: 14, fontWeight: 800, color: '#F4F4F5', margin: '0 2px 12px' }}>Progress photos</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
        <div style={{ position: 'relative', height: 200, borderRadius: 18, overflow: 'hidden', border: '1px solid #2a2a31' }}>
          <ImageSlot id="body-photo-start" placeholder="Start photo" />
        </div>
        <div style={{ position: 'relative', height: 200, borderRadius: 18, overflow: 'hidden', border: '1px solid #2a2a31' }}>
          <ImageSlot id="body-photo-now" placeholder="Latest photo" />
        </div>
      </div>
    </div>
  )
}

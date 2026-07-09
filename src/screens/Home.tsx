import type { ViewModel } from '../store/viewModel'

export function Home({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '8px 20px 0', animation: 'fadeUp .35s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0 22px' }}>
        <div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 13, fontWeight: 600, color: '#7d7d86', letterSpacing: '.4px', textTransform: 'uppercase' }}>{vm.greeting}</div>
          <div style={{ fontFamily: "'Archivo Expanded','Archivo'", fontSize: 22, fontWeight: 800, color: '#F4F4F5', letterSpacing: '-.5px', marginTop: 2 }}>{vm.userName}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#26262c,#141417)', border: '1px solid #303038', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton'", fontSize: 18, color: '#CCFF00' }}>{vm.userInitial}</div>
      </div>

      {/* momentum hero */}
      <div onClick={vm.goAchievements} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#1d1d23,#0e0e11)', border: '1px solid #2a2a31', borderRadius: 22, padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ position: 'absolute', top: -50, right: -40, width: 150, height: 150, borderRadius: '50%', background: '#CCFF00', filter: 'blur(50px)', opacity: 0.14 }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "'Archivo'", fontSize: 11, fontWeight: 700, color: '#7d7d86', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Current rank</div>
            <div style={{ fontFamily: "'Anton'", fontSize: 34, color: '#CCFF00', lineHeight: 1, marginTop: 2 }}>{vm.rank.name}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 13, padding: '9px 12px', textAlign: 'center', minWidth: 52 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF6A2C" stroke="none"><path d="M12 2c1 4-2 5-2 8a2 2 0 0 0 4 0c0-1 1-2 1-2 2 2 3 4 3 7a6 6 0 0 1-12 0c0-4 4-6 6-13z" /></svg>
                <span style={{ fontFamily: "'Anton'", fontSize: 17, color: '#F4F4F5' }}>{vm.rank.streak}</span>
              </div>
              <div style={{ fontFamily: "'Archivo'", fontSize: 9, color: '#7d7d86', fontWeight: 700, marginTop: 2, letterSpacing: '.3px' }}>WK STREAK</div>
            </div>
            <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 13, padding: '9px 12px', textAlign: 'center', minWidth: 52 }}>
              <span style={{ fontFamily: "'Anton'", fontSize: 17, color: '#F4F4F5' }}>{vm.rank.weekDone}<span style={{ fontSize: 11, color: '#54545c' }}>/{vm.rank.weekGoal}</span></span>
              <div style={{ fontFamily: "'Archivo'", fontSize: 9, color: '#7d7d86', fontWeight: 700, marginTop: 2, letterSpacing: '.3px' }}>THIS WK</div>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', height: 8, borderRadius: 5, background: '#26262c', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: vm.rank.pct, background: 'linear-gradient(90deg,#a9c93f,#CCFF00)', borderRadius: 5 }} />
        </div>
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#8a8a93', fontWeight: 600 }}>{vm.rank.xpStr}</span>
          <span style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#a9c93f', fontWeight: 700 }}>Next: {vm.rank.next} ›</span>
        </div>
      </div>

      {vm.notTailored && (
        <div onClick={vm.goSetup} style={{ cursor: 'pointer', background: 'linear-gradient(100deg,#1c2408,#141417)', border: '1px solid #2f3d0a', borderRadius: 18, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 20v-8M12 8V4M6 20h12" /><circle cx="12" cy="12" r="2.2" /></svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Archivo'", fontSize: 14, fontWeight: 800, color: '#F4F4F5' }}>Tailor your weights</div>
            <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#a9c93f', fontWeight: 500 }}>Add your bodyweight to set realistic targets</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </div>
      )}

      {/* today card */}
      <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', background: 'linear-gradient(150deg,#1b1b20,#101013)', border: '1px solid #2a2a31', padding: 22, marginBottom: 16 }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 180, height: 180, borderRadius: '50%', background: vm.today.glow, filter: 'blur(46px)', opacity: 0.28 }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: vm.today.color, boxShadow: `0 0 10px ${vm.today.color}` }} />
            <span style={{ fontFamily: "'Archivo'", fontSize: 12, fontWeight: 700, color: '#8a8a93', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Today · {vm.today.dayLong}</span>
          </div>
          <div style={{ fontFamily: "'Anton'", fontSize: 52, lineHeight: 0.95, color: '#F4F4F5', letterSpacing: '.5px', margin: '4px 0 2px', textTransform: 'uppercase' }}>{vm.today.type} <span style={{ color: vm.today.color }}>Day</span></div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 14, color: '#9a9aa2', fontWeight: 500, marginBottom: 18 }}>{vm.today.subtitle}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={vm.startWorkout} style={{ flex: 1, border: 'none', cursor: 'pointer', background: '#CCFF00', color: '#0B0B0D', fontFamily: "'Archivo Expanded','Archivo'", fontWeight: 800, fontSize: 15, letterSpacing: '.3px', padding: 15, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0B0B0D"><path d="M8 5v14l11-7z" /></svg> {vm.today.startLabel}
            </button>
            <button onClick={vm.goProgram} style={{ border: '1px solid #33333b', background: '#17171b', cursor: 'pointer', color: '#F4F4F5', padding: '0 16px', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* week strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '22px 2px 12px' }}>
        <span style={{ fontFamily: "'Archivo Expanded','Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5' }}>This Week</span>
        <span onClick={vm.goProgram} style={{ cursor: 'pointer', fontFamily: "'Archivo'", fontSize: 12, fontWeight: 700, color: '#CCFF00', letterSpacing: '.3px' }}>EDIT SPLIT ›</span>
      </div>
      <div style={{ display: 'flex', gap: 7, marginBottom: 6 }}>
        {vm.week.map((d, i) => (
          <div key={i} onClick={d.onTap} style={{ flex: 1, cursor: 'pointer', borderRadius: 14, padding: '11px 0 9px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, background: d.bg, border: `1px solid ${d.border}` }}>
            <span style={{ fontFamily: "'Archivo'", fontSize: 10, fontWeight: 700, color: d.dayColor, letterSpacing: '.5px' }}>{d.day}</span>
            <span style={{ fontFamily: "'Anton'", fontSize: 15, color: d.codeColor }}>{d.code}</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: d.dot }} />
          </div>
        ))}
      </div>

      {/* stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, margin: '16px 0' }}>
        <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: '15px 14px' }}>
          <div style={{ fontFamily: "'Anton'", fontSize: 30, color: '#CCFF00', lineHeight: 1 }}>{vm.stats.streak}</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#7d7d86', fontWeight: 600, marginTop: 5, letterSpacing: '.3px' }}>WEEK STREAK</div>
        </div>
        <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: '15px 14px' }}>
          <div style={{ fontFamily: "'Anton'", fontSize: 30, color: '#F4F4F5', lineHeight: 1 }}>{vm.stats.weekDone}<span style={{ fontSize: 16, color: '#54545c' }}>/{vm.stats.weekGoal}</span></div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#7d7d86', fontWeight: 600, marginTop: 5, letterSpacing: '.3px' }}>SESSIONS</div>
        </div>
        <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: '15px 14px' }}>
          <div style={{ fontFamily: "'Anton'", fontSize: 30, color: '#F4F4F5', lineHeight: 1 }}>{vm.stats.volume}<span style={{ fontSize: 14, color: '#54545c' }}>t</span></div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#7d7d86', fontWeight: 600, marginTop: 5, letterSpacing: '.3px' }}>VOLUME</div>
        </div>
      </div>

      {/* next targets */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '22px 2px 12px' }}>
        <span style={{ fontFamily: "'Archivo Expanded','Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5' }}>Next Targets</span>
        <span onClick={vm.goProgress} style={{ cursor: 'pointer', fontFamily: "'Archivo'", fontSize: 12, fontWeight: 700, color: '#CCFF00', letterSpacing: '.3px' }}>ALL ›</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {vm.topTargets.map((t, i) => (
          <div key={i} onClick={t.onTap} style={{ cursor: 'pointer', background: '#141417', border: '1px solid #26262c', borderRadius: 16, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Archivo'", fontSize: 14, fontWeight: 700, color: '#F4F4F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
              <div style={{ height: 5, borderRadius: 4, background: '#26262c', marginTop: 9, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: t.pct, background: t.color, borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: "'Archivo'", fontSize: 11, color: '#7d7d86', fontWeight: 600 }}>{t.currentStr}</div>
              <div style={{ fontFamily: "'Anton'", fontSize: 18, color: '#CCFF00', lineHeight: 1.1 }}>{t.nextStr}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import type { ViewModel } from '../store/viewModel'
import { useAuth } from '../store/auth'

export function You({ vm }: { vm: ViewModel }) {
  const { user, signOut } = useAuth()
  return (
    <div style={{ padding: '10px 20px 0', animation: 'fadeUp .3s ease both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 22 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,#26262c,#141417)', border: '1px solid #303038', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton'", fontSize: 26, color: '#CCFF00' }}>{vm.userInitial}</div>
        <div>
          <div style={{ fontFamily: "'Archivo Expanded','Archivo'", fontSize: 22, fontWeight: 800, color: '#F4F4F5' }}>{vm.userName}</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 13, color: '#7d7d86', fontWeight: 600 }}>Intermediate · Push · Pull · Legs · +2</div>
        </div>
      </div>

      <div onClick={vm.goAchievements} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', background: 'linear-gradient(120deg,#1d1d23,#0e0e11)', border: '1px solid #2a2a31', borderRadius: 18, padding: '16px 18px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 120, height: 120, borderRadius: '50%', background: '#CCFF00', filter: 'blur(46px)', opacity: 0.12 }} />
        <div style={{ position: 'relative', width: 42, height: 42, borderRadius: 12, background: '#1c2408', border: '1px solid #2f3d0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" /></svg>
        </div>
        <div style={{ position: 'relative', flex: 1 }}>
          <div style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5' }}>Achievements</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#a9c93f', fontWeight: 600 }}>{vm.achEarned} of {vm.achTotal} unlocked</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, marginBottom: 12 }}>
        <div onClick={vm.goProgram} style={{ cursor: 'pointer', background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: 17 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
          <div style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5', marginTop: 12 }}>My Split</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 500 }}>Build your week</div>
        </div>
        <div onClick={vm.goHistory} style={{ cursor: 'pointer', background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: 17 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4EA8FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="3" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>
          <div style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5', marginTop: 12 }}>History</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 500 }}>Calendar & logs</div>
        </div>
        <div onClick={vm.goBody} style={{ cursor: 'pointer', background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: 17 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B388FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 21v-4l-2-1 2-6h8l2 6-2 1v4M9 21v-4M15 21v-4" /></svg>
          <div style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5', marginTop: 12 }}>Body Stats</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 500 }}>Weight & measures</div>
        </div>
        <div onClick={vm.goProgress} style={{ cursor: 'pointer', background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: 17 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3DDC84" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18M7 14l3-3 4 4 5-6" /></svg>
          <div style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5', marginTop: 12 }}>Targets</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 500 }}>Goal weights</div>
        </div>
      </div>

      <div onClick={vm.goSetup} style={{ cursor: 'pointer', background: 'linear-gradient(100deg,#1c2408,#141417)', border: '1px solid #2f3d0a', borderRadius: 18, padding: '16px 17px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: '#0f0f12', border: '1px solid #2f3d0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-8M12 8V4M5 12H4M20 12h-1M12 12a4 4 0 0 0 0-8M6 20h12" /><circle cx="12" cy="12" r="2.2" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5' }}>Tailor my starting weights</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#a9c93f', fontWeight: 500 }}>From your bodyweight & height</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
      </div>

      <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: '15px 17px', marginTop: 0 }}>
        <div style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5' }}>Units</div>
        <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 500, marginTop: 3, lineHeight: 1.5 }}>Set per movement — use the KG/LB toggle on each exercise (in a live workout or its detail page) to match whatever plates that gym has.</div>
      </div>

      <div style={{ background: '#141417', border: '1px solid #26262c', borderRadius: 18, padding: '15px 17px', marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Archivo'", fontSize: 15, fontWeight: 800, color: '#F4F4F5' }}>Account</div>
          <div style={{ fontFamily: "'Archivo'", fontSize: 12, color: '#7d7d86', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email ?? 'Signed in'} · synced</div>
        </div>
        <button onClick={() => void signOut()} style={{ flexShrink: 0, border: '1px solid #33333b', background: '#17171b', cursor: 'pointer', color: '#F4F4F5', fontFamily: "'Archivo'", fontWeight: 700, fontSize: 13, padding: '10px 16px', borderRadius: 12 }}>Sign out</button>
      </div>
    </div>
  )
}

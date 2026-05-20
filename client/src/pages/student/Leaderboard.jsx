import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchLeaderboard } from '../../services/leaderboardService'

const Leaderboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('global')

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard()
        setLeaderboard(data.leaderboard)
      } catch (err) {
        console.log('Error loading leaderboard:', err)
      }
      setLoading(false)
    }
    loadLeaderboard()
  }, [])

  const getRankIcon = (rank) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `#${rank + 1}`
  }

  const getRankColor = (rank) => {
    if (rank === 0) return '#EF9F27'
    if (rank === 1) return '#888780'
    if (rank === 2) return '#BA7517'
    return '#e0ede8'
  }

  const levelTitles = {
    1: 'Eco Seedling', 2: 'Eco Sprout', 3: 'Eco Learner',
    4: 'Eco Explorer', 5: 'Eco Guardian', 6: 'Eco Warrior',
    7: 'Eco Champion', 8: 'Eco Master', 9: 'Eco Legend', 10: 'Earth Guardian'
  }

  const navItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '📚', label: 'Lessons', path: '/lessons' },
    { icon: '📝', label: 'Quizzes', path: '/quiz' },
    { icon: '🎯', label: 'Missions', path: '/missions' },
    { icon: '🌱', label: 'Eco Garden', path: '/garden' },
    { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
    { icon: '⚡', label: 'Challenges', path: '/challenges', badge: 'NEW' },
    { icon: '🤖', label: 'AI Eco Guide', path: '/ai-guide' },
    { icon: '🎁', label: 'Rewards Store', path: '/rewards' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ]

  return (
    <div style={styles.page}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={{ fontSize: '28px' }}>🌿</span>
          <div>
            <p style={styles.logoText}>EcoSpark</p>
            <p style={styles.logoSub}>Learn • Act • Protect</p>
          </div>
        </div>
        <div style={styles.navList}>
          {navItems.map(item => (
            <div
              key={item.label}
              style={item.path === '/leaderboard' ? styles.navItemActive : styles.navItem}
              onClick={() => navigate(item.path)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
              {item.badge && <span style={styles.newBadge}>{item.badge}</span>}
            </div>
          ))}
        </div>
        <div style={styles.logoutBtn} onClick={async () => { navigate('/login') }}>
          <span>🚪</span><span>Logout</span>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Leaderboard 🏆</h1>
            <p style={styles.subtitle}>Compete, climb ranks and make a bigger impact!</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabsRow}>
          {['global', 'school', 'friends'].map(tab => (
            <button
              key={tab}
              style={activeTab === tab ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'global' ? '🌍 Global' : tab === 'school' ? '🏫 School' : '👥 Friends'}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        {!loading && leaderboard.length >= 3 && (
          <div style={styles.podium}>
            {/* 2nd place */}
            <div style={styles.podiumItem}>
              <div style={styles.podiumAvatar}>
                {leaderboard[1]?.name[0].toUpperCase()}
              </div>
              <p style={styles.podiumName}>{leaderboard[1]?.name}</p>
              <p style={styles.podiumXP}>{leaderboard[1]?.xp} XP</p>
              <div style={{ ...styles.podiumBlock, height: '60px', background: '#C0C0C0' }}>
                🥈
              </div>
            </div>
            {/* 1st place */}
            <div style={styles.podiumItem}>
              <div style={{ ...styles.podiumAvatar, background: '#FFF3D6', border: '3px solid #EF9F27' }}>
                {leaderboard[0]?.name[0].toUpperCase()}
              </div>
              <p style={styles.podiumName}>{leaderboard[0]?.name}</p>
              <p style={styles.podiumXP}>{leaderboard[0]?.xp} XP</p>
              <div style={{ ...styles.podiumBlock, height: '80px', background: '#EF9F27' }}>
                🥇
              </div>
            </div>
            {/* 3rd place */}
            <div style={styles.podiumItem}>
              <div style={styles.podiumAvatar}>
                {leaderboard[2]?.name[0].toUpperCase()}
              </div>
              <p style={styles.podiumName}>{leaderboard[2]?.name}</p>
              <p style={styles.podiumXP}>{leaderboard[2]?.xp} XP</p>
              <div style={{ ...styles.podiumBlock, height: '44px', background: '#BA7517' }}>
                🥉
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div style={styles.listCard}>
          <div style={styles.listHeader}>
            <span style={styles.colRank}>Rank</span>
            <span style={styles.colName}>Student</span>
            <span style={styles.colXP}>XP</span>
            <span style={styles.colStreak}>Streak</span>
            <span style={styles.colTrees}>Trees</span>
          </div>

          {loading ? (
            <div style={styles.loadingRow}>
              <span style={{ fontSize: '32px' }}>🌱</span>
              <p style={{ color: '#888780', fontSize: '14px' }}>Loading rankings...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={styles.loadingRow}>
              <span style={{ fontSize: '48px' }}>🌍</span>
              <p style={{ color: '#888780', fontSize: '14px' }}>No students yet. Be the first!</p>
              <button style={styles.joinBtn} onClick={() => navigate('/quiz')}>Start Earning XP</button>
            </div>
          ) : (
            leaderboard.map((student, i) => (
              <div
                key={student._id}
                style={{
                  ...styles.listRow,
                  background: student.firebaseUid === user?.uid ? '#EAF3DE' : i % 2 === 0 ? '#fff' : '#fafafa',
                  border: student.firebaseUid === user?.uid ? '2px solid #1D9E75' : '1px solid transparent',
                }}
              >
                <span style={styles.colRank}>
                  <span style={{
                    ...styles.rankBadge,
                    background: getRankColor(i),
                    color: i < 3 ? '#fff' : '#5F5E5A',
                    fontSize: i < 3 ? '16px' : '13px',
                  }}>
                    {getRankIcon(i)}
                  </span>
                </span>
                <div style={styles.colName}>
                  <div style={styles.studentAvatar}>
                    {student.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={styles.studentName}>
                      {student.name}
                      {student.firebaseUid === user?.uid && <span style={styles.youBadge}> (You)</span>}
                    </p>
                    <p style={styles.studentLevel}>
                      {levelTitles[student.level] || 'Eco Seedling'} • Level {student.level}
                    </p>
                  </div>
                </div>
                <span style={styles.colXP}>
                  <span style={styles.xpText}>{student.xp} XP</span>
                </span>
                <span style={styles.colStreak}>
                  🔥 {student.streak}d
                </span>
                <span style={styles.colTrees}>
                  🌳 {student.treesPlanted}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Motivational Banner */}
        <div style={styles.motiveBanner}>
          <span style={{ fontSize: '28px' }}>🏆</span>
          <p style={styles.motiveText}>
            Keep learning, completing missions and maintaining streaks to climb higher!
          </p>
          <button style={styles.motiveBtn} onClick={() => navigate('/missions')}>
            Complete Missions
          </button>
        </div>

      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f7fa', fontFamily: 'Poppins, sans-serif' },
  sidebar: { width: '220px', minWidth: '220px', background: '#fff', borderRight: '1px solid #e0ede8', display: 'flex', flexDirection: 'column', padding: '20px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px 20px', borderBottom: '1px solid #e0ede8' },
  logoText: { fontSize: '18px', fontWeight: '700', color: '#1D9E75', margin: 0 },
  logoSub: { fontSize: '10px', color: '#888780', margin: 0 },
  navList: { flex: 1, padding: '12px 0' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', margin: '2px 8px', color: '#5F5E5A', fontSize: '14px' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', cursor: 'pointer', borderRadius: '8px', margin: '2px 8px', background: '#1D9E75', color: '#fff', fontSize: '14px', fontWeight: '500' },
  navIcon: { fontSize: '18px' },
  navLabel: { flex: 1 },
  newBadge: { background: '#E24B4A', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '99px', fontWeight: '600' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#888780', fontSize: '14px', padding: '16px 20px', borderTop: '1px solid #e0ede8' },
  main: { flex: 1, padding: '24px', overflowY: 'auto' },
  header: { marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 4px' },
  subtitle: { fontSize: '14px', color: '#888780', margin: 0 },
  tabsRow: { display: 'flex', gap: '10px', marginBottom: '24px' },
  tab: { padding: '10px 24px', borderRadius: '10px', border: '1px solid #e0ede8', background: '#fff', fontSize: '14px', fontWeight: '500', color: '#5F5E5A', cursor: 'pointer' },
  tabActive: { padding: '10px 24px', borderRadius: '10px', border: '2px solid #1D9E75', background: '#EAF3DE', fontSize: '14px', fontWeight: '600', color: '#27500A', cursor: 'pointer' },
  podium: { display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '16px', marginBottom: '24px', background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e0ede8' },
  podiumItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  podiumAvatar: { width: '52px', height: '52px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#27500A', border: '2px solid #e0ede8' },
  podiumName: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: 0, textAlign: 'center', maxWidth: '80px' },
  podiumXP: { fontSize: '12px', color: '#1D9E75', fontWeight: '600', margin: 0 },
  podiumBlock: { width: '72px', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
  listCard: { background: '#fff', borderRadius: '16px', border: '1px solid #e0ede8', overflow: 'hidden', marginBottom: '16px' },
  listHeader: { display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 80px', padding: '12px 20px', background: '#f7faf8', borderBottom: '1px solid #e0ede8', fontSize: '12px', fontWeight: '600', color: '#888780' },
  listRow: { display: 'grid', gridTemplateColumns: '60px 1fr 120px 100px 80px', padding: '14px 20px', alignItems: 'center', borderBottom: '1px solid #f0f0f0', borderRadius: '8px', margin: '2px 8px' },
  loadingRow: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px' },
  colRank: { display: 'flex', alignItems: 'center' },
  colName: { display: 'flex', alignItems: 'center', gap: '12px' },
  colXP: { fontSize: '14px', fontWeight: '600', color: '#1D9E75' },
  colStreak: { fontSize: '13px', color: '#5F5E5A' },
  colTrees: { fontSize: '13px', color: '#5F5E5A' },
  rankBadge: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' },
  studentAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#27500A', flexShrink: 0 },
  studentName: { fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 2px' },
  studentLevel: { fontSize: '12px', color: '#888780', margin: 0 },
  youBadge: { color: '#1D9E75', fontSize: '12px' },
  xpText: { fontWeight: '700' },
  joinBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  motiveBanner: { background: '#EAF3DE', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #C0DD97' },
  motiveText: { flex: 1, fontSize: '14px', color: '#3B6D11', margin: 0, lineHeight: 1.5 },
  motiveBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },
}

export default Leaderboard
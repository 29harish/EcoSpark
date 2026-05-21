import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchLeaderboard } from '../../services/leaderboardService'
import { getUserFromDB } from '../../services/authService'

const Leaderboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState([])
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('friends')
  const [rankBy, setRankBy] = useState('xp')

useEffect(() => {
  const load = async () => {
    try {
      const lb = await fetchLeaderboard()
      setLeaderboard(lb.leaderboard)
    } catch (err) {
      console.log('Leaderboard error:', err)
    }
    try {
      const ud = await getUserFromDB(user.uid)
      setUserData(ud.user)
    } catch (err) {
      console.log('User fetch error:', err)
    }
    setLoading(false)
  }
  if (user) load()
}, [user])
  const levelTitles = {
    1: 'Eco Seedling', 2: 'Eco Sprout', 3: 'Eco Learner',
    4: 'Eco Explorer', 5: 'Eco Guardian', 6: 'Eco Warrior',
    7: 'Eco Champion', 8: 'Eco Master', 9: 'Eco Legend', 10: 'Earth Guardian'
  }

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/dashboard' },
    { icon: '📚', label: 'Learn', path: '/lessons' },
    { icon: '🎯', label: 'Missions', path: '/missions' },
    { icon: '📝', label: 'Quizzes', path: '/quiz' },
    { icon: '🌱', label: 'Eco Garden', path: '/garden' },
    { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
    { icon: '👥', label: 'Community', path: '/community' },
    { icon: '🤖', label: 'AI Eco Guide', path: '/ai-guide' },
    { icon: '🎁', label: 'Rewards', path: '/rewards' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ]

  const userRank = leaderboard.findIndex(s => s.firebaseUid === user?.uid) + 1

  const rankFilters = [
    { key: 'xp', label: 'XP', icon: '⭐' },
    { key: 'missions', label: 'Missions', icon: '🚩' },
    { key: 'streak', label: 'Streaks', icon: '🔥' },
    { key: 'impact', label: 'Impact Score', icon: '🌿' },
  ]

  const achievements = [
    { icon: '🛡️', title: 'Climbing High!', desc: 'Reach Top 5 in Friends Leaderboard', progress: 3, total: 5, coins: 50 },
  ]

  return (
    <div style={styles.page}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={{ fontSize: '28px' }}>🌿</span>
          <div>
            <p style={styles.logoText}>EcoSpark</p>
            <p style={styles.logoSub}>Learn • Play • Protect</p>
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
            </div>
          ))}
        </div>

        {/* Sidebar User Stats */}
        <div style={styles.sidebarStats}>
          <div style={styles.sidebarAvatarRow}>
            <div style={styles.sidebarAvatar}>
              {(userData?.name || 'E')[0].toUpperCase()}
            </div>
            <div>
              <p style={styles.sidebarName}>Level {userData?.level || 1}</p>
              <p style={styles.sidebarLevel}>{levelTitles[userData?.level || 1]}</p>
            </div>
          </div>
          <div style={styles.sidebarXpBar}>
            <div style={{ ...styles.sidebarXpFill, width: `${((userData?.xp || 0) % 1000) / 10}%` }} />
          </div>
          <p style={styles.sidebarXpText}>{userData?.xp || 0} / {(userData?.level || 1) * 1000} XP</p>
          <div style={styles.sidebarStatRow}>
            <span style={{ fontSize: '16px' }}>🔥</span>
            <div>
              <p style={styles.sidebarStatVal}>{userData?.streak || 0}</p>
              <p style={styles.sidebarStatLabel}>Day Streak</p>
            </div>
          </div>
          <div style={styles.sidebarStatRow}>
            <span style={{ fontSize: '16px' }}>🪙</span>
            <div>
              <p style={styles.sidebarStatVal}>{userData?.ecoins || 0}</p>
              <p style={styles.sidebarStatLabel}>Eco Coins</p>
            </div>
          </div>
          <div style={styles.sidebarStatRow}>
            <span style={{ fontSize: '16px' }}>🌳</span>
            <div>
              <p style={styles.sidebarStatVal}>{userData?.treesPlanted || 0}</p>
              <p style={styles.sidebarStatLabel}>Trees Planted</p>
            </div>
          </div>
        </div>

        <div style={styles.logoutBtn} onClick={async () => { await logout(); navigate('/login') }}>
          <span>🚪</span><span>Logout</span>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>

        {/* Top Bar */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>Leaderboard 🏆 🌿</h1>
            <p style={styles.subtitle}>Compete, climb ranks and make a bigger impact!</p>
          </div>
          <div style={styles.topBarRight}>
            <div style={styles.statPill}>
              <span>🪙</span>
              <span style={styles.pillVal}>{userData?.ecoins || 0}</span>
            </div>
            <div style={styles.statPill}>
              <span>🌿</span>
              <span style={styles.pillVal}>{userData?.treesPlanted || 0}</span>
            </div>
            <div style={styles.statPill}>
              <span>💧</span>
              <span style={styles.pillVal}>0</span>
            </div>
            <div style={styles.notifBtn}>🔔</div>
            <div style={styles.userPill}>
              <div style={styles.userAvatar}>
                {(userData?.name || 'E')[0].toUpperCase()}
              </div>
              <div>
                <p style={styles.userName}>{userData?.name || 'Eco Hero'}</p>
                <p style={styles.userLevel}>Level {userData?.level || 1}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.contentRow}>

          {/* Left — leaderboard */}
          <div style={styles.leftCol}>

            {/* Tabs */}
            <div style={styles.tabsRow}>
              {[
                { key: 'friends', label: 'Friends', icon: '👥' },
                { key: 'school', label: 'School', icon: '🏫' },
                { key: 'global', label: 'Global', icon: '🌍' },
              ].map(tab => (
                <button
                  key={tab.key}
                  style={activeTab === tab.key ? styles.tabActive : styles.tab}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Rank Filters */}
            <div style={styles.rankFiltersRow}>
              <span style={styles.rankByLabel}>Rank by</span>
              {rankFilters.map(f => (
                <button
                  key={f.key}
                  style={rankBy === f.key ? styles.rankFilterActive : styles.rankFilter}
                  onClick={() => setRankBy(f.key)}
                >
                  {f.icon} {f.label}
                </button>
              ))}
              <span style={styles.infoIcon}>ℹ️</span>
            </div>

            <div style={styles.rankMeta}>
              <span style={styles.updateText}>🕐 Rankings update every hour</span>
              {userRank > 0 && (
                <span style={styles.yourRank}>Your Rank: #{userRank}</span>
              )}
            </div>

            {/* List */}
            <div style={styles.listCard}>
              {loading ? (
                <div style={styles.centerCol}>
                  <span style={{ fontSize: '32px' }}>🌱</span>
                  <p style={{ color: '#888780' }}>Loading rankings...</p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div style={styles.centerCol}>
                  <span style={{ fontSize: '48px' }}>🌍</span>
                  <p style={{ color: '#888780' }}>No students yet. Be the first!</p>
                  <button style={styles.earnBtn} onClick={() => navigate('/quiz')}>
                    Start Earning XP
                  </button>
                </div>
              ) : (
                leaderboard.map((student, i) => {
                  const isMe = student.firebaseUid === user?.uid
                  const rankIcon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
                  const rankBg = i === 0 ? '#EF9F27' : i === 1 ? '#C0C0C0' : i === 2 ? '#BA7517' : '#e0ede8'
                  const rankColor = i < 3 ? '#fff' : '#5F5E5A'

                  return (
                    <div
                      key={student._id}
                      style={{
                        ...styles.listRow,
                        background: isMe ? '#EAF3DE' : '#fff',
                        border: isMe ? '2px solid #1D9E75' : '1px solid #f0f0f0',
                      }}
                    >
                      {/* Rank */}
                      <div style={{ ...styles.rankCircle, background: rankBg, color: rankColor }}>
                        {rankIcon || i + 1}
                      </div>

                      {/* Avatar + Name */}
                      <div style={styles.studentInfo}>
                        <div style={styles.studentAvatar}>
                          {student.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p style={styles.studentName}>
                            {student.name}
                            {isMe && <span style={styles.youTag}> (You)</span>}
                          </p>
                          <p style={styles.studentTitle}>
                            {levelTitles[student.level] || 'Eco Seedling'}
                          </p>
                        </div>
                      </div>

                      {/* XP */}
                      <div style={styles.xpCol}>
                        <span style={styles.xpBadge}>⭐ {student.xp} XP</span>
                      </div>

                      {/* Streak */}
                      <div style={styles.metaCol}>
                        <p style={styles.metaVal}>🔥 {student.streak}</p>
                        <p style={styles.metaLabel}>Day Streak</p>
                      </div>

                      {/* Impact */}
                      <div style={styles.metaCol}>
                        <p style={styles.metaVal}>🌿 {student.xp * 0.1 | 0}</p>
                        <p style={styles.metaLabel}>Impact Score</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Motivational Banner */}
            <div style={styles.motiveBanner}>
              <span style={{ fontSize: '28px' }}>🏆</span>
              <p style={styles.motiveText}>
                Keep learning, completing missions and maintaining streaks to climb higher on the leaderboard!
              </p>
              <span style={{ fontSize: '32px' }}>🌳</span>
            </div>

          </div>

          {/* Right Panel */}
          <div style={styles.rightCol}>

            {/* Your Stats Summary */}
            <div style={styles.rightCard}>
              <h3 style={styles.rightCardTitle}>Your Stats Summary 📊</h3>
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <span style={{ fontSize: '20px' }}>⭐</span>
                  <p style={styles.statBoxVal}>{userData?.xp || 0}</p>
                  <p style={styles.statBoxLabel}>Total XP</p>
                </div>
                <div style={styles.statBox}>
                  <span style={{ fontSize: '20px' }}>🚩</span>
                  <p style={styles.statBoxVal}>{userData?.completedMissions?.length || 0}</p>
                  <p style={styles.statBoxLabel}>Missions Completed</p>
                </div>
                <div style={styles.statBox}>
                  <span style={{ fontSize: '20px' }}>🔥</span>
                  <p style={styles.statBoxVal}>{userData?.streak || 0} Days</p>
                  <p style={styles.statBoxLabel}>Best Streak</p>
                </div>
                <div style={styles.statBox}>
                  <span style={{ fontSize: '20px' }}>🌿</span>
                  <p style={styles.statBoxVal}>{(userData?.xp || 0) * 0.1 | 0}</p>
                  <p style={styles.statBoxLabel}>Impact Score</p>
                </div>
              </div>
              <div style={styles.impactInfo}>
                <span style={styles.impactInfoText}>How is Impact Score calculated?</span>
                <span>›</span>
              </div>
            </div>

            {/* Top Contributors */}
            <div style={styles.rightCard}>
              <h3 style={styles.rightCardTitle}>Top Contributors (This Week)</h3>
              {!loading && leaderboard.length >= 3 ? (
                <div style={styles.podiumWrap}>
                  {/* 2nd */}
                  <div style={styles.podiumItem}>
                    <div style={styles.podiumAvatar}>
                      {leaderboard[1]?.name[0].toUpperCase()}
                    </div>
                    <div style={{ ...styles.podiumBlock, height: '50px', background: '#C0C0C0' }}>2</div>
                    <p style={styles.podiumName}>{leaderboard[1]?.name.split(' ')[0]}</p>
                    <p style={styles.podiumScore}>{(leaderboard[1]?.xp * 0.1) | 0}</p>
                  </div>
                  {/* 1st */}
                  <div style={styles.podiumItem}>
                    <div style={{ ...styles.podiumAvatar, border: '3px solid #EF9F27', background: '#FFF3D6' }}>
                      {leaderboard[0]?.name[0].toUpperCase()}
                    </div>
                    <div style={{ ...styles.podiumBlock, height: '70px', background: '#EF9F27' }}>1</div>
                    <p style={styles.podiumName}>{leaderboard[0]?.name.split(' ')[0]}</p>
                    <p style={styles.podiumScore}>{(leaderboard[0]?.xp * 0.1) | 0}</p>
                  </div>
                  {/* 3rd */}
                  <div style={styles.podiumItem}>
                    <div style={styles.podiumAvatar}>
                      {leaderboard[2]?.name[0].toUpperCase()}
                    </div>
                    <div style={{ ...styles.podiumBlock, height: '36px', background: '#BA7517' }}>3</div>
                    <p style={styles.podiumName}>{leaderboard[2]?.name.split(' ')[0]}</p>
                    <p style={styles.podiumScore}>{(leaderboard[2]?.xp * 0.1) | 0}</p>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#888780', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                  Not enough data yet
                </p>
              )}
              <button style={styles.viewAllBtn} onClick={() => {}}>
                View All Rankings →
              </button>
            </div>

            {/* Achievements */}
            <div style={styles.rightCard}>
              <div style={styles.achieveHeader}>
                <h3 style={styles.rightCardTitle}>Achievements</h3>
                <span style={styles.viewAllLink}>View All</span>
              </div>
              {achievements.map((a, i) => (
                <div key={i} style={styles.achieveRow}>
                  <span style={{ fontSize: '32px' }}>🛡️</span>
                  <div style={styles.achieveInfo}>
                    <p style={styles.achieveTitle}>{a.title}</p>
                    <p style={styles.achieveDesc}>{a.desc}</p>
                    <div style={styles.achieveBarBg}>
                      <div style={{ ...styles.achieveBarFill, width: `${(a.progress / a.total) * 100}%` }} />
                    </div>
                    <p style={styles.achieveProgress}>{a.progress}/{a.total}</p>
                  </div>
                  <div style={styles.achieveCoins}>
                    <span>🪙</span>
                    <span>+{a.coins}</span>
                    <span style={styles.coinsLabel}>Eco Coins</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f7fa', fontFamily: 'Poppins, sans-serif' },

  // Sidebar
  sidebar: { width: '220px', minWidth: '220px', background: '#fff', borderRight: '1px solid #e0ede8', display: 'flex', flexDirection: 'column', padding: '20px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px 16px', borderBottom: '1px solid #e0ede8' },
  logoText: { fontSize: '18px', fontWeight: '700', color: '#1D9E75', margin: 0 },
  logoSub: { fontSize: '10px', color: '#888780', margin: 0 },
  navList: { padding: '12px 0' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 20px', cursor: 'pointer', borderRadius: '8px', margin: '1px 8px', color: '#5F5E5A', fontSize: '13px' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 20px', cursor: 'pointer', borderRadius: '8px', margin: '1px 8px', background: '#1D9E75', color: '#fff', fontSize: '13px', fontWeight: '500' },
  navIcon: { fontSize: '16px' },
  navLabel: { flex: 1 },
  sidebarStats: { padding: '16px 20px', borderTop: '1px solid #e0ede8', display: 'flex', flexDirection: 'column', gap: '10px' },
  sidebarAvatarRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  sidebarAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#27500A' },
  sidebarName: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  sidebarLevel: { fontSize: '11px', color: '#888780', margin: 0 },
  sidebarXpBar: { background: '#e0ede8', borderRadius: '99px', height: '6px' },
  sidebarXpFill: { background: '#378ADD', borderRadius: '99px', height: '6px' },
  sidebarXpText: { fontSize: '11px', color: '#888780', margin: 0, textAlign: 'right' },
  sidebarStatRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  sidebarStatVal: { fontSize: '15px', fontWeight: '700', color: '#2C2C2A', margin: 0 },
  sidebarStatLabel: { fontSize: '11px', color: '#888780', margin: 0 },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#888780', fontSize: '13px', padding: '14px 20px', borderTop: '1px solid #e0ede8', marginTop: 'auto' },

  // Main
  main: { flex: 1, padding: '20px 24px', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 4px' },
  subtitle: { fontSize: '13px', color: '#888780', margin: 0 },
  topBarRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  statPill: { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e0ede8', borderRadius: '10px', padding: '8px 14px', fontSize: '14px' },
  pillVal: { fontWeight: '600', color: '#2C2C2A', fontSize: '14px' },
  notifBtn: { fontSize: '20px', cursor: 'pointer', position: 'relative' },
  userPill: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e0ede8', borderRadius: '10px', padding: '6px 12px', cursor: 'pointer' },
  userAvatar: { width: '32px', height: '32px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#27500A' },
  userName: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  userLevel: { fontSize: '11px', color: '#888780', margin: 0 },

  // Content
  contentRow: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '14px' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '14px' },

  // Tabs
  tabsRow: { display: 'flex', gap: '0', background: '#fff', borderRadius: '12px', border: '1px solid #e0ede8', overflow: 'hidden' },
  tab: { flex: 1, padding: '12px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '500', color: '#5F5E5A', cursor: 'pointer' },
  tabActive: { flex: 1, padding: '12px', border: 'none', background: '#1D9E75', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer' },

  // Rank Filters
  rankFiltersRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  rankByLabel: { fontSize: '13px', color: '#888780', fontWeight: '500' },
  rankFilter: { padding: '6px 14px', borderRadius: '8px', border: '1px solid #e0ede8', background: '#fff', fontSize: '13px', color: '#5F5E5A', cursor: 'pointer' },
  rankFilterActive: { padding: '6px 14px', borderRadius: '8px', border: '2px solid #1D9E75', background: '#EAF3DE', fontSize: '13px', color: '#27500A', cursor: 'pointer', fontWeight: '600' },
  infoIcon: { fontSize: '16px', cursor: 'pointer', marginLeft: 'auto' },
  rankMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  updateText: { fontSize: '12px', color: '#888780' },
  yourRank: { fontSize: '13px', color: '#1D9E75', fontWeight: '600' },

  // List
  listCard: { background: '#fff', borderRadius: '16px', border: '1px solid #e0ede8', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px' },
  listRow: { display: 'grid', gridTemplateColumns: '48px 1fr 140px 110px 110px', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', gap: '8px' },
  centerCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '32px' },
  rankCircle: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' },
  studentInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  studentAvatar: { width: '38px', height: '38px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', color: '#27500A', flexShrink: 0 },
  studentName: { fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 2px' },
  studentTitle: { fontSize: '12px', color: '#888780', margin: 0 },
  youTag: { color: '#1D9E75', fontSize: '12px' },
  xpCol: { display: 'flex', alignItems: 'center' },
  xpBadge: { background: '#F0EDFF', color: '#5B4FCF', fontSize: '13px', fontWeight: '700', padding: '4px 12px', borderRadius: '99px' },
  metaCol: { display: 'flex', flexDirection: 'column' },
  metaVal: { fontSize: '14px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 2px' },
  metaLabel: { fontSize: '11px', color: '#888780', margin: 0 },
  earnBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },

  // Motive Banner
  motiveBanner: { background: '#EAF3DE', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', border: '1px solid #C0DD97' },
  motiveText: { flex: 1, fontSize: '13px', color: '#3B6D11', margin: 0, lineHeight: 1.5 },

  // Right Cards
  rightCard: { background: '#fff', borderRadius: '16px', border: '1px solid #e0ede8', padding: '16px' },
  rightCardTitle: { fontSize: '14px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 14px' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' },
  statBox: { background: '#f7faf8', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' },
  statBoxVal: { fontSize: '16px', fontWeight: '700', color: '#2C2C2A', margin: 0 },
  statBoxLabel: { fontSize: '11px', color: '#888780', margin: 0 },
  impactInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f7faf8', borderRadius: '8px', padding: '10px 12px', cursor: 'pointer' },
  impactInfoText: { fontSize: '13px', color: '#5F5E5A' },

  // Podium
  podiumWrap: { display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '10px', padding: '16px 0', marginBottom: '12px' },
  podiumItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  podiumAvatar: { width: '44px', height: '44px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#27500A', border: '2px solid #e0ede8' },
  podiumBlock: { width: '60px', borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: '#fff' },
  podiumName: { fontSize: '12px', fontWeight: '600', color: '#2C2C2A', margin: 0, textAlign: 'center' },
  podiumScore: { fontSize: '11px', color: '#888780', margin: 0 },
  viewAllBtn: { width: '100%', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },

  // Achievements
  achieveHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  viewAllLink: { fontSize: '13px', color: '#1D9E75', cursor: 'pointer', fontWeight: '500' },
  achieveRow: { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  achieveInfo: { flex: 1 },
  achieveTitle: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 2px' },
  achieveDesc: { fontSize: '12px', color: '#888780', margin: '0 0 8px' },
  achieveBarBg: { background: '#e0ede8', borderRadius: '99px', height: '6px', marginBottom: '4px' },
  achieveBarFill: { background: '#1D9E75', borderRadius: '99px', height: '6px' },
  achieveProgress: { fontSize: '11px', color: '#888780', margin: 0 },
  achieveCoins: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', background: '#FAEEDA', borderRadius: '10px', padding: '8px 10px' },
  coinsLabel: { fontSize: '10px', color: '#854F0B' },
}

export default Leaderboard
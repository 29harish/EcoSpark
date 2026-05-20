import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserFromDB } from '../../services/authService'
import { fetchLeaderboard } from '../../services/leaderboardService'

const Leaderboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('friends')
  const [activeSortFilter, setActiveSortFilter] = useState('xp')

  useEffect(() => {
    const loadData = async () => {
      try {
        const userDataResponse = await getUserFromDB(user.uid)
        setUserData(userDataResponse.user)

        const leaderboardData = await fetchLeaderboard()
        setLeaderboard(leaderboardData.leaderboard || [])
      } catch (err) {
        console.log('Error loading data:', err)
      }
      setLoading(false)
    }
    if (user) loadData()
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const levelTitles = {
    1: 'Eco Seedling', 2: 'Eco Sprout', 3: 'Eco Learner',
    4: 'Eco Explorer', 5: 'Eco Guardian', 6: 'Eco Warrior',
    7: 'Eco Champion', 8: 'Eco Master', 9: 'Eco Legend', 10: 'Earth Guardian'
  }

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/dashboard' },
    { icon: '📚', label: 'Learn', path: '/lessons' },
    { icon: '📋', label: 'Missions', path: '/missions' },
    { icon: '📝', label: 'Quizzes', path: '/quiz' },
    { icon: '🌱', label: 'Eco Garden', path: '/garden' },
    { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
    { icon: '👥', label: 'Community', path: '/community' },
    { icon: '🤖', label: 'AI Eco Guide', path: '/ai-guide' },
    { icon: '🎁', label: 'Rewards', path: '/rewards' },
    { icon: '👤', label: 'Profile', path: '/profile' },
    { icon: '⚙️', label: 'Settings', path: '/settings' },
  ]

  const topContributors = [
    { rank: 1, name: 'Rohan S.', score: 2450, avatar: 'R' },
    { rank: 2, name: 'Meera I.', score: 2120, avatar: 'M' },
    { rank: 3, name: 'Arjun P.', score: 1980, avatar: 'A' },
  ]

  const achievements = [
    { icon: '⭐', title: 'Climbing High!', desc: 'Reach Top 5 in Friends Leaderboard', earned: true, reward: '+50' },
  ]

  const sortFilters = [
    { id: 'xp', label: 'XP', icon: '✨' },
    { id: 'missions', label: 'Missions', icon: '🚩' },
    { id: 'streaks', label: 'Streaks', icon: '🔥' },
    { id: 'impact', label: 'Impact Score', icon: '🌿' },
  ]

  if (loading) return (
    <div style={styles.loadingPage}>
      <span style={{ fontSize: '48px' }}>🌱</span>
      <p style={{ color: '#888780' }}>Loading leaderboard...</p>
    </div>
  )

  return (
    <div style={styles.page}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <div style={styles.sidebarLogo}>
            <span style={{ fontSize: '24px' }}>🌿</span>
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
        </div>

        <div style={styles.sidebarBottom}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>
              {(userData?.name || user?.displayName || 'E')[0].toUpperCase()}
            </div>
            <p style={styles.userLevel}>Level {userData?.level || 1}</p>
            <p style={styles.userTitle}>{levelTitles[userData?.level || 1]}</p>
            <div style={styles.xpBar}>
              <div style={{ ...styles.xpFill, width: '65%' }} />
            </div>
            <p style={styles.xpText}>650 / 1000 XP</p>
          </div>
          <div style={styles.userStats}>
            <div style={styles.userStat}>
              <span style={{ fontSize: '16px' }}>🔥</span>
              <p>7 Day Streak</p>
            </div>
            <div style={styles.userStat}>
              <span style={{ fontSize: '16px' }}>🪙</span>
              <p>{userData?.ecoins || 0} Coins</p>
            </div>
            <div style={styles.userStat}>
              <span style={{ fontSize: '16px' }}>🌳</span>
              <p>{userData?.treesPlanted || 0} Trees</p>
            </div>
          </div>
          <div style={styles.logoutBtn} onClick={handleLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>

        {/* Top Bar */}
        <div style={styles.topBar}>
          <div style={styles.topBarLeft}>
            <h1 style={styles.title}>Leaderboard 🏆🌱</h1>
            <p style={styles.subtitle}>Compete, climb ranks and make a bigger impact!</p>
          </div>
          <div style={styles.topBarRight}>
            <div style={styles.statChip}>
              <span>🪙</span>
              <span>{userData?.ecoins || 1250}</span>
            </div>
            <div style={styles.statChip}>
              <span>🌿</span>
              <span>{userData?.impactScore || 320}</span>
            </div>
            <div style={styles.statChip}>
              <span>💧</span>
              <span>15</span>
            </div>
            <div style={styles.notifIcon}>🔔</div>
            <div style={styles.profileIcon} onClick={() => navigate('/profile')}>
              <span>{(userData?.name || 'E')[0].toUpperCase()}</span>
              <p style={styles.profileName}>{userData?.name || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div style={styles.contentGrid}>

          {/* Left - Leaderboard */}
          <div style={styles.leftColumn}>

            {/* Tab Navigation */}
            <div style={styles.tabsContainer}>
              {['friends', 'school', 'global'].map(tab => (
                <button
                  key={tab}
                  style={activeTab === tab ? styles.tabButtonActive : styles.tabButton}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'friends' ? '👥 Friends' : tab === 'school' ? '🏠 School' : '🌍 Global'}
                </button>
              ))}
            </div>

            {/* Sort Filters */}
            <div style={styles.filtersContainer}>
              {sortFilters.map(filter => (
                <button
                  key={filter.id}
                  style={activeSortFilter === filter.id ? styles.filterButtonActive : styles.filterButton}
                  onClick={() => setActiveSortFilter(filter.id)}
                >
                  {filter.icon} {filter.label}
                </button>
              ))}
              <div style={styles.updateInfo}>
                <span>ℹ️</span>
                <p>Rankings update every hour</p>
              </div>
            </div>

            {/* Leaderboard List */}
            <div style={styles.leaderboardCard}>
              {leaderboard.map((student, i) => {
                const isCurrentUser = student.firebaseUid === user?.uid
                return (
                  <div
                    key={student._id}
                    style={{
                      ...styles.leaderboardRow,
                      ...(isCurrentUser ? styles.leaderboardRowHighlight : {}),
                    }}
                  >
                    <div style={styles.rankCol}>
                      <div style={styles.rankBadge}>
                        {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                      </div>
                    </div>
                    <div style={styles.studentCol}>
                      <div style={styles.studentAvatar}>
                        {student.name[0].toUpperCase()}
                      </div>
                      <div style={styles.studentInfo}>
                        <p style={styles.studentName}>
                          {student.name}
                          {isCurrentUser && <span style={styles.youLabel}> (You)</span>}
                        </p>
                        <p style={styles.studentTitle}>{levelTitles[student.level] || 'Eco Learner'}</p>
                      </div>
                    </div>
                    <div style={styles.statsCol}>
                      <div style={styles.stat}>
                        <span style={styles.statIcon}>✨</span>
                        <span style={styles.statValue}>{student.xp} XP</span>
                      </div>
                      <div style={styles.stat}>
                        <span style={styles.statIcon}>🔥</span>
                        <span style={styles.statValue}>{student.streak} d</span>
                      </div>
                      <div style={styles.stat}>
                        <span style={styles.statIcon}>🌿</span>
                        <span style={styles.statValue}>{student.impactScore || 1500}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Motivational Banner */}
            <div style={styles.motiveBanner}>
              <span style={{ fontSize: '36px' }}>🏆</span>
              <div style={styles.motiveBannerText}>
                <p style={styles.motiveBannerTitle}>Keep learning, completing missions and maintaining streaks</p>
                <p style={styles.motiveBannerSub}>to climb higher on the leaderboard!</p>
              </div>
              <span style={{ fontSize: '28px' }}>🌱</span>
            </div>

          </div>

          {/* Right - Stats & Achievements */}
          <div style={styles.rightColumn}>

            {/* Your Stats Summary */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Your Stats Summary 📊</h3>
              <div style={styles.summaryStats}>
                <div style={styles.summaryStat}>
                  <span style={{ fontSize: '24px' }}>✨</span>
                  <p style={styles.summaryLabel}>Total XP</p>
                  <p style={styles.summaryValue}>{userData?.xp || 12560}</p>
                </div>
                <div style={styles.summaryStat}>
                  <span style={{ fontSize: '24px' }}>🚩</span>
                  <p style={styles.summaryLabel}>Missions</p>
                  <p style={styles.summaryValue}>25</p>
                </div>
              </div>
              <div style={styles.summaryStats}>
                <div style={styles.summaryStat}>
                  <span style={{ fontSize: '24px' }}>🔥</span>
                  <p style={styles.summaryLabel}>Best Streak</p>
                  <p style={styles.summaryValue}>7 Days</p>
                </div>
                <div style={styles.summaryStat}>
                  <span style={{ fontSize: '24px' }}>🌿</span>
                  <p style={styles.summaryLabel}>Impact Score</p>
                  <p style={styles.summaryValue}>1,560</p>
                </div>
              </div>
              <a style={styles.learnMore}>How is Impact Score calculated? →</a>
            </div>

            {/* Top Contributors */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Top Contributors (This Week)</h3>
              <div style={styles.contributorsGrid}>
                {topContributors.map((contributor, i) => (
                  <div key={i} style={styles.contributorItem}>
                    <div style={{ ...styles.contributorRank, background: ['#FFD700', '#C0C0C0', '#CD7F32'][i] }}>
                      {i + 1}
                    </div>
                    <div style={styles.contributorAvatar}>
                      {contributor.avatar}
                    </div>
                    <p style={styles.contributorName}>{contributor.name}</p>
                    <p style={styles.contributorScore}>{contributor.score}</p>
                  </div>
                ))}
              </div>
              <button style={styles.viewAllBtn}>View All Rankings →</button>
            </div>

            {/* Achievements */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Achievements</h3>
              {achievements.map((achievement, i) => (
                <div key={i} style={styles.achievementItem}>
                  <div style={styles.achievementIcon}>{achievement.icon}</div>
                  <div style={styles.achievementContent}>
                    <p style={styles.achievementTitle}>{achievement.title}</p>
                    <p style={styles.achievementDesc}>{achievement.desc}</p>
                  </div>
                  <div style={styles.achievementReward}>{achievement.reward}</div>
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
  loadingPage: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' },

  // Sidebar
  sidebar: { width: '200px', background: '#fff', borderRight: '1px solid #e0ede8', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' },
  sidebarTop: { flex: 1, padding: '20px 0', display: 'flex', flexDirection: 'column' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px 16px', borderBottom: '1px solid #e0ede8' },
  logoText: { fontSize: '14px', fontWeight: '700', color: '#1D9E75', margin: 0 },
  logoSub: { fontSize: '9px', color: '#888780', margin: 0 },
  navList: { flex: 1, padding: '12px 0', overflow: 'auto' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', cursor: 'pointer', color: '#5F5E5A', fontSize: '13px', margin: '1px 6px', borderRadius: '6px' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', cursor: 'pointer', background: '#1D9E75', color: '#fff', fontSize: '13px', margin: '1px 6px', borderRadius: '6px', fontWeight: '500' },
  navIcon: { fontSize: '16px', minWidth: '16px' },
  navLabel: { flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  sidebarBottom: { padding: '16px', borderTop: '1px solid #e0ede8', display: 'flex', flexDirection: 'column', gap: '12px' },
  userCard: { background: '#EAF3DE', borderRadius: '10px', padding: '12px', textAlign: 'center' },
  userAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#1D9E75', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', margin: '0 auto 6px' },
  userLevel: { fontSize: '11px', color: '#888780', margin: '0 0 2px' },
  userTitle: { fontSize: '12px', fontWeight: '600', color: '#1D9E75', margin: '0 0 8px' },
  xpBar: { background: 'rgba(0,0,0,0.1)', height: '4px', borderRadius: '99px', marginBottom: '4px' },
  xpFill: { background: '#1D9E75', height: '4px', borderRadius: '99px' },
  xpText: { fontSize: '10px', color: '#888780', margin: 0 },
  userStats: { display: 'flex', flexDirection: 'column', gap: '6px' },
  userStat: { fontSize: '11px', color: '#5F5E5A', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 },
  logoutBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', color: '#888780', fontSize: '12px', padding: '8px', borderRadius: '6px', border: '1px solid #e0ede8' },

  // Main
  main: { flex: 1, padding: '20px 24px', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e0ede8' },
  topBarLeft: {},
  title: { fontSize: '28px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 4px' },
  subtitle: { fontSize: '13px', color: '#888780', margin: 0 },
  topBarRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  statChip: { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e0ede8', borderRadius: '20px', padding: '6px 12px', fontSize: '13px', fontWeight: '600', color: '#2C2C2A' },
  notifIcon: { fontSize: '20px', cursor: 'pointer' },
  profileIcon: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' },
  profileName: { fontSize: '12px', color: '#888780', margin: 0 },

  // Content Grid
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' },
  leftColumn: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rightColumn: { display: 'flex', flexDirection: 'column', gap: '16px' },

  // Tabs
  tabsContainer: { display: 'flex', gap: '8px' },
  tabButton: { background: '#fff', border: '1px solid #e0ede8', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: '#5F5E5A' },
  tabButtonActive: { background: '#1D9E75', border: '2px solid #1D9E75', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#fff' },

  // Filters
  filtersContainer: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  filterButton: { background: '#fff', border: '1px solid #e0ede8', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', color: '#5F5E5A' },
  filterButtonActive: { background: '#EAF3DE', border: '2px solid #1D9E75', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', color: '#1D9E75', fontWeight: '600' },
  updateInfo: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#888780', marginLeft: 'auto' },

  // Leaderboard
  leaderboardCard: { background: '#fff', borderRadius: '12px', border: '1px solid #e0ede8' },
  leaderboardRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px', borderBottom: '1px solid #f0f0f0' },
  leaderboardRowHighlight: { background: '#EAF3DE', borderLeft: '4px solid #1D9E75' },
  rankCol: {},
  rankBadge: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', background: '#f0f0f0' },
  studentCol: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
  studentAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#27500A', flexShrink: 0 },
  studentInfo: {},
  studentName: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  studentTitle: { fontSize: '11px', color: '#888780', margin: 0 },
  youLabel: { color: '#1D9E75', fontSize: '12px' },
  statsCol: { display: 'flex', gap: '16px' },
  stat: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: '#5F5E5A' },
  statIcon: { fontSize: '14px' },
  statValue: {},

  // Motivational Banner
  motiveBanner: { background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e0ede8', display: 'flex', alignItems: 'center', gap: '12px' },
  motiveBannerText: {},
  motiveBannerTitle: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  motiveBannerSub: { fontSize: '12px', color: '#888780', margin: '2px 0 0' },

  // Cards
  card: { background: '#fff', borderRadius: '12px', border: '1px solid #e0ede8', padding: '16px' },
  cardTitle: { fontSize: '14px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 12px' },

  // Summary Stats
  summaryStats: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' },
  summaryStat: { padding: '10px', background: '#f9fbfa', borderRadius: '8px', textAlign: 'center' },
  summaryLabel: { fontSize: '11px', color: '#888780', margin: '4px 0 0' },
  summaryValue: { fontSize: '16px', fontWeight: '700', color: '#1D9E75', margin: 0 },
  learnMore: { fontSize: '11px', color: '#1D9E75', cursor: 'pointer', fontWeight: '500' },

  // Contributors
  contributorsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' },
  contributorItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },
  contributorRank: { width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#fff' },
  contributorAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#27500A' },
  contributorName: { fontSize: '11px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  contributorScore: { fontSize: '11px', color: '#888780', margin: 0 },
  viewAllBtn: { width: '100%', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },

  // Achievements
  achievementItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f9fbfa', borderRadius: '8px', marginBottom: '8px' },
  achievementIcon: { fontSize: '24px' },
  achievementContent: { flex: 1 },
  achievementTitle: { fontSize: '12px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  achievementDesc: { fontSize: '11px', color: '#888780', margin: '2px 0 0' },
  achievementReward: { background: '#FFD700', color: '#fff', borderRadius: '20px', padding: '4px 8px', fontSize: '11px', fontWeight: '600' },
}

export default Leaderboard

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserFromDB } from '../../services/authService'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserFromDB(user.uid)
        setUserData(data.user)
      } catch (err) {
        console.log('Error fetching user:', err)
      }
      setLoading(false)
    }
    if (user) fetchUser()
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) return (
    <div style={styles.loadingPage}>
      <span style={{ fontSize: '48px' }}>🌱</span>
      <p style={{ fontFamily: 'Poppins, sans-serif', color: '#888780' }}>Loading your eco journey...</p>
    </div>
  )

  const xpForNextLevel = (userData?.level || 1) * 1000
  const xpProgress = userData ? ((userData.xp % 1000) / 10) : 0

  const levelTitles = {
    1: 'Eco Seedling', 2: 'Eco Sprout', 3: 'Eco Learner',
    4: 'Eco Explorer', 5: 'Eco Guardian', 6: 'Eco Warrior',
    7: 'Eco Champion', 8: 'Eco Master', 9: 'Eco Legend', 10: 'Earth Guardian'
  }
  const levelTitle = levelTitles[userData?.level || 1]

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

  const missions = [
    { icon: '🍶', title: 'Use a Reusable Bottle', coins: 20, done: true, bg: '#EAF3DE' },
    { icon: '♻️', title: 'Recycle Paper Waste', coins: 30, done: false, bg: '#FAEEDA' },
    { icon: '🌱', title: 'Plant a Sapling', coins: 40, done: false, bg: '#E6F1FB' },
  ]

  const exploreItems = [
    { icon: '📚', label: 'Lessons', bg: '#E8D5F5' },
    { icon: '❓', label: 'Quizzes', bg: '#FAEEDA' },
    { icon: '⚔️', label: 'Trivia Battle', bg: '#FAEEDA' },
    { icon: '▶️', label: 'Eco Shorts', bg: '#D5EEF5' },
    { icon: '🏆', label: 'Challenges', bg: '#FAEEDA' },
  ]

  const achievements = [
    { icon: '🌱', title: 'Eco Starter', desc: 'Complete 5 lessons', earned: true },
    { icon: '♻️', title: 'Recycler Pro', desc: 'Recycle 50 items', earned: true },
    { icon: '🌍', title: 'Planet Guardian', desc: 'Reach Level 5', earned: false },
    { icon: '⚡', title: 'Eco Champion', desc: 'Win 10 challenges', earned: false },
  ]

  const recentActivity = [
    { action: 'Completed lesson', item: 'Ocean Conservation', time: '2 hours ago', icon: '📚' },
    { action: 'Earned badge', item: 'Eco Starter', time: '5 hours ago', icon: '🏅' },
    { action: 'Planted tree', item: '1 virtual tree', time: '1 day ago', icon: '🌳' },
    { action: 'Won challenge', item: 'Plastic Challenge', time: '2 days ago', icon: '🎯' },
  ]

  const weeklyGoals = [
    { goal: 'Complete 3 lessons', current: 2, target: 3, icon: '📚' },
    { goal: 'Score 80%+ on quizzes', current: 75, target: 80, icon: '✏️' },
    { goal: 'Complete missions', current: 5, target: 7, icon: '🎯' },
  ]

  const environmentalImpact = [
    { label: 'CO₂ Saved', value: '2.4 kg', unit: 'this month', icon: '💨' },
    { label: 'Waste Reduced', value: '15 kg', unit: 'this month', icon: '♻️' },
    { label: 'Water Saved', value: '500 L', unit: 'this month', icon: '💧' },
    { label: 'Impact Score', value: '85', unit: '/100', icon: '⭐' },
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
              style={item.path === '/dashboard' ? styles.navItemActive : styles.navItem}
              onClick={() => navigate(item.path)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
              {item.badge && <span style={styles.newBadge}>{item.badge}</span>}
            </div>
          ))}
        </div>

        <div style={styles.sidebarBottom}>
          <div style={styles.sidebarEarth}>
            <span style={{ fontSize: '80px' }}>🌍</span>
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
          <div>
            <h1 style={styles.greeting}>
              Hey, {userData?.name || user?.displayName || 'Eco Hero'}! 🌿
            </h1>
            <p style={styles.greetingSub}>Great to see you again! Let's make Earth a better place 🌍</p>
          </div>
          <div style={styles.topBarRight}>
            <div style={styles.searchBar}>
              <span>🔍</span>
              <input
                placeholder="Search lessons, topics, missions..."
                style={styles.searchInput}
              />
            </div>
            <div style={styles.notifBtn}>🔔</div>
            <div style={styles.avatarCircle}>
              {(userData?.name || user?.displayName || 'E')[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLeft}>
              <span style={{ fontSize: '36px' }}>⭐</span>
              <div>
                <p style={styles.statLabel}>Level</p>
                <p style={styles.statValue}>{userData?.level || 1}</p>
                <p style={styles.statSub}>{levelTitle}</p>
              </div>
            </div>
            <div style={styles.xpBarWrap}>
              <div style={styles.xpBarBg}>
                <div style={{ ...styles.xpBarFill, width: `${xpProgress}%` }} />
              </div>
              <p style={styles.xpText}>{userData?.xp || 0} / {xpForNextLevel} XP</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={{ fontSize: '36px' }}>🪙</span>
            <div>
              <p style={styles.statLabel}>Eco Coins</p>
              <p style={styles.statValue}>{userData?.ecoins || 0}</p>
              <p style={{ ...styles.statSub, color: '#1D9E75' }}>+0 today ↑</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={{ fontSize: '36px' }}>🔥</span>
            <div>
              <p style={styles.statLabel}>Streak</p>
              <p style={styles.statValue}>{userData?.streak || 0}</p>
              <p style={styles.statSub}>days in a row!</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={{ fontSize: '36px' }}>🌳</span>
            <div>
              <p style={styles.statLabel}>Trees Planted</p>
              <p style={styles.statValue}>{userData?.treesPlanted || 0}</p>
              <p style={styles.statSub}>Keep going!</p>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div style={styles.impactGrid}>
          {environmentalImpact.map((impact, i) => (
            <div key={i} style={styles.impactCard}>
              <div style={styles.impactHeader}>
                <span style={{ fontSize: '28px' }}>{impact.icon}</span>
                <p style={styles.impactLabel}>{impact.label}</p>
              </div>
              <p style={styles.impactValue}>{impact.value}</p>
              <p style={styles.impactUnit}>{impact.unit}</p>
            </div>
          ))}
        </div>

        {/* Middle Row */}
        <div style={styles.midRow}>

          {/* Left Column */}
          <div style={styles.leftCol}>

            {/* Continue Learning */}
            <div style={styles.lessonCard}>
              <div style={styles.lessonInfo}>
                <p style={styles.lessonTag}>Continue Learning</p>
                <h2 style={styles.lessonTitle}>Save Our Oceans</h2>
                <p style={styles.lessonMeta}>Lesson 3 of 6</p>
                <div style={styles.lessonBarBg}>
                  <div style={{ ...styles.lessonBarFill, width: '60%' }} />
                  <span style={styles.lessonPct}>60%</span>
                </div>
                <button style={styles.lessonBtn} onClick={() => navigate('/lessons')}>
                  Continue Lesson →
                </button>
              </div>
              <div style={styles.lessonIllustration}>
                <span style={{ fontSize: '80px' }}>🐢</span>
              </div>
            </div>

            {/* Weekly Goals */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>This Week's Goals</h3>
                <span style={styles.viewAll} onClick={() => navigate('/missions')}>Adjust</span>
              </div>
              <div style={styles.goalsContainer}>
                {weeklyGoals.map((goal, i) => (
                  <div key={i} style={styles.goalItem}>
                    <div style={styles.goalLeft}>
                      <span style={{ fontSize: '20px' }}>{goal.icon}</span>
                      <p style={styles.goalText}>{goal.goal}</p>
                    </div>
                    <div style={styles.goalRight}>
                      <div style={styles.goalBarBg}>
                        <div style={{ ...styles.goalBarFill, width: `${(goal.current / goal.target) * 100}%` }} />
                      </div>
                      <p style={styles.goalProgress}>{goal.current}/{goal.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Missions */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Today's Missions</h3>
                <span style={styles.viewAll} onClick={() => navigate('/missions')}>View all</span>
              </div>
              <div style={styles.missionsRow}>
                {missions.map((m, i) => (
                  <div key={i} style={{ ...styles.missionCard, background: m.bg }}>
                    <span style={{ fontSize: '28px' }}>{m.icon}</span>
                    <p style={styles.missionTitle}>{m.title}</p>
                    <div style={styles.missionCoins}>
                      <span>🪙</span>
                      <span>+{m.coins}</span>
                    </div>
                    <div style={styles.missionFooter}>
                      <p style={styles.missionProgress}>0/1</p>
                      <div style={{ ...styles.missionBtn, background: m.done ? '#1D9E75' : '#EF9F27' }}>
                        {m.done ? '✓' : '→'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Your Achievements</h3>
                <span style={styles.viewAll}>View all (12)</span>
              </div>
              <div style={styles.achievementsGrid}>
                {achievements.map((achievement, i) => (
                  <div key={i} style={{ ...styles.achievementItem, opacity: achievement.earned ? 1 : 0.5 }}>
                    <div style={{ ...styles.achievementBadge, background: achievement.earned ? '#FFF4E6' : '#F0F0F0' }}>
                      <span style={{ fontSize: '28px' }}>{achievement.icon}</span>
                    </div>
                    <p style={styles.achievementTitle}>{achievement.title}</p>
                    <p style={styles.achievementDesc}>{achievement.desc}</p>
                    {achievement.earned && <div style={styles.earnedBadge}>✓ Earned</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Recent Activity</h3>
                <span style={styles.viewAll}>View all</span>
              </div>
              <div style={styles.activityTimeline}>
                {recentActivity.map((activity, i) => (
                  <div key={i} style={styles.activityItem}>
                    <div style={styles.activityIcon}>{activity.icon}</div>
                    <div style={styles.activityContent}>
                      <p style={styles.activityText}><strong>{activity.action}</strong> - {activity.item}</p>
                      <p style={styles.activityTime}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Explore</h3>
              <div style={styles.exploreRow}>
                {exploreItems.map((item, i) => (
                  <div key={i} style={styles.exploreItem}>
                    <div style={{ ...styles.exploreIcon, background: item.bg }}>
                      <span style={{ fontSize: '24px' }}>{item.icon}</span>
                    </div>
                    <p style={styles.exploreLabel}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div style={styles.rightCol}>

            {/* Eco Garden */}
            <div style={styles.gardenCard}>
              <div style={styles.gardenHeader}>
                <h3 style={styles.cardTitle}>Your Eco Garden 🌿</h3>
                <span style={styles.gardenBadge}>Level 1 Garden</span>
              </div>
              <div style={styles.gardenVisual} onClick={() => navigate('/garden')}>
                <span style={{ fontSize: '80px' }}>🌳</span>
                <span style={{ fontSize: '40px' }}>🌸</span>
                <span style={{ fontSize: '32px' }}>🦋</span>
              </div>
              <div style={styles.gardenFooter}>
                <div style={styles.gardenBarRow}>
                  <span style={{ fontSize: '14px' }}>💧</span>
                  <div style={styles.gardenBarBg}>
                    <div style={{ ...styles.gardenBarFill, width: '10%' }} />
                  </div>
                  <span style={styles.gardenPts}>0 / 200</span>
                </div>
                <p style={styles.gardenHint}>Water your garden to grow more!</p>
                <div style={styles.gardenStats}>
                  <div style={styles.gardenStat}>
                    <p style={styles.gardenStatLabel}>Plants</p>
                    <p style={styles.gardenStatValue}>3</p>
                  </div>
                  <div style={styles.gardenStat}>
                    <p style={styles.gardenStatLabel}>Visits</p>
                    <p style={styles.gardenStatValue}>12</p>
                  </div>
                  <div style={styles.gardenStat}>
                    <p style={styles.gardenStatLabel}>Next Reward</p>
                    <p style={styles.gardenStatValue}>50 XP</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Eco Guide */}
            <div style={styles.aiCard}>
              <div style={styles.aiHeader}>
                <h3 style={styles.cardTitle}>AI Eco Guide</h3>
                <span style={{ fontSize: '40px' }}>🤖</span>
              </div>
              <div style={styles.aiChat}>
                <p style={styles.aiMsg}>
                  Hi {userData?.name?.split(' ')[0] || 'there'}! 🌟<br />
                  Want a fun fact about bamboo today?
                </p>
              </div>
              <button style={styles.aiBtn}>Ask me!</button>
              <div style={styles.aiStats}>
                <p style={styles.aiStat}>📚 15 facts learned</p>
                <p style={styles.aiStat}>💬 Chat Streak: 5 days</p>
              </div>
            </div>

            {/* Earth Day Challenge */}
            <div style={styles.challengeCard}>
              <div style={styles.challengeInfo}>
                <h3 style={styles.challengeTitle}>Earth Day Challenge 🌍</h3>
                <p style={styles.challengeDesc}>Complete missions and win exclusive badges!</p>
                <div style={styles.challengeProgress}>
                  <p style={styles.progressLabel}>Progress: 5/10</p>
                  <div style={styles.challengeBar}>
                    <div style={{ ...styles.challengeBarFill, width: '50%' }} />
                  </div>
                </div>
                <button style={styles.challengeBtn}>Join Now</button>
              </div>
              <span style={{ fontSize: '60px' }}>👦</span>
            </div>

            {/* Leaderboard Preview */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Leaderboard Preview</h3>
                <span style={styles.viewAll} onClick={() => navigate('/leaderboard')}>See all</span>
              </div>
              <div style={styles.leaderboardPreview}>
                {[
                  { rank: '🥇', name: 'Alex Chen', points: '2,450 pts' },
                  { rank: '🥈', name: 'You', points: '1,850 pts' },
                  { rank: '🥉', name: 'Jordan Kim', points: '1,720 pts' },
                ].map((entry, i) => (
                  <div key={i} style={styles.leaderboardEntry}>
                    <span style={{ fontSize: '20px' }}>{entry.rank}</span>
                    <p style={styles.leaderboardName}>{entry.name}</p>
                    <p style={styles.leaderboardPoints}>{entry.points}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f7fa', fontFamily: 'Poppins, sans-serif' },
  loadingPage: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', fontFamily: 'Poppins, sans-serif' },

  // Sidebar
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
  sidebarBottom: { padding: '20px', borderTop: '1px solid #e0ede8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  sidebarEarth: { opacity: 0.8 },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#888780', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0ede8', width: '100%', justifyContent: 'center' },

  // Main
  main: { flex: 1, padding: '24px', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  greeting: { fontSize: '22px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 4px' },
  greetingSub: { fontSize: '13px', color: '#888780', margin: 0 },
  topBarRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e0ede8', borderRadius: '10px', padding: '8px 14px', width: '260px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '13px', color: '#2C2C2A', background: 'transparent', width: '100%' },
  notifBtn: { fontSize: '22px', cursor: 'pointer' },
  avatarCircle: { width: '38px', height: '38px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600', color: '#27500A', cursor: 'pointer' },

  // Stats
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' },
  statCard: { background: '#fff', borderRadius: '14px', border: '1px solid #e0ede8', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' },
  statLeft: { display: 'flex', alignItems: 'center', gap: '12px', flex: 1 },
  statLabel: { fontSize: '12px', color: '#888780', margin: '0 0 2px' },
  statValue: { fontSize: '26px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 2px' },
  statSub: { fontSize: '11px', color: '#888780', margin: 0 },
  xpBarWrap: { width: '100%' },
  xpBarBg: { background: '#e0ede8', borderRadius: '99px', height: '6px', marginBottom: '4px' },
  xpBarFill: { background: '#378ADD', borderRadius: '99px', height: '6px' },
  xpText: { fontSize: '11px', color: '#888780', margin: 0, textAlign: 'right' },

  // Impact Grid
  impactGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' },
  impactCard: { background: '#fff', borderRadius: '14px', border: '1px solid #e0ede8', padding: '14px', textAlign: 'center' },
  impactHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '8px' },
  impactLabel: { fontSize: '12px', color: '#888780', margin: 0, fontWeight: '500' },
  impactValue: { fontSize: '22px', fontWeight: '700', color: '#2C2C2A', margin: 0 },
  impactUnit: { fontSize: '11px', color: '#888780', margin: 0 },

  // Mid Row
  midRow: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '16px' },

  // Lesson Card
  lessonCard: { background: '#1D5C3A', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' },
  lessonInfo: { flex: 1 },
  lessonTag: { fontSize: '12px', color: '#9FE1CB', margin: '0 0 6px', fontWeight: '500' },
  lessonTitle: { fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 6px' },
  lessonMeta: { fontSize: '13px', color: '#9FE1CB', margin: '0 0 10px' },
  lessonBarBg: { background: 'rgba(255,255,255,0.2)', borderRadius: '99px', height: '8px', marginBottom: '16px', position: 'relative' },
  lessonBarFill: { background: '#1D9E75', borderRadius: '99px', height: '8px' },
  lessonPct: { position: 'absolute', right: 0, top: '-18px', fontSize: '11px', color: '#9FE1CB' },
  lessonBtn: { background: '#fff', color: '#1D5C3A', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  lessonIllustration: { fontSize: '80px', marginLeft: '20px' },

  // Cards
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e0ede8', padding: '16px 20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  viewAll: { fontSize: '13px', color: '#1D9E75', cursor: 'pointer', fontWeight: '500' },

  // Goals
  goalsContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  goalItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#f9fbfa', borderRadius: '10px' },
  goalLeft: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
  goalText: { fontSize: '13px', color: '#2C2C2A', margin: 0, fontWeight: '500' },
  goalRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' },
  goalBarBg: { width: '80px', height: '4px', background: '#e0ede8', borderRadius: '99px' },
  goalBarFill: { height: '4px', background: '#1D9E75', borderRadius: '99px' },
  goalProgress: { fontSize: '11px', color: '#888780', margin: 0 },

  // Missions
  missionsRow: { display: 'flex', gap: '12px' },
  missionCard: { flex: 1, borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' },
  missionTitle: { fontSize: '12px', fontWeight: '500', color: '#2C2C2A', margin: 0 },
  missionCoins: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#854F0B' },
  missionFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' },
  missionProgress: { fontSize: '12px', color: '#888780', margin: 0 },
  missionBtn: { width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700' },

  // Achievements
  achievementsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  achievementItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' },
  achievementBadge: { width: '56px', height: '56px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  achievementTitle: { fontSize: '11px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  achievementDesc: { fontSize: '10px', color: '#888780', margin: 0 },
  earnedBadge: { fontSize: '9px', color: '#1D9E75', fontWeight: '600' },

  // Activity Timeline
  activityTimeline: { display: 'flex', flexDirection: 'column', gap: '10px' },
  activityItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px', background: '#f9fbfa', borderRadius: '10px' },
  activityIcon: { fontSize: '18px', flexShrink: 0 },
  activityContent: { flex: 1, minWidth: 0 },
  activityText: { fontSize: '12px', color: '#2C2C2A', margin: 0 },
  activityTime: { fontSize: '11px', color: '#888780', margin: '2px 0 0' },

  // Explore
  exploreRow: { display: 'flex', gap: '16px', marginTop: '12px' },
  exploreItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' },
  exploreIcon: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  exploreLabel: { fontSize: '12px', color: '#5F5E5A', margin: 0, textAlign: 'center' },

  // Garden
  gardenCard: { background: '#EAF3DE', borderRadius: '16px', border: '1px solid #C0DD97', padding: '16px' },
  gardenHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  gardenBadge: { background: '#1D9E75', color: '#fff', fontSize: '11px', padding: '3px 10px', borderRadius: '99px', fontWeight: '500' },
  gardenVisual: { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '8px', padding: '12px 0', cursor: 'pointer' },
  gardenFooter: { borderTop: '1px solid #C0DD97', paddingTop: '12px' },
  gardenBarRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  gardenBarBg: { flex: 1, background: '#C0DD97', borderRadius: '99px', height: '6px' },
  gardenBarFill: { background: '#1D9E75', borderRadius: '99px', height: '6px' },
  gardenPts: { fontSize: '12px', color: '#3B6D11', fontWeight: '500' },
  gardenHint: { fontSize: '12px', color: '#3B6D11', margin: '0 0 10px' },
  gardenStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
  gardenStat: { padding: '8px', background: '#FFFFFF', borderRadius: '8px', textAlign: 'center' },
  gardenStatLabel: { fontSize: '10px', color: '#888780', margin: 0 },
  gardenStatValue: { fontSize: '14px', fontWeight: '700', color: '#1D9E75', margin: 0 },

  // AI Card
  aiCard: { background: '#F0EDFF', borderRadius: '16px', border: '1px solid #CEC8F5', padding: '16px' },
  aiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  aiChat: { background: '#fff', borderRadius: '10px', padding: '12px', marginBottom: '12px' },
  aiMsg: { fontSize: '13px', color: '#2C2C2A', margin: 0, lineHeight: 1.6 },
  aiBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  aiStats: { display: 'flex', flexDirection: 'column', gap: '4px' },
  aiStat: { fontSize: '11px', color: '#888780', margin: 0 },

  // Challenge
  challengeCard: { background: '#1D5C3A', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  challengeInfo: { flex: 1 },
  challengeTitle: { fontSize: '15px', fontWeight: '700', color: '#fff', margin: '0 0 6px' },
  challengeDesc: { fontSize: '12px', color: '#9FE1CB', margin: '0 0 10px', lineHeight: 1.5 },
  challengeProgress: { marginBottom: '10px' },
  progressLabel: { fontSize: '11px', color: '#9FE1CB', margin: '0 0 4px' },
  challengeBar: { background: 'rgba(255,255,255,0.2)', height: '4px', borderRadius: '99px' },
  challengeBarFill: { background: '#1D9E75', height: '4px', borderRadius: '99px' },
  challengeBtn: { background: '#fff', color: '#1D5C3A', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },

  // Leaderboard
  leaderboardPreview: { display: 'flex', flexDirection: 'column', gap: '10px' },
  leaderboardEntry: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f9fbfa', borderRadius: '10px' },
  leaderboardName: { flex: 1, fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  leaderboardPoints: { fontSize: '12px', color: '#1D9E75', fontWeight: '700', margin: 0 },
}

export default Dashboard
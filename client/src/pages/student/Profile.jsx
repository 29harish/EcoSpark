import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserFromDB } from '../../services/authService'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [formData, setFormData] = useState({ name: '', bio: '' })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserFromDB(user.uid)
        setUserData(data.user)
        setFormData({ name: data.user?.name || '', bio: data.user?.bio || '' })
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

  const handleSaveProfile = () => {
    setEditMode(false)
  }

  if (loading) return (
    <div style={styles.loadingPage}>
      <span style={{ fontSize: '48px' }}>🌱</span>
      <p style={{ fontFamily: 'Poppins, sans-serif', color: '#888780' }}>Loading profile...</p>
    </div>
  )

  const achievements = [
    { icon: '🌱', title: 'Eco Starter', desc: 'Complete 5 lessons', earned: true },
    { icon: '♻️', title: 'Recycler Pro', desc: 'Recycle 50 items', earned: true },
    { icon: '🌍', title: 'Planet Guardian', desc: 'Reach Level 5', earned: false },
    { icon: '⚡', title: 'Eco Champion', desc: 'Win 10 challenges', earned: true },
    { icon: '🏆', title: 'Top Scorer', desc: 'Score 100% on quiz', earned: false },
    { icon: '🌳', title: 'Forest Guardian', desc: 'Plant 50 trees', earned: false },
  ]

  const activityStats = [
    { label: 'Lessons Completed', value: 12, icon: '📚' },
    { label: 'Quizzes Taken', value: 8, icon: '✏️' },
    { label: 'Challenges Won', value: 5, icon: '🎯' },
    { label: 'Missions Completed', value: 24, icon: '🎪' },
  ]

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
              style={item.path === '/profile' ? styles.navItemActive : styles.navItem}
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

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>My Profile</h1>
          <button style={styles.editBtn} onClick={() => setEditMode(!editMode)}>
            {editMode ? '✕ Cancel' : '✏️ Edit Profile'}
          </button>
        </div>

        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.profileLeft}>
            <div style={styles.avatarLarge}>
              {(userData?.name || user?.displayName || 'E')[0].toUpperCase()}
            </div>
            {editMode && (
              <div style={styles.avatarUpload}>
                <input type="file" style={styles.fileInput} accept="image/*" />
                <p style={styles.uploadHint}>Upload Avatar</p>
              </div>
            )}
          </div>

          <div style={styles.profileRight}>
            {editMode ? (
              <div style={styles.editForm}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    style={{ ...styles.input, opacity: 0.6 }}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    style={styles.textarea}
                    placeholder="Tell us about yourself!"
                  />
                </div>
                <button style={styles.saveBtn} onClick={handleSaveProfile}>
                  💾 Save Changes
                </button>
              </div>
            ) : (
              <>
                <h2 style={styles.nameTitle}>{userData?.name || user?.displayName || 'Eco Hero'}</h2>
                <p style={styles.email}>{userData?.email || user?.email}</p>
                <p style={styles.bio}>{userData?.bio || 'Add a bio to your profile!'}</p>
                <p style={styles.memberSince}>Member since {new Date().toLocaleDateString()}</p>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={styles.tabNav}>
          {['overview', 'achievements', 'activity', 'settings'].map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tabBtn,
                ...(activeTab === tab ? styles.tabBtnActive : {})
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={styles.content}>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <span style={{ fontSize: '36px' }}>⭐</span>
                <p style={styles.statLabel}>Level</p>
                <p style={styles.statValue}>{userData?.level || 1}</p>
              </div>
              <div style={styles.statCard}>
                <span style={{ fontSize: '36px' }}>💵🪙</span>
                <p style={styles.statLabel}>Eco Coins</p>
                <p style={styles.statValue}>{userData?.ecoins || 0}</p>
              </div>
              <div style={styles.statCard}>
                <span style={{ fontSize: '36px' }}>🔥</span>
                <p style={styles.statLabel}>Streak</p>
                <p style={styles.statValue}>{userData?.streak || 0} days</p>
              </div>
              <div style={styles.statCard}>
                <span style={{ fontSize: '36px' }}>🌳</span>
                <p style={styles.statLabel}>Trees Planted</p>
                <p style={styles.statValue}>{userData?.treesPlanted || 0}</p>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Level Progress</h3>
              <div style={styles.progressSection}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: '45%' }} />
                </div>
                <p style={styles.progressText}>450 / 1000 XP to next level</p>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Environmental Impact</h3>
              <div style={styles.impactGrid}>
                <div style={styles.impactItem}>
                  <p style={styles.impactLabel}>CO₂ Saved</p>
                  <p style={styles.impactValue}>2.4 kg</p>
                </div>
                <div style={styles.impactItem}>
                  <p style={styles.impactLabel}>Waste Reduced</p>
                  <p style={styles.impactValue}>15 kg</p>
                </div>
                <div style={styles.impactItem}>
                  <p style={styles.impactLabel}>Water Saved</p>
                  <p style={styles.impactValue}>500 L</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div style={styles.content}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Badges & Achievements</h3>
              <div style={styles.achievementsGrid}>
                {achievements.map((achievement, i) => (
                  <div key={i} style={{ ...styles.achievementCard, opacity: achievement.earned ? 1 : 0.4 }}>
                    <div style={{ ...styles.achievementBadge, background: achievement.earned ? '#FFF4E6' : '#F0F0F0' }}>
                      <span style={{ fontSize: '32px' }}>{achievement.icon}</span>
                    </div>
                    <p style={styles.achievementTitle}>{achievement.title}</p>
                    <p style={styles.achievementDesc}>{achievement.desc}</p>
                    {achievement.earned && (
                      <div style={styles.earnedLabel}>✓ Earned</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Achievement Progress</h3>
              <p style={styles.progressCounter}>3 of 6 achievements unlocked (50%)</p>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div style={styles.content}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Activity Stats</h3>
              <div style={styles.activityStatsGrid}>
                {activityStats.map((stat, i) => (
                  <div key={i} style={styles.activityStat}>
                    <span style={{ fontSize: '28px' }}>{stat.icon}</span>
                    <p style={styles.statCount}>{stat.value}</p>
                    <p style={styles.statName}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Recent Activity</h3>
              <div style={styles.activityList}>
                {[
                  { action: 'Completed lesson', item: 'Ocean Conservation', date: 'Today' },
                  { action: 'Won challenge', item: 'Plastic Challenge', date: 'Yesterday' },
                  { action: 'Planted tree', item: '1 virtual tree', date: '2 days ago' },
                  { action: 'Completed quiz', item: '100% score!', date: '3 days ago' },
                ].map((activity, i) => (
                  <div key={i} style={styles.activityListItem}>
                    <div style={styles.activityDot} />
                    <div>
                      <p style={styles.activityAction}>{activity.action}</p>
                      <p style={styles.activitySubtext}>{activity.item} · {activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div style={styles.content}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Account Settings</h3>
              <div style={styles.settingItem}>
                <div>
                  <p style={styles.settingLabel}>Email Notifications</p>
                  <p style={styles.settingDesc}>Receive updates about challenges and milestones</p>
                </div>
                <input type="checkbox" defaultChecked style={styles.checkbox} />
              </div>
              <div style={styles.settingItem}>
                <div>
                  <p style={styles.settingLabel}>Daily Reminders</p>
                  <p style={styles.settingDesc}>Get reminded to complete your daily missions</p>
                </div>
                <input type="checkbox" defaultChecked style={styles.checkbox} />
              </div>
              <div style={styles.settingItem}>
                <div>
                  <p style={styles.settingLabel}>Public Profile</p>
                  <p style={styles.settingDesc}>Allow others to see your profile and achievements</p>
                </div>
                <input type="checkbox" defaultChecked style={styles.checkbox} />
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Security</h3>
              <button style={styles.changePasswordBtn}>
                🔐 Change Password
              </button>
              <button style={styles.signOutBtn}>
                📱 Sign Out of All Devices
              </button>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Danger Zone</h3>
              <button style={styles.deleteBtn}>
                🗑️ Delete Account
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f7fa', fontFamily: 'Poppins, sans-serif' },
  loadingPage: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' },

  // Sidebar
  sidebar: { width: '220px', minWidth: '220px', background: '#fff', borderRight: '1px solid #e0ede8', display: 'flex', flexDirection: 'column', padding: '20px 0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px 20px', borderBottom: '1px solid #e0ede8' },
  logoText: { fontSize: '18px', fontWeight: '700', color: '#1D9E75', margin: 0 },
  logoSub: { fontSize: '10px', color: '#888780', margin: 0 },
  navList: { flex: 1, padding: '12px 0' },
  navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', cursor: 'pointer', color: '#5F5E5A', fontSize: '14px', margin: '2px 8px', borderRadius: '8px' },
  navItemActive: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', cursor: 'pointer', background: '#1D9E75', color: '#fff', fontSize: '14px', fontWeight: '500', margin: '2px 8px', borderRadius: '8px' },
  navIcon: { fontSize: '18px' },
  navLabel: { flex: 1 },
  newBadge: { background: '#E24B4A', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '99px', fontWeight: '600' },
  sidebarBottom: { padding: '20px', borderTop: '1px solid #e0ede8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  sidebarEarth: { opacity: 0.8 },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#888780', fontSize: '14px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0ede8', width: '100%', justifyContent: 'center' },

  // Main
  main: { flex: 1, padding: '24px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#2C2C2A', margin: 0 },
  editBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },

  // Profile Card
  profileCard: { background: '#fff', borderRadius: '16px', border: '1px solid #e0ede8', padding: '24px', display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '24px' },
  profileLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  avatarLarge: { width: '120px', height: '120px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '600', color: '#27500A' },
  avatarUpload: { textAlign: 'center' },
  fileInput: { display: 'none' },
  uploadHint: { fontSize: '12px', color: '#888780', margin: 0 },
  profileRight: { flex: 1 },
  nameTitle: { fontSize: '24px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 6px' },
  email: { fontSize: '13px', color: '#888780', margin: '0 0 8px' },
  bio: { fontSize: '13px', color: '#5F5E5A', margin: '0 0 16px', lineHeight: 1.6 },
  memberSince: { fontSize: '12px', color: '#888780', margin: 0 },

  // Edit Form
  editForm: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#2C2C2A' },
  input: { border: '1px solid #e0ede8', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#2C2C2A', fontFamily: 'Poppins, sans-serif' },
  textarea: { border: '1px solid #e0ede8', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: '#2C2C2A', fontFamily: 'Poppins, sans-serif', minHeight: '80px', resize: 'vertical' },
  saveBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' },

  // Tab Navigation
  tabNav: { display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #e0ede8', paddingBottom: '12px' },
  tabBtn: { background: 'none', border: 'none', color: '#888780', fontSize: '14px', fontWeight: '500', padding: '8px 16px', cursor: 'pointer', borderBottom: '3px solid transparent', marginBottom: '-14px' },
  tabBtnActive: { color: '#1D9E75', borderBottomColor: '#1D9E75' },

  // Content
  content: { display: 'flex', flexDirection: 'column', gap: '24px' },

  // Cards
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e0ede8', padding: '20px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 16px' },

  // Stats
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
  statCard: { background: '#fff', borderRadius: '12px', border: '1px solid #e0ede8', padding: '16px', textAlign: 'center' },
  statLabel: { fontSize: '12px', color: '#888780', margin: '8px 0 4px' },
  statValue: { fontSize: '24px', fontWeight: '700', color: '#2C2C2A', margin: 0 },

  // Progress
  progressSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  progressBar: { background: '#e0ede8', height: '8px', borderRadius: '99px', overflow: 'hidden' },
  progressFill: { background: '#1D9E75', height: '8px', borderRadius: '99px' },
  progressText: { fontSize: '12px', color: '#888780', margin: 0 },
  progressCounter: { fontSize: '13px', color: '#888780', margin: 0 },

  // Impact
  impactGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  impactItem: { padding: '12px', background: '#f9fbfa', borderRadius: '10px', textAlign: 'center' },
  impactLabel: { fontSize: '12px', color: '#888780', margin: '0 0 4px' },
  impactValue: { fontSize: '18px', fontWeight: '700', color: '#1D9E75', margin: 0 },

  // Achievements
  achievementsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  achievementCard: { padding: '14px', background: '#f9fbfa', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  achievementBadge: { width: '64px', height: '64px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  achievementTitle: { fontSize: '12px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  achievementDesc: { fontSize: '11px', color: '#888780', margin: 0 },
  earnedLabel: { fontSize: '10px', color: '#1D9E75', fontWeight: '600' },

  // Activity
  activityStatsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
  activityStat: { padding: '16px', background: '#f9fbfa', borderRadius: '10px', textAlign: 'center' },
  statCount: { fontSize: '22px', fontWeight: '700', color: '#1D9E75', margin: '8px 0 4px' },
  statName: { fontSize: '12px', color: '#888780', margin: 0 },
  activityList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  activityListItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', background: '#f9fbfa', borderRadius: '10px' },
  activityDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75', marginTop: '6px', flexShrink: 0 },
  activityAction: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  activitySubtext: { fontSize: '12px', color: '#888780', margin: '4px 0 0' },

  // Settings
  settingItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #e0ede8' },
  settingLabel: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  settingDesc: { fontSize: '12px', color: '#888780', margin: '4px 0 0' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  changePasswordBtn: { width: '100%', background: '#378ADD', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '10px' },
  signOutBtn: { width: '100%', background: '#EF9F27', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginBottom: '10px' },
  deleteBtn: { width: '100%', background: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
}

export default Profile

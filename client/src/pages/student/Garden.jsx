import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchGarden, waterGarden, cleanGarden } from '../../services/gardenService'

const stageData = {
  seedling: { emoji: '🌱', label: 'Seedling', desc: 'Your journey begins!', nextAt: 25 },
  sprout: { emoji: '🌿', label: 'Sprout', desc: 'Growing nicely!', nextAt: 75 },
  sapling: { emoji: '🪴', label: 'Sapling', desc: 'Getting stronger!', nextAt: 150 },
  tree: { emoji: '🌳', label: 'Tree', desc: 'Standing tall!', nextAt: 300 },
  forest: { emoji: '🌲', label: 'Forest', desc: 'A mini forest!', nextAt: 500 },
  'earth-guardian': { emoji: '🌍', label: 'Earth Guardian', desc: 'You are a legend!', nextAt: null },
}

const Garden = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [garden, setGarden] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState(null)
  const [doing, setDoing] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGarden(user.uid)
        setGarden(data.garden)
        setUserData(data.user)
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
    if (user) load()
  }, [user])

  const showMsg = (msg) => {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(null), 3000)
  }

  const handleWater = async () => {
    setDoing('water')
    try {
      const data = await waterGarden(user.uid)
      setGarden(data.garden)
      showMsg({ text: `Watered! +${data.pointsEarned} points, +${data.ecoinsEarned} Ecoins 💧`, type: 'success' })
    } catch (err) {
      showMsg({ text: err.response?.data?.error || 'Already watered recently!', type: 'error' })
    }
    setDoing(null)
  }

  const handleClean = async () => {
    setDoing('clean')
    try {
      const data = await cleanGarden(user.uid)
      setGarden(data.garden)
      showMsg({ text: `Garden cleaned! +${data.pointsEarned} points, +${data.ecoinsEarned} Ecoins 🌿`, type: 'success' })
    } catch (err) {
      showMsg({ text: 'Error cleaning garden', type: 'error' })
    }
    setDoing(null)
  }

  const navItems = [
    { icon: '🏠', label: 'Home', path: '/dashboard' },
    { icon: '📚', label: 'Learn', path: '/lessons' },
    { icon: '🎯', label: 'Missions', path: '/missions' },
    { icon: '📝', label: 'Quizzes', path: '/quiz' },
    { icon: '🌱', label: 'Eco Garden', path: '/garden' },
    { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
    { icon: '⚡', label: 'Challenges', path: '/challenges', badge: 'NEW' },
    { icon: '🤖', label: 'AI Eco Guide', path: '/ai-guide' },
    { icon: '🎁', label: 'Rewards', path: '/rewards' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ]

  if (loading) return (
    <div style={styles.center}>
      <span style={{ fontSize: '48px' }}>🌱</span>
      <p style={{ fontFamily: 'Poppins, sans-serif', color: '#888780' }}>Growing your garden...</p>
    </div>
  )

  const stage = stageData[garden?.stage || 'seedling']
  const nextAt = stage.nextAt
  const progress = nextAt ? Math.min((garden?.totalPoints / nextAt) * 100, 100) : 100
  const pointsToNext = nextAt ? nextAt - garden?.totalPoints : 0

  const actions = [
    { key: 'water', icon: '💧', label: 'Water Plants', points: '+10', ecoins: '+5', color: '#D5EEF5', textColor: '#185FA5' },
    { key: 'clean', icon: '🧹', label: 'Clean Garden', points: '+15', ecoins: '+8', color: '#EAF3DE', textColor: '#27500A' },
    { key: 'plant', icon: '🌱', label: 'Plant Tree', points: '+20', ecoins: '+10', color: '#EAF3DE', textColor: '#27500A' },
    { key: 'decorate', icon: '🌸', label: 'Decorate', points: '+5', ecoins: '+3', color: '#F5E6D5', textColor: '#633806' },
  ]

  const collectibles = [
    { icon: '🦌', name: 'Happy Deer', unlocked: garden?.totalPoints >= 50 },
    { icon: '☁️', name: 'Cloud Rider', unlocked: garden?.totalPoints >= 100 },
    { icon: '💡', name: 'Sunshine Lamp', unlocked: garden?.totalPoints >= 150 },
    { icon: '🌈', name: 'Rainbow Fountain', unlocked: garden?.totalPoints >= 200, rare: true },
    { icon: '🦉', name: 'Owl Friend', unlocked: garden?.totalPoints >= 300, rare: true },
    { icon: '💎', name: 'Crystal Rock', unlocked: garden?.totalPoints >= 500, legendary: true },
  ]

  const stages = ['seedling', 'sprout', 'sapling', 'tree', 'forest', 'earth-guardian']

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
              style={item.path === '/garden' ? styles.navItemActive : styles.navItem}
              onClick={() => navigate(item.path)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
              {item.badge && <span style={styles.newBadge}>{item.badge}</span>}
            </div>
          ))}
        </div>
        <div style={styles.logoutBtn} onClick={() => navigate('/login')}>
          <span>🚪</span><span>Logout</span>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>

        {/* Top Bar */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>My Eco Garden 🌿</h1>
            <p style={styles.subtitle}>Your actions today, a greener tomorrow!</p>
          </div>
          <div style={styles.topStats}>
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
              <span style={styles.pillVal}>{garden?.waterPoints || 0}</span>
            </div>
          </div>
        </div>

        {/* Toast */}
        {actionMsg && (
          <div style={{
            ...styles.toast,
            background: actionMsg.type === 'success' ? '#EAF3DE' : '#FCEBEB',
            border: `1px solid ${actionMsg.type === 'success' ? '#C0DD97' : '#F09595'}`,
            color: actionMsg.type === 'success' ? '#27500A' : '#A32D2D',
          }}>
            {actionMsg.type === 'success' ? '🎉' : '⚠️'} {actionMsg.text}
          </div>
        )}

        <div style={styles.contentRow}>

          {/* Left — Garden Visual */}
          <div style={styles.leftCol}>

            {/* Garden Health */}
            <div style={styles.healthRow}>
              <span style={styles.healthIcon}>✅</span>
              <div style={styles.healthInfo}>
                <p style={styles.healthLabel}>Garden Health</p>
                <div style={styles.healthBarBg}>
                  <div style={{ ...styles.healthBarFill, width: `${garden?.health || 100}%` }} />
                </div>
              </div>
              <span style={styles.healthVal}>{garden?.health || 100}%</span>
              <p style={styles.healthMsg}>Great job! Keep going!</p>
            </div>

            {/* Garden Scene */}
            <div style={styles.gardenScene}>
              <div style={styles.gardenSky}>
                <span style={styles.sunEmoji}>☀️</span>
                <span style={styles.butterflyEmoji}>🦋</span>
              </div>
              <div style={styles.gardenGround}>
                <span style={{ fontSize: '80px' }}>{stage.emoji}</span>
                {garden?.totalPoints >= 50 && <span style={{ fontSize: '40px' }}>🌸</span>}
                {garden?.totalPoints >= 100 && <span style={{ fontSize: '32px' }}>🦋</span>}
                {garden?.totalPoints >= 150 && <span style={{ fontSize: '36px' }}>🌺</span>}
                {garden?.totalPoints >= 200 && <span style={{ fontSize: '28px' }}>🐝</span>}
              </div>
              <div style={styles.gardenMsg}>
                <p style={styles.gardenMsgText}>Keep going! You're doing amazing! 🌟</p>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actionsRow}>
              {actions.map(action => (
                <button
                  key={action.key}
                  style={{ ...styles.actionBtn, background: action.color, color: action.textColor }}
                  onClick={action.key === 'water' ? handleWater : action.key === 'clean' ? handleClean : () => {}}
                  disabled={doing === action.key}
                >
                  <span style={{ fontSize: '20px' }}>{action.icon}</span>
                  <span style={styles.actionLabel}>{action.label}</span>
                  <span style={styles.actionPoints}>{action.points}</span>
                  <div style={styles.actionCoins}>
                    <span style={{ fontSize: '10px' }}>🪙</span>
                    <span style={{ fontSize: '10px' }}>{action.ecoins}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Garden Gallery */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Garden Gallery</h3>
                <span style={styles.viewAll}>View All</span>
              </div>
              <p style={styles.galleryDesc}>Collect and unlock amazing items for your garden!</p>
              <div style={styles.galleryRow}>
                {collectibles.map((item, i) => (
                  <div key={i} style={{ ...styles.collectible, opacity: item.unlocked ? 1 : 0.4 }}>
                    <div style={{
                      ...styles.collectibleIcon,
                      background: item.legendary ? '#FFF3D6' : item.rare ? '#F0EDFF' : '#EAF3DE',
                      border: item.legendary ? '2px solid #EF9F27' : item.rare ? '2px solid #9B8FE8' : '1px solid #e0ede8',
                    }}>
                      <span style={{ fontSize: '28px' }}>{item.icon}</span>
                      {!item.unlocked && <span style={styles.lockIcon}>🔒</span>}
                    </div>
                    <p style={styles.collectibleName}>{item.name}</p>
                    {item.legendary && <span style={styles.legendaryTag}>Legendary</span>}
                    {item.rare && !item.legendary && <span style={styles.rareTag}>Rare</span>}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Panel */}
          <div style={styles.rightCol}>

            {/* Garden Level */}
            <div style={styles.rightCard}>
              <h3 style={styles.rightCardTitle}>Garden Level ℹ️</h3>
              <div style={styles.levelRow}>
                <span style={{ fontSize: '40px' }}>{stage.emoji}</span>
                <div>
                  <p style={styles.levelNum}>Lvl {garden?.level || 1}</p>
                  <p style={styles.levelTitle}>{stage.label}</p>
                </div>
              </div>

              {/* Stage Progress */}
              <div style={styles.stageRow}>
                {stages.map((s, i) => {
                  const currentIdx = stages.indexOf(garden?.stage || 'seedling')
                  return (
                    <div key={s} style={styles.stageItem}>
                      <div style={{
                        ...styles.stageDot,
                        background: i <= currentIdx ? '#1D9E75' : '#e0ede8',
                        fontSize: '14px',
                      }}>
                        {stageData[s].emoji}
                      </div>
                      {i < stages.length - 1 && (
                        <div style={{ ...styles.stageLine, background: i < currentIdx ? '#1D9E75' : '#e0ede8' }} />
                      )}
                    </div>
                  )
                })}
              </div>

              {nextAt && (
                <p style={styles.nextStageText}>
                  You're {pointsToNext} points away from {stageData[stages[stages.indexOf(garden?.stage || 'seedling') + 1]]?.label || 'next stage'}!
                </p>
              )}

              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
              </div>
              <p style={styles.progressText}>{garden?.totalPoints || 0} / {nextAt || '∞'} XP</p>
            </div>

            {/* Today's Impact */}
            <div style={styles.rightCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.rightCardTitle}>Today's Impact 🌿</h3>
              </div>
              <div style={styles.impactGrid}>
                <div style={styles.impactItem}>
                  <span style={{ fontSize: '20px' }}>✅</span>
                  <p style={styles.impactVal}>{userData?.completedMissions?.length || 0}</p>
                  <p style={styles.impactLabel}>Actions Completed</p>
                </div>
                <div style={styles.impactItem}>
                  <span style={{ fontSize: '20px' }}>☁️</span>
                  <p style={styles.impactVal}>0 kg</p>
                  <p style={styles.impactLabel}>CO₂ Saved</p>
                </div>
                <div style={styles.impactItem}>
                  <span style={{ fontSize: '20px' }}>💧</span>
                  <p style={styles.impactVal}>{garden?.waterPoints || 0} L</p>
                  <p style={styles.impactLabel}>Water Saved</p>
                </div>
                <div style={styles.impactItem}>
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  <p style={styles.impactVal}>0 kWh</p>
                  <p style={styles.impactLabel}>Energy Saved</p>
                </div>
              </div>
              <button style={styles.viewImpactBtn}>View All Impact →</button>
            </div>

            {/* Weather */}
            <div style={styles.rightCard}>
              <h3 style={styles.rightCardTitle}>Weather & Time</h3>
              <div style={styles.weatherRow}>
                <span style={{ fontSize: '32px' }}>☀️</span>
                <div>
                  <p style={styles.weatherTitle}>Sunny Day</p>
                  <p style={styles.weatherDesc}>Perfect weather for your plants!</p>
                </div>
                <div style={styles.weatherTime}>
                  <p style={styles.weatherClock}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <p style={styles.weatherDate}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Unlock Special Area */}
            <div style={styles.unlockCard}>
              <div style={styles.unlockInfo}>
                <h3 style={styles.unlockTitle}>Unlock Special Area 🎁</h3>
                <p style={styles.unlockDesc}>Complete {Math.max(0, 8 - (userData?.completedMissions?.length || 0))} more missions to unlock the Mystic Meadow!</p>
                <div style={styles.unlockBarBg}>
                  <div style={{ ...styles.unlockBarFill, width: `${Math.min(((userData?.completedMissions?.length || 0) / 8) * 100, 100)}%` }} />
                </div>
                <p style={styles.unlockProgress}>{Math.min(userData?.completedMissions?.length || 0, 8)} / 8 missions</p>
              </div>
              <span style={{ fontSize: '40px' }}>🎁</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f5f7fa', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', fontFamily: 'Poppins, sans-serif' },
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
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 4px' },
  subtitle: { fontSize: '13px', color: '#888780', margin: 0 },
  topStats: { display: 'flex', gap: '8px' },
  statPill: { display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e0ede8', borderRadius: '10px', padding: '8px 14px', fontSize: '14px' },
  pillVal: { fontWeight: '600', color: '#2C2C2A' },
  toast: { borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', fontWeight: '500' },
  contentRow: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  healthRow: { background: '#fff', borderRadius: '14px', border: '1px solid #e0ede8', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' },
  healthIcon: { fontSize: '20px' },
  healthInfo: { flex: 1 },
  healthLabel: { fontSize: '12px', color: '#888780', margin: '0 0 4px', fontWeight: '500' },
  healthBarBg: { background: '#e0ede8', borderRadius: '99px', height: '8px' },
  healthBarFill: { background: '#1D9E75', borderRadius: '99px', height: '8px' },
  healthVal: { fontSize: '16px', fontWeight: '700', color: '#1D9E75' },
  healthMsg: { fontSize: '12px', color: '#888780', margin: 0 },
  gardenScene: { background: 'linear-gradient(180deg, #87CEEB 0%, #EAF3DE 60%, #C8E6C9 100%)', borderRadius: '20px', padding: '24px', minHeight: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  gardenSky: { position: 'absolute', top: '16px', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 24px' },
  sunEmoji: { fontSize: '32px' },
  butterflyEmoji: { fontSize: '24px' },
  gardenGround: { display: 'flex', alignItems: 'flex-end', gap: '12px', zIndex: 1 },
  gardenMsg: { position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', borderRadius: '10px', padding: '8px 12px' },
  gardenMsgText: { fontSize: '12px', color: '#27500A', margin: 0, fontWeight: '500' },
  actionsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  actionBtn: { borderRadius: '12px', padding: '12px 8px', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  actionLabel: { fontSize: '12px', fontWeight: '500', textAlign: 'center' },
  actionPoints: { fontSize: '13px', fontWeight: '700' },
  actionCoins: { display: 'flex', alignItems: 'center', gap: '2px' },
  card: { background: '#fff', borderRadius: '16px', border: '1px solid #e0ede8', padding: '16px 20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  viewAll: { fontSize: '13px', color: '#1D9E75', cursor: 'pointer', fontWeight: '500' },
  galleryDesc: { fontSize: '12px', color: '#888780', margin: '0 0 14px' },
  galleryRow: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  collectible: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  collectibleIcon: { width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  lockIcon: { position: 'absolute', bottom: '-4px', right: '-4px', fontSize: '14px' },
  collectibleName: { fontSize: '11px', color: '#5F5E5A', margin: 0, textAlign: 'center', maxWidth: '60px' },
  legendaryTag: { fontSize: '9px', background: '#FFF3D6', color: '#854F0B', padding: '2px 6px', borderRadius: '99px', fontWeight: '600' },
  rareTag: { fontSize: '9px', background: '#F0EDFF', color: '#5B4FCF', padding: '2px 6px', borderRadius: '99px', fontWeight: '600' },
  rightCard: { background: '#fff', borderRadius: '16px', border: '1px solid #e0ede8', padding: '16px' },
  rightCardTitle: { fontSize: '14px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 14px' },
  levelRow: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
  levelNum: { fontSize: '22px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 2px' },
  levelTitle: { fontSize: '13px', color: '#1D9E75', fontWeight: '500', margin: 0 },
  stageRow: { display: 'flex', alignItems: 'center', marginBottom: '12px' },
  stageItem: { display: 'flex', alignItems: 'center', flex: 1 },
  stageDot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stageLine: { flex: 1, height: '3px', borderRadius: '99px' },
  nextStageText: { fontSize: '12px', color: '#888780', margin: '0 0 8px' },
  progressBarBg: { background: '#e0ede8', borderRadius: '99px', height: '8px', marginBottom: '6px' },
  progressBarFill: { background: '#1D9E75', borderRadius: '99px', height: '8px', transition: 'width 0.5s ease' },
  progressText: { fontSize: '12px', color: '#888780', margin: 0, textAlign: 'right' },
  impactGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' },
  impactItem: { background: '#f7faf8', borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' },
  impactVal: { fontSize: '16px', fontWeight: '700', color: '#2C2C2A', margin: 0 },
  impactLabel: { fontSize: '11px', color: '#888780', margin: 0 },
  viewImpactBtn: { width: '100%', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  weatherRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  weatherTitle: { fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 2px' },
  weatherDesc: { fontSize: '12px', color: '#888780', margin: 0 },
  weatherTime: { marginLeft: 'auto', textAlign: 'right' },
  weatherClock: { fontSize: '14px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 2px' },
  weatherDate: { fontSize: '11px', color: '#888780', margin: 0 },
  unlockCard: { background: '#1D5C3A', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' },
  unlockInfo: { flex: 1 },
  unlockTitle: { fontSize: '14px', fontWeight: '700', color: '#fff', margin: '0 0 6px' },
  unlockDesc: { fontSize: '12px', color: '#9FE1CB', margin: '0 0 10px', lineHeight: 1.5 },
  unlockBarBg: { background: 'rgba(255,255,255,0.2)', borderRadius: '99px', height: '6px', marginBottom: '4px' },
  unlockBarFill: { background: '#EF9F27', borderRadius: '99px', height: '6px' },
  unlockProgress: { fontSize: '11px', color: '#9FE1CB', margin: 0 },
}

export default Garden
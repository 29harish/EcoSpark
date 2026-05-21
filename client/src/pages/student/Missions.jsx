import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchMissions, submitMission } from '../../services/missionService'

const Missions = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [missions, setMissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('home')
  const [submitting, setSubmitting] = useState(null)
  const [submitted, setSubmitted] = useState([])
  const [showModal, setShowModal] = useState(null)
  const [description, setDescription] = useState('')
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMissions()
        setMissions(data.missions)
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
    load()
  }, [])

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ]

  const categoryTabs = [
    { key: 'home', label: 'Home' },
    { key: 'school', label: 'School' },
    { key: 'community', label: 'Community' },
  ]

  const categoryIcons = {
    recycling: '♻️',
    water: '💧',
    energy: '⚡',
    planting: '🌱',
    wildlife: '🦋',
    pollution: '🌫️',
  }

  const categoryColors = {
    recycling: '#EAF3DE',
    water: '#D5EEF5',
    energy: '#FAEEDA',
    planting: '#EAF3DE',
    wildlife: '#F5E6D5',
    pollution: '#F0EDFF',
  }

  const difficultyColors = {
    easy: { bg: '#EAF3DE', color: '#27500A' },
    medium: { bg: '#FAEEDA', color: '#633806' },
    hard: { bg: '#FCEBEB', color: '#A32D2D' },
  }

  const filtered = missions.filter(m => {
    if (activeFilter === 'all') return true
    return m.difficulty === activeFilter
  })

  const handleSubmit = async (mission) => {
    setSubmitting(mission._id)
    console.log('Submitting:', mission._id, user.uid)
    try {
      const result = await submitMission(mission._id, user.uid, description)
      setSubmitted(prev => [...prev, mission._id])
      setShowModal(null)
      setDescription('')
      setSuccessMsg({
        title: mission.title,
        xp: result.xpEarned,
        ecoins: result.ecoinsEarned,
      })
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch (err) {
      console.log(err)
    }
    setSubmitting(null)
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
              style={item.path === '/missions' ? styles.navItemActive : styles.navItem}
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

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Missions 🎯</h1>
            <p style={styles.subtitle}>Complete missions, earn rewards and protect our planet!</p>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statPill}>
              <span>✅</span>
              <span style={styles.pillVal}>{submitted.length} completed today</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={styles.tabsRow}>
          {categoryTabs.map(tab => (
            <button
              key={tab.key}
              style={activeTab === tab.key ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Difficulty Filters */}
        <div style={styles.filtersRow}>
          {filters.map(f => (
            <button
              key={f.key}
              style={activeFilter === f.key ? styles.filterActive : styles.filter}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
          <span style={styles.missionCount}>{filtered.length} missions</span>
        </div>

        {/* Success Toast */}
        {successMsg && (
          <div style={styles.toast}>
            <span style={{ fontSize: '24px' }}>🎉</span>
            <div>
              <p style={styles.toastTitle}>Mission Completed!</p>
              <p style={styles.toastSub}>
                {successMsg.title} — +{successMsg.xp} XP, +{successMsg.ecoins} Ecoins
              </p>
            </div>
          </div>
        )}

        {/* Missions Grid */}
        {loading ? (
          <div style={styles.center}>
            <span style={{ fontSize: '40px' }}>🌱</span>
            <p style={{ color: '#888780' }}>Loading missions...</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map(mission => {
              const isSubmitted = submitted.includes(mission._id)
              const isSubmitting = submitting === mission._id
              const diff = difficultyColors[mission.difficulty]
              const icon = categoryIcons[mission.category] || '🌿'
              const bg = categoryColors[mission.category] || '#EAF3DE'

              return (
                <div key={mission._id} style={{
                  ...styles.missionCard,
                  opacity: isSubmitted ? 0.7 : 1,
                  border: isSubmitted ? '2px solid #1D9E75' : '1px solid #e0ede8',
                }}>
                  {/* Icon */}
                  <div style={{ ...styles.missionIcon, background: bg }}>
                    <span style={{ fontSize: '28px' }}>{icon}</span>
                  </div>

                  {/* Difficulty */}
                  <div style={styles.missionTop}>
                    <span style={{ ...styles.diffBadge, background: diff.bg, color: diff.color }}>
                      {mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1)}
                    </span>
                    {isSubmitted && (
                      <span style={styles.doneBadge}>✓ Done</span>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <h3 style={styles.missionTitle}>{mission.title}</h3>
                  <p style={styles.missionDesc}>{mission.description}</p>

                  {/* Rewards */}
                  <div style={styles.rewardsRow}>
                    <div style={styles.rewardChip}>
                      <span>⭐</span>
                      <span>+{mission.xpReward} XP</span>
                    </div>
                    <div style={styles.rewardChip}>
                      <span>🪙</span>
                      <span>+{mission.ecoinReward}</span>
                    </div>
                  </div>

                  {/* Proof type */}
                  <p style={styles.proofType}>
                    📋 {mission.proofType === 'photo' ? 'Photo required' : mission.proofType === 'peer-validated' ? 'Peer validated' : 'Self report'}
                  </p>

                  {/* Button */}
                  <button
                    style={{
                      ...styles.missionBtn,
                      background: isSubmitted ? '#888780' : '#1D9E75',
                      cursor: isSubmitted ? 'not-allowed' : 'pointer',
                    }}
                    disabled={isSubmitted || isSubmitting}
                    onClick={() => !isSubmitted && setShowModal(mission)}
                  >
                    {isSubmitted ? '✓ Completed' : isSubmitting ? 'Submitting...' : 'Complete Mission →'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Complete Mission</h2>
              <span style={styles.modalClose} onClick={() => setShowModal(null)}>✕</span>
            </div>

            <div style={styles.modalMission}>
              <span style={{ fontSize: '28px' }}>{categoryIcons[showModal.category]}</span>
              <div>
                <p style={styles.modalMissionName}>{showModal.title}</p>
                <p style={styles.modalMissionDesc}>{showModal.description}</p>
              </div>
            </div>

            <div style={styles.modalRewards}>
              <div style={styles.rewardChip}>⭐ +{showModal.xpReward} XP</div>
              <div style={styles.rewardChip}>🪙 +{showModal.ecoinReward} Ecoins</div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>
                Describe what you did (optional)
              </label>
              <textarea
                placeholder="Tell us about your eco action..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={styles.textarea}
                rows={3}
              />
            </div>

            <div style={styles.modalBtns}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(null)}
              >
                Cancel
              </button>
              <button
                style={styles.submitBtn}
                onClick={() => handleSubmit(showModal)}
                disabled={submitting === showModal._id}
              >
                {submitting === showModal._id ? 'Submitting...' : 'Submit Mission 🎉'}
              </button>
            </div>
          </div>
        </div>
      )}

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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 4px' },
  subtitle: { fontSize: '14px', color: '#888780', margin: 0 },
  headerStats: { display: 'flex', gap: '10px' },
  statPill: { display: 'flex', alignItems: 'center', gap: '6px', background: '#EAF3DE', border: '1px solid #C0DD97', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', color: '#27500A' },
  pillVal: { fontWeight: '600' },
  tabsRow: { display: 'flex', gap: '0', background: '#fff', borderRadius: '12px', border: '1px solid #e0ede8', overflow: 'hidden', marginBottom: '14px', width: 'fit-content' },
  tab: { padding: '10px 24px', border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '500', color: '#5F5E5A', cursor: 'pointer' },
  tabActive: { padding: '10px 24px', border: 'none', background: '#1D9E75', fontSize: '14px', fontWeight: '600', color: '#fff', cursor: 'pointer' },
  filtersRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' },
  filter: { padding: '7px 18px', borderRadius: '99px', border: '1px solid #e0ede8', background: '#fff', fontSize: '13px', color: '#5F5E5A', cursor: 'pointer', fontWeight: '500' },
  filterActive: { padding: '7px 18px', borderRadius: '99px', border: '2px solid #1D9E75', background: '#EAF3DE', fontSize: '13px', color: '#27500A', cursor: 'pointer', fontWeight: '600' },
  missionCount: { marginLeft: 'auto', fontSize: '13px', color: '#888780' },
  toast: { background: '#EAF3DE', border: '1px solid #C0DD97', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  toastTitle: { fontSize: '14px', fontWeight: '600', color: '#27500A', margin: '0 0 2px' },
  toastSub: { fontSize: '13px', color: '#3B6D11', margin: 0 },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '60px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  missionCard: { background: '#fff', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  missionIcon: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  missionTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  diffBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '99px', fontWeight: '600' },
  doneBadge: { fontSize: '12px', color: '#1D9E75', fontWeight: '600' },
  missionTitle: { fontSize: '15px', fontWeight: '600', color: '#2C2C2A', margin: 0 },
  missionDesc: { fontSize: '13px', color: '#5F5E5A', margin: 0, lineHeight: 1.5 },
  rewardsRow: { display: 'flex', gap: '8px' },
  rewardChip: { display: 'flex', alignItems: 'center', gap: '4px', background: '#f7faf8', border: '1px solid #e0ede8', borderRadius: '99px', padding: '4px 10px', fontSize: '12px', fontWeight: '500', color: '#2C2C2A' },
  proofType: { fontSize: '12px', color: '#888780', margin: 0 },
  missionBtn: { color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: '600', marginTop: 'auto' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: '#fff', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#2C2C2A', margin: 0 },
  modalClose: { fontSize: '18px', cursor: 'pointer', color: '#888780' },
  modalMission: { display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f7faf8', borderRadius: '12px', padding: '14px' },
  modalMissionName: { fontSize: '15px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 4px' },
  modalMissionDesc: { fontSize: '13px', color: '#5F5E5A', margin: 0 },
  modalRewards: { display: 'flex', gap: '10px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  inputLabel: { fontSize: '13px', fontWeight: '500', color: '#444441' },
  textarea: { padding: '12px', borderRadius: '10px', border: '1px solid #e0ede8', fontSize: '13px', fontFamily: 'Poppins, sans-serif', resize: 'none', outline: 'none', background: '#f7faf8' },
  modalBtns: { display: 'flex', gap: '10px' },
  cancelBtn: { flex: 1, background: '#f7faf8', border: '1px solid #e0ede8', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#2C2C2A' },
  submitBtn: { flex: 1, background: '#1D9E75', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#fff' },
}

export default Missions
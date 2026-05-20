import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchQuestions, submitQuizAnswers } from '../../services/quizService'

const Quiz = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [timer, setTimer] = useState(20)
  const [phase, setPhase] = useState('loading')
  const [result, setResult] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions()
        setQuestions(data.questions)
        setAnswers(new Array(data.questions.length).fill(null))
        setPhase('playing')
      } catch (err) {
        console.log('Error loading questions:', err)
      }
    }
    loadQuestions()
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    setTimer(20)
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleNext(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [current, phase])

  const handleSelect = (index) => {
    if (selected !== null) return
    setSelected(index)
    clearInterval(timerRef.current)
    const newAnswers = [...answers]
    newAnswers[current] = index
    setAnswers(newAnswers)
  }

  const handleNext = (index) => {
    const newAnswers = [...answers]
    if (index !== null) newAnswers[current] = index
    setAnswers(newAnswers)
    setSelected(null)
    clearInterval(timerRef.current)
    if (current + 1 >= questions.length) {
      handleSubmit(newAnswers)
    } else {
      setCurrent(prev => prev + 1)
    }
  }

  const handleSubmit = async (finalAnswers) => {
    setPhase('loading')
    try {
      const questionIds = questions.map(q => q.id)
      const data = await submitQuizAnswers(user.uid, finalAnswers, questionIds)
      setResult(data)
      setPhase('result')
    } catch (err) {
      console.log('Error submitting quiz:', err)
      setPhase('result')
    }
  }

  const timerColor = timer > 10 ? '#1D9E75' : timer > 5 ? '#EF9F27' : '#E24B4A'
  const timerPct = (timer / 20) * 100

  if (phase === 'loading') return (
    <div style={styles.center}>
      <span style={{ fontSize: '48px' }}>🌱</span>
      <p style={styles.loadingText}>Loading quiz...</p>
    </div>
  )

  if (phase === 'result') return (
    <div style={styles.page}>
      <div style={styles.resultCard}>
        <div style={styles.resultIcon}>
          {result?.score >= 4 ? '🏆' : result?.score >= 2 ? '⭐' : '🌱'}
        </div>
        <h1 style={styles.resultTitle}>
          {result?.score >= 4 ? 'Amazing!' : result?.score >= 2 ? 'Great Work!' : 'Keep Learning!'}
        </h1>
        <p style={styles.resultScore}>
          {result?.score} / {result?.total} correct
        </p>
        <div style={styles.rewardsRow}>
          <div style={styles.rewardBadge}>
            <span>⭐</span>
            <span>+{result?.xpEarned || 0} XP</span>
          </div>
          <div style={styles.rewardBadge}>
            <span>🪙</span>
            <span>+{result?.ecoinsEarned || 0} Eco Coins</span>
          </div>
        </div>
        <div style={styles.resultBtns}>
          <button style={styles.retryBtn} onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button style={styles.homeBtn} onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )

  const q = questions[current]

  return (
    <div style={styles.page}>
      <div style={styles.quizCard}>

        {/* Header */}
        <div style={styles.quizHeader}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
          <div style={styles.progressRow}>
            {questions.map((_, i) => (
              <div key={i} style={{
                ...styles.progressDot,
                background: i < current ? '#1D9E75' : i === current ? '#EF9F27' : '#e0ede8'
              }} />
            ))}
          </div>
          <span style={styles.questionCount}>{current + 1}/{questions.length}</span>
        </div>

        {/* Timer */}
        <div style={styles.timerRow}>
          <div style={styles.timerBarBg}>
            <div style={{ ...styles.timerBarFill, width: `${timerPct}%`, background: timerColor }} />
          </div>
          <span style={{ ...styles.timerText, color: timerColor }}>{timer}s</span>
        </div>

        {/* Category */}
        <span style={styles.categoryBadge}>{q?.category}</span>

        {/* Question */}
        <h2 style={styles.question}>{q?.question}</h2>

        {/* Options */}
        <div style={styles.optionsGrid}>
          {q?.options.map((option, i) => (
            <button
              key={i}
              style={{
                ...styles.optionBtn,
                ...(selected === i ? styles.optionSelected : {}),
                ...(selected !== null && i !== selected ? styles.optionDim : {}),
              }}
              onClick={() => handleSelect(i)}
            >
              <span style={styles.optionLetter}>
                {['A', 'B', 'C', 'D'][i]}
              </span>
              <span style={styles.optionText}>{option}</span>
            </button>
          ))}
        </div>

        {/* Next Button */}
        {selected !== null && (
          <button
            style={styles.nextBtn}
            onClick={() => handleNext(selected)}
          >
            {current + 1 >= questions.length ? 'Submit Quiz 🎉' : 'Next Question →'}
          </button>
        )}

      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Poppins, sans-serif' },
  center: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', fontFamily: 'Poppins, sans-serif' },
  loadingText: { fontSize: '14px', color: '#888780' },
  quizCard: { background: '#fff', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '560px', border: '1px solid #e0ede8' },
  quizHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
  backBtn: { background: 'none', border: '1px solid #e0ede8', borderRadius: '8px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', color: '#5F5E5A' },
  progressRow: { display: 'flex', gap: '6px' },
  progressDot: { width: '10px', height: '10px', borderRadius: '50%' },
  questionCount: { fontSize: '13px', color: '#888780', fontWeight: '500' },
  timerRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  timerBarBg: { flex: 1, background: '#e0ede8', borderRadius: '99px', height: '8px' },
  timerBarFill: { borderRadius: '99px', height: '8px', transition: 'width 1s linear' },
  timerText: { fontSize: '14px', fontWeight: '700', minWidth: '32px' },
  categoryBadge: { background: '#EAF3DE', color: '#27500A', fontSize: '12px', padding: '4px 12px', borderRadius: '99px', fontWeight: '500', display: 'inline-block', marginBottom: '12px' },
  question: { fontSize: '18px', fontWeight: '600', color: '#2C2C2A', lineHeight: 1.5, margin: '0 0 24px' },
  optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' },
  optionBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '12px', border: '2px solid #e0ede8', background: '#f7faf8', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' },
  optionSelected: { border: '2px solid #1D9E75', background: '#EAF3DE' },
  optionDim: { opacity: 0.5 },
  optionLetter: { width: '28px', height: '28px', borderRadius: '50%', background: '#e0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#5F5E5A', flexShrink: 0 },
  optionText: { fontSize: '13px', color: '#2C2C2A', fontWeight: '500', lineHeight: 1.4 },
  nextBtn: { width: '100%', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  resultCard: { background: '#fff', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center', border: '1px solid #e0ede8' },
  resultIcon: { fontSize: '64px', marginBottom: '16px' },
  resultTitle: { fontSize: '24px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 8px' },
  resultScore: { fontSize: '18px', color: '#5F5E5A', margin: '0 0 24px' },
  rewardsRow: { display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '28px' },
  rewardBadge: { display: 'flex', alignItems: 'center', gap: '6px', background: '#EAF3DE', color: '#27500A', padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: '600' },
  resultBtns: { display: 'flex', gap: '12px' },
  retryBtn: { flex: 1, background: '#f7faf8', border: '1px solid #e0ede8', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#2C2C2A' },
  homeBtn: { flex: 1, background: '#1D9E75', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#fff' },
}

export default Quiz
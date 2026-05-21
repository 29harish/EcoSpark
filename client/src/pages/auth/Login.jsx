import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createUserInDB } from '../../services/authService'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    }
    setLoading(false)
  }

const handleGoogleLogin = async () => {
  setError('')
  setLoading(true)
  try {
    const result = await googleLogin()
    await createUserInDB(
      result.user.uid,
      result.user.displayName,
      result.user.email,
      'student'
    )
    navigate('/dashboard')
  } catch (err) {
    setError('Google login failed. Please try again.')
  }
  setLoading(false)
}

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>🌱</div>
          <div>
            <h1 style={styles.logoText}>EcoSpark</h1>
            <p style={styles.tagline}>Learn • Play • Protect</p>
          </div>
        </div>

        <h2 style={styles.heading}>Welcome back!</h2>
        <p style={styles.subheading}>Login to continue your eco journey</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.dividerRow}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={styles.googleBtn}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            style={{ width: 18, height: 18 }}
          />
          Continue with Google
        </button>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0faf5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Poppins, sans-serif',
  },
  card: {
    background: '#ffffff',
    borderRadius: '24px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid #e0ede8',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px',
  },
  logoIcon: {
    fontSize: '36px',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1D9E75',
    margin: 0,
  },
  tagline: {
    fontSize: '12px',
    color: '#888780',
    margin: 0,
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2C2C2A',
    margin: '0 0 4px',
  },
  subheading: {
    fontSize: '14px',
    color: '#888780',
    margin: '0 0 24px',
  },
  error: {
    background: '#FCEBEB',
    color: '#A32D2D',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    marginBottom: '16px',
    border: '1px solid #F09595',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#444441',
  },
  input: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #e0ede8',
    fontSize: '14px',
    outline: 'none',
    color: '#2C2C2A',
    background: '#f7faf8',
  },
  btn: {
    background: '#1D9E75',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#e0ede8',
  },
  dividerText: {
    fontSize: '13px',
    color: '#888780',
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '13px',
    borderRadius: '12px',
    border: '1px solid #e0ede8',
    background: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2C2C2A',
    cursor: 'pointer',
  },
  switchText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#888780',
    marginTop: '20px',
  },
  link: {
    color: '#1D9E75',
    fontWeight: '600',
    textDecoration: 'none',
  },
}

export default Login
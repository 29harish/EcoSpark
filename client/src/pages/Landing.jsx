import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  const features = [
    { icon: '📚', title: 'Interactive Lessons', desc: 'Engaging lessons with animations, stories and real-life examples.' },
    { icon: '🎯', title: 'Eco Missions', desc: 'Complete real-world missions and earn exciting rewards.' },
    { icon: '🌱', title: 'Grow Your Garden', desc: 'Your actions help your virtual garden grow beautifully!' },
    { icon: '🏆', title: 'Compete & Win', desc: 'Climb leaderboards, earn badges and become a champion.' },
    { icon: '🤖', title: 'AI Eco Guide', desc: 'Get answers, tips and eco-hacks from your smart buddy.' },
  ]

  const steps = [
    { icon: '📖', step: '1. Learn', desc: 'Explore fun lessons on environmental topics.' },
    { icon: '📝', step: '2. Quiz', desc: 'Test your knowledge with interactive quizzes.' },
    { icon: '🌿', step: '3. Act', desc: 'Complete eco-missions in your daily life.' },
    { icon: '🏆🪙', step: '4. Earn Rewards', desc: 'Earn EcoCoins, XP and amazing badges.' },
    { icon: '🌳', step: '5. Grow & Inspire', desc: 'Grow your garden and inspire others!' },
  ]

  const champions = [
    { rank: 1, name: 'Aarav Sharma', school: 'Green Valley School', xp: '12,560 XP', color: '#EF9F27' },
    { rank: 2, name: 'Diya Patel', school: 'Sunshine Public School', xp: '11,230 XP', color: '#888780' },
    { rank: 3, name: 'Kabir Singh', school: 'Bright Future School', xp: '10,450 XP', color: '#BA7517' },
  ]

  const testimonials = [
    { text: 'EcoSpark makes learning about the environment so much fun!', author: 'Riya, Grade 6' },
    { text: 'My students are more engaged and care about the environment now.', author: 'Ms. Kavita, Teacher' },
    { text: 'I love my garden! I check the app every single day.', author: 'Arjun, Grade 7' },
  ]

  const footerLinks = {
    Explore: ['Lessons', 'Missions', 'Quizzes', 'Challenges', 'Eco Garden'],
    Company: ['About Us', 'Blog', 'For Schools', 'Contact Us'],
    Support: ['Help Center', 'Privacy Policy', 'Terms of Use'],
  }

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🌿</span>
            <div>
              <span style={styles.logoText}>EcoSpark</span>
              <p style={styles.logoSub}>Learn • Play • Protect</p>
            </div>
          </div>
          <div style={styles.navLinks}>
            {['Home', 'Features', 'How It Works', 'For Schools', 'About Us', 'Contact'].map(link => (
              <span key={link} style={styles.navLink}>{link}</span>
            ))}
          </div>
          <div style={styles.navBtns}>
            <button style={styles.loginBtn} onClick={() => navigate('/login')}>Log In</button>
            <button style={styles.getStartedBtn} onClick={() => navigate('/signup')}>Get Started →</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <h1 style={styles.heroTitle}>
            <span style={{ color: '#1D9E75' }}>Learn</span> Today.<br />
            <span style={{ color: '#378ADD' }}>Play</span> for Earth.<br />
            <span style={{ color: '#1D9E75' }}>Protect</span> Tomorrow.
          </h1>
          <p style={styles.heroDesc}>
            EcoSpark makes environmental education fun, interactive and rewarding for school students.
            Learn, complete missions and grow a greener world!
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.primaryBtn} onClick={() => navigate('/signup')}>
              Start Learning Now 🌱
            </button>
            <button style={styles.secondaryBtn} onClick={() => navigate('/missions')}>
              Explore Missions 🎯
            </button>
          </div>
          <p style={styles.socialProof}>
            👥 Join <strong style={{ color: '#1D9E75' }}>50,000+</strong> students making a difference!
          </p>
        </div>
        <div style={styles.heroRight}>
            <div style={styles.heroIllustration}>
            <img
                src="/src/assets/images/hero.png"
                alt="Kids planting trees with EcoSpark"
                style={styles.heroImg}
            />
            </div>
        </div>
      </section>

      {/* Why Students Love EcoSpark */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Students Love <span style={{ color: '#1D9E75' }}>EcoSpark</span> 🌿</h2>
        <p style={styles.sectionSub}>A fun way to learn, act and grow every day!</p>
        <div style={styles.featuresGrid}>
          {features.map(f => (
            <div key={f.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ ...styles.section, background: '#f7faf8' }}>
        <h2 style={styles.sectionTitle}>How It Works 🌿</h2>
        <p style={styles.sectionSub}>Simple steps, big impact!</p>
        <div style={styles.stepsRow}>
          {steps.map((s, i) => (
            <div key={s.step} style={styles.stepWrap}>
              <div style={styles.stepCard}>
                <span style={styles.stepIcon}>{s.icon}</span>
              </div>
              {i < steps.length - 1 && <span style={styles.arrow}>→</span>}
              <p style={styles.stepTitle}>{s.step}</p>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Eco Champions */}
      <section style={styles.section}>
        <div style={styles.championsHeader}>
          <div>
            <h2 style={styles.sectionTitle}>Top Eco Champions 🏆</h2>
            <p style={styles.sectionSub}>See who's leading the change!</p>
          </div>
          <span style={styles.viewAll} onClick={() => navigate('/leaderboard')}>View Full Leaderboard →</span>
        </div>
        <div style={styles.championsLayout}>
          <div style={styles.championsList}>
            {champions.map(c => (
              <div key={c.rank} style={styles.championRow}>
                <div style={{ ...styles.rankBadge, background: c.color }}>
                  {c.rank}
                </div>
                <div style={styles.championAvatar}>
                  {c.name[0]}
                </div>
                <div style={styles.championInfo}>
                  <p style={styles.championName}>{c.name}</p>
                  <p style={styles.championSchool}>{c.school} 🌿</p>
                </div>
                <span style={styles.championXP}>{c.xp}</span>
              </div>
            ))}
          </div>
          <div style={styles.joinCard}>
            <h3 style={styles.joinTitle}>Is your name next?</h3>
            <p style={styles.joinDesc}>Complete lessons and missions to become the top Eco Champion!</p>
            <button style={styles.joinBtn} onClick={() => navigate('/signup')}>Start Your Journey</button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ ...styles.section, background: '#f7faf8' }}>
        <h2 style={styles.sectionTitle}>Loved by Students & Teachers ❤️</h2>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <div style={styles.testimonialAvatar}>
                {['👧', '👩', '👦'][i]}
              </div>
              <p style={styles.testimonialText}>"{t.text}"</p>
              <p style={styles.testimonialAuthor}>— {t.author}</p>
              <p style={{ color: '#EF9F27', fontSize: '14px', margin: 0 }}>★★★★★</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaLeft}>
          <span style={{ fontSize: '32px' }}>🌍</span>
          <div>
            <h2 style={styles.ctaTitle}>Together, we can build a better planet.</h2>
            <p style={styles.ctaDesc}>Join EcoSpark today and start your green journey! 🌱</p>
          </div>
        </div>
        <button style={styles.ctaBtn} onClick={() => navigate('/signup')}>
          Get Started for Free 🌱
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrand}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🌿</span>
              <div>
                <span style={{ ...styles.logoText, color: '#9FE1CB' }}>EcoSpark</span>
                <p style={{ ...styles.logoSub, color: '#5DCAA5' }}>Learn • Play • Protect</p>
              </div>
            </div>
            <p style={styles.footerDesc}>A gamified platform inspiring young minds to protect our planet.</p>
            <div style={styles.socialRow}>
              {['📷', '▶️', '👍'].map((s, i) => (
                <span key={i} style={styles.socialIcon}>{s}</span>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} style={styles.footerCol}>
              <h4 style={styles.footerHeading}>{heading}</h4>
              {links.map(link => (
                <p key={link} style={styles.footerLink}>{link}</p>
              ))}
            </div>
          ))}
          <div style={styles.footerCol}>
            <h4 style={styles.footerHeading}>Stay Updated!</h4>
            <p style={styles.footerLink}>Subscribe to get eco-tips, updates and exciting challenges.</p>
            <div style={styles.emailRow}>
              <input placeholder="Enter your email" style={styles.emailInput} />
              <button style={styles.emailBtn}>→</button>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={{ margin: 0, color: '#5DCAA5', fontSize: '13px' }}>© 2026 EcoSpark. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

const styles = {
  page: { fontFamily: 'Poppins, sans-serif', background: '#ffffff', overflowX: 'hidden' },
  navbar: { position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #e0ede8', zIndex: 100, padding: '0 40px' },
  navInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { fontSize: '28px' },
  logoText: { fontSize: '20px', fontWeight: '700', color: '#1D9E75', display: 'block', lineHeight: 1.2 },
  logoSub: { fontSize: '10px', color: '#888780', margin: 0 },
  navLinks: { display: 'flex', gap: '28px' },
  navLink: { fontSize: '14px', color: '#444441', cursor: 'pointer', fontWeight: '500' },
  navBtns: { display: 'flex', gap: '12px', alignItems: 'center' },
  loginBtn: { background: 'none', border: '1px solid #e0ede8', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', color: '#2C2C2A', cursor: 'pointer', fontWeight: '500' },
  getStartedBtn: { background: '#1D9E75', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '14px', color: '#fff', cursor: 'pointer', fontWeight: '600' },
  hero: { maxWidth: '1200px', margin: '0 auto', padding: '60px 40px', display: 'flex', alignItems: 'center', gap: '60px' },
  heroLeft: { flex: 1 },
  heroTitle: { fontSize: '48px', fontWeight: '700', color: '#2C2C2A', lineHeight: 1.2, margin: '0 0 20px' },
  heroDesc: { fontSize: '16px', color: '#5F5E5A', lineHeight: 1.7, margin: '0 0 28px', maxWidth: '480px' },
  heroBtns: { display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' },
  primaryBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 28px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  secondaryBtn: { background: '#fff', color: '#2C2C2A', border: '1px solid #e0ede8', borderRadius: '12px', padding: '14px 28px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' },
  socialProof: { fontSize: '14px', color: '#5F5E5A', margin: 0 },
  heroRight: { flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  impactCard: { position: 'absolute', top: 0, right: 0, background: '#fff', borderRadius: '14px', border: '1px solid #e0ede8', padding: '12px 16px', textAlign: 'right', zIndex: 2 },
  impactHeader: { display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginBottom: '4px' },
  impactLabel: { fontSize: '12px', color: '#1D9E75', fontWeight: '500' },
  impactNum: { fontSize: '28px', fontWeight: '700', color: '#2C2C2A', margin: '0 0 2px' },
  impactSub: { fontSize: '11px', color: '#888780', margin: 0 },
  heroIllustration: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingTop: '40px' },
  heroImg: {  width: '100%',  maxWidth: '800px',  height: '580px',objectFit: 'contain',},
  section: { padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' },
  sectionTitle: { fontSize: '28px', fontWeight: '700', color: '#2C2C2A', textAlign: 'center', margin: '0 0 8px' },
  sectionSub: { fontSize: '15px', color: '#888780', textAlign: 'center', margin: '0 0 40px' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
  featureCard: { background: '#f7faf8', borderRadius: '16px', padding: '24px 20px', textAlign: 'center', border: '1px solid #e0ede8' },
  featureIcon: { fontSize: '36px', display: 'block', marginBottom: '12px' },
  featureTitle: { fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 8px' },
  featureDesc: { fontSize: '13px', color: '#5F5E5A', margin: 0, lineHeight: 1.6 },
  stepsRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' },
  stepWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', maxWidth: '140px', position: 'relative' },
  stepCard: { width: '72px', height: '72px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepIcon: { fontSize: '32px' },
  arrow: { position: 'absolute', right: '-20px', top: '24px', fontSize: '20px', color: '#1D9E75', fontWeight: '700' },
  stepTitle: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', textAlign: 'center', margin: 0 },
  stepDesc: { fontSize: '12px', color: '#5F5E5A', textAlign: 'center', margin: 0, lineHeight: 1.5 },
  championsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  viewAll: { fontSize: '14px', color: '#1D9E75', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' },
  championsLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  championsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  championRow: { display: 'flex', alignItems: 'center', gap: '14px', background: '#f7faf8', borderRadius: '12px', padding: '14px 16px', border: '1px solid #e0ede8' },
  rankBadge: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff', flexShrink: 0 },
  championAvatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#27500A', flexShrink: 0 },
  championInfo: { flex: 1 },
  championName: { fontSize: '14px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 2px' },
  championSchool: { fontSize: '12px', color: '#888780', margin: 0 },
  championXP: { fontSize: '15px', fontWeight: '700', color: '#1D9E75' },
  joinCard: { background: '#EAF3DE', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid #C0DD97' },
  joinTitle: { fontSize: '22px', fontWeight: '700', color: '#27500A', margin: '0 0 10px' },
  joinDesc: { fontSize: '14px', color: '#3B6D11', lineHeight: 1.6, margin: '0 0 20px' },
  joinBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' },
  testimonialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  testimonialCard: { background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e0ede8', textAlign: 'center' },
  testimonialAvatar: { fontSize: '40px', marginBottom: '12px' },
  testimonialText: { fontSize: '14px', color: '#5F5E5A', lineHeight: 1.6, margin: '0 0 10px', fontStyle: 'italic' },
  testimonialAuthor: { fontSize: '13px', fontWeight: '600', color: '#2C2C2A', margin: '0 0 6px' },
  ctaBanner: { background: '#EAF3DE', padding: '40px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' },
  ctaLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  ctaTitle: { fontSize: '22px', fontWeight: '700', color: '#27500A', margin: '0 0 6px' },
  ctaDesc: { fontSize: '14px', color: '#3B6D11', margin: 0 },
  ctaBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '12px', padding: '16px 32px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' },
  footer: { background: '#085041', padding: '40px' },
  footerTop: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', gap: '40px', paddingBottom: '32px', borderBottom: '1px solid #0F6E56' },
  footerBrand: { display: 'flex', flexDirection: 'column', gap: '12px' },
  footerDesc: { fontSize: '13px', color: '#5DCAA5', lineHeight: 1.6, margin: 0 },
  socialRow: { display: 'flex', gap: '12px' },
  socialIcon: { fontSize: '20px', cursor: 'pointer' },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '8px' },
  footerHeading: { fontSize: '14px', fontWeight: '600', color: '#9FE1CB', margin: '0 0 4px' },
  footerLink: { fontSize: '13px', color: '#5DCAA5', margin: 0, cursor: 'pointer' },
  footerBottom: { maxWidth: '1200px', margin: '24px auto 0', textAlign: 'center' },
  emailRow: { display: 'flex', gap: '8px', marginTop: '4px' },
  emailInput: { flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #0F6E56', background: '#0F6E56', color: '#fff', fontSize: '13px', outline: 'none' },
  emailBtn: { background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '14px' },
}

export default Landing

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    try {
      setLoading(true)
      await register(form)
      await login({ email: form.email, password: form.password })
      toast.success('Account created! Welcome to Navix 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '6px' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 50%, #ecfdf5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }} className="fade-in">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #22c55e, #059669)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(22,163,74,0.3)' }}>
            <Leaf size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b' }}>Create account</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Join Navix — fresh groceries await</p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Jane Doe" required minLength={2} className="input" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required autoComplete="email" className="input" />
            </div>
            <div>
              <label style={labelStyle}>Phone (optional)</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="+91 98765 43210" className="input" />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Min 6 characters" required minLength={6}
                  autoComplete="new-password" className="input"
                  style={{ paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center', marginTop: '4px' }}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

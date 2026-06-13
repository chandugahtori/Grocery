import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const user = await login(form)
      toast.success('Welcome back! 👋')
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #fff 50%, #ecfdf5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }} className="fade-in">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #22c55e, #059669)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(22,163,74,0.3)' }}>
            <Leaf size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b' }}>Welcome back</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Sign in to your Navix account</p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Email</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required autoComplete="email"
                className="input"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="••••••••" required
                  autoComplete="current-password" className="input"
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
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '20px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
              Register free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

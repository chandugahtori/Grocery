import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, LogOut, LayoutDashboard, Menu, X, Leaf } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Track screen size to show/hide hamburger
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close menu when switching to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQ.trim())}`)
      setSearchQ('')
      setMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="section-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '16px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }} onClick={() => setMenuOpen(false)}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #22c55e, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(22,163,74,0.3)' }}>
              <Leaf size={18} color="#fff" />
            </div>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800 }}>Navix</span>
          </Link>

          {/* Search bar — always show on desktop */}
          {!isMobile && (
            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '420px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', zIndex: 1 }} />
                <input
                  type="text"
                  placeholder="Search groceries…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="input"
                  style={{ paddingLeft: '36px', height: '40px', fontSize: '0.875rem' }}
                />
              </div>
            </form>
          )}

          {/* Desktop nav links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Link to="/products" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Shop</Link>

              {isLoggedIn && (
                <Link to="/cart" className="btn-ghost" style={{ fontSize: '0.875rem', position: 'relative' }}>
                  <ShoppingCart size={18} /> Cart
                  {itemCount > 0 && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', background: '#16a34a', color: '#fff', fontSize: '0.7rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Link>
              )}

              {isLoggedIn ? (
                <>
                  <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                    {isAdmin ? <LayoutDashboard size={17} /> : <User size={17} />}
                    {isAdmin ? 'Admin' : 'Account'}
                  </Link>
                  <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: '0.875rem', color: '#ef4444' }}>
                    <LogOut size={17} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost" style={{ fontSize: '0.875rem' }}>Login</Link>
                  <Link to="/register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '8px 16px' }}>Register</Link>
                </>
              )}
            </div>
          )}

          {/* Mobile hamburger button — only on mobile */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: menuOpen ? '#f1f5f9' : 'transparent', cursor: 'pointer', color: '#334155', transition: 'background 0.15s' }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #f1f5f9', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '4px' }} className="fade-in">
          {/* Mobile search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', zIndex: 1 }} />
              <input
                type="text"
                placeholder="Search groceries…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="input"
                style={{ paddingLeft: '36px', height: '40px', fontSize: '0.875rem' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Go</button>
          </form>

          <Link to="/products" onClick={() => setMenuOpen(false)}
            style={{ display: 'block', padding: '10px 12px', fontSize: '0.875rem', fontWeight: 500, color: '#334155', textDecoration: 'none', borderRadius: '8px' }}
            onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >🛒 Shop</Link>

          {isLoggedIn && (
            <Link to="/cart" onClick={() => setMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', fontSize: '0.875rem', fontWeight: 500, color: '#334155', textDecoration: 'none', borderRadius: '8px' }}
              onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              <ShoppingCart size={16} /> Cart {itemCount > 0 && <span className="badge badge-green">{itemCount}</span>}
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '10px 12px', fontSize: '0.875rem', fontWeight: 500, color: '#334155', textDecoration: 'none', borderRadius: '8px' }}
                onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                {isAdmin ? '⚙️ Admin Panel' : '👤 Account'}
              </Link>
              <button onClick={handleLogout}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', fontSize: '0.875rem', fontWeight: 500, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                onMouseEnter={e => e.currentTarget.style.background='#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >🚪 Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
              <Link to="/login" className="btn-secondary" onClick={() => setMenuOpen(false)} style={{ flex: 1, fontSize: '0.875rem', justifyContent: 'center' }}>Login</Link>
              <Link to="/register" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ flex: 1, fontSize: '0.875rem', justifyContent: 'center' }}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

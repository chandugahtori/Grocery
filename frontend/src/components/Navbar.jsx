import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, LogOut, LayoutDashboard, Package, Menu, X, Leaf } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQ, setSearchQ] = useState('')

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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMenuOpen(false)}>
            <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="text-xl font-extrabold gradient-text">Navix</span>
          </Link>

          {/* Search bar — desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search groceries…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="input pl-9 py-2 text-sm h-10"
              />
            </div>
          </form>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/products" className="btn-ghost text-sm">Shop</Link>

            {isLoggedIn && !isAdmin && (
              <Link to="/cart" className="btn-ghost relative text-sm">
                <ShoppingCart size={18} />
                Cart
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-ghost text-sm">
                  {isAdmin ? <LayoutDashboard size={17} /> : <User size={17} />}
                  {isAdmin ? 'Admin' : 'Account'}
                </Link>
                <button onClick={handleLogout} className="btn-ghost text-sm text-red-500 hover:bg-red-50">
                  <LogOut size={17} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 fade-in">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search groceries…"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="input pl-9 py-2 text-sm h-10"
              />
            </div>
            <button type="submit" className="btn-primary py-2 px-4 text-sm">Go</button>
          </form>
          <Link to="/products" className="block py-2 text-sm font-medium text-slate-700" onClick={() => setMenuOpen(false)}>🛒 Shop</Link>
          {isLoggedIn && !isAdmin && (
            <Link to="/cart" className="flex items-center gap-2 py-2 text-sm font-medium text-slate-700" onClick={() => setMenuOpen(false)}>
              <ShoppingCart size={16} /> Cart {itemCount > 0 && <span className="badge badge-green">{itemCount}</span>}
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="block py-2 text-sm font-medium text-slate-700" onClick={() => setMenuOpen(false)}>
                {isAdmin ? '⚙️ Admin Panel' : '👤 Account'}
              </Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-sm font-medium text-red-500">
                🚪 Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" className="btn-secondary flex-1 text-sm py-2" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-primary flex-1 text-sm py-2" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

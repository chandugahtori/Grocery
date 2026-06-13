import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartItemComponent from '../components/CartItem'
import Loader from '../components/Loader'

export default function Cart() {
  const { cart, loading } = useCart()
  const navigate = useNavigate()
  const items = cart?.items || []
  const total = cart?.total || 0

  if (loading) return <div className="page-container"><Loader /></div>

  if (items.length === 0) {
    return (
      <div className="page-container fade-in">
        <div style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
          <div style={{ width: '96px', height: '96px', background: '#f0fdf4', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShoppingBag size={40} color="#22c55e" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Your cart is empty</h2>
          <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Add fresh groceries and get them delivered in 30 minutes.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>My Cart ({items.length} items)</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
        {/* Cart items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item) => <CartItemComponent key={item.id} item={item} />)}
        </div>

        {/* Order summary */}
        <div>
          <div className="card" style={{ padding: '24px', position: 'sticky', top: '96px' }}>
            <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem', marginBottom: '20px' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({items.length} items)</span>
                <span style={{ fontWeight: 600 }}>₹{total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee</span>
                <span style={{ fontWeight: 600, color: total >= 500 ? '#16a34a' : 'inherit' }}>
                  {total >= 500 ? 'FREE' : '₹49'}
                </span>
              </div>
              {total < 500 && (
                <p style={{ fontSize: '0.75rem', color: '#16a34a', background: '#f0fdf4', borderRadius: '8px', padding: '8px 12px' }}>
                  Add ₹{(500 - total).toFixed(2)} more for free delivery!
                </p>
              )}
            </div>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#1e293b', fontSize: '1.1rem', marginBottom: '20px' }}>
              <span>Total</span>
              <span>₹{(total + (total >= 500 ? 0 : 49)).toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/products" className="btn-ghost" style={{ width: '100%', marginTop: '12px', fontSize: '0.875rem', justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

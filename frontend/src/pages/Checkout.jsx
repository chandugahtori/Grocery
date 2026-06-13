import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, CreditCard, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { placeOrder } from '../api/orderService'
import toast from 'react-hot-toast'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, fetchCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    address_line1: '', address_line2: '', city: '',
    state: '', pincode: '', payment_method: 'cod', notes: '',
  })

  const items = cart?.items || []
  const total = cart?.total || 0
  const deliveryFee = total >= 500 ? 0 : 49
  const grandTotal = (total + deliveryFee).toFixed(2)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    try {
      setLoading(true)
      const { data: order } = await placeOrder(form)
      await fetchCart()
      toast.success('Order placed successfully! 🎉')
      navigate(`/dashboard?order=${order.id}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '6px' }
  const sectionTitle = (Icon, text) => (
    <h3 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Icon size={18} color="#16a34a" /> {text}
    </h3>
  )

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '32px' }}>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>

          {/* Left — Address + Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Delivery Address */}
            <div className="card" style={{ padding: '24px' }}>
              {sectionTitle(MapPin, 'Delivery Address')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Address Line 1 *</label>
                  <input name="address_line1" value={form.address_line1} onChange={handleChange}
                    placeholder="House no., Street, Area" required className="input" />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Address Line 2</label>
                  <input name="address_line2" value={form.address_line2} onChange={handleChange}
                    placeholder="Landmark (optional)" className="input" />
                </div>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    placeholder="City" required className="input" />
                </div>
                <div>
                  <label style={labelStyle}>State *</label>
                  <input name="state" value={form.state} onChange={handleChange}
                    placeholder="State" required className="input" />
                </div>
                <div>
                  <label style={labelStyle}>Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange}
                    placeholder="6-digit pincode" pattern="\d{6}" required className="input" />
                </div>
                <div>
                  <label style={labelStyle}>Delivery Notes</label>
                  <input name="notes" value={form.notes} onChange={handleChange}
                    placeholder="Leave at door, etc." className="input" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card" style={{ padding: '24px' }}>
              {sectionTitle(CreditCard, 'Payment Method')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when order arrives' },
                  { value: 'upi', label: '📱 UPI', desc: 'Google Pay, PhonePe, Paytm' },
                  { value: 'card', label: '💳 Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { value: 'netbanking', label: '🏦 Net Banking', desc: 'All major banks' },
                ].map(({ value, label, desc }) => (
                  <label key={value} style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                    borderRadius: '12px', border: `2px solid ${form.payment_method === value ? '#16a34a' : '#e2e8f0'}`,
                    background: form.payment_method === value ? '#f0fdf4' : '#fff',
                    cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s',
                  }}>
                    <input
                      type="radio" name="payment_method" value={value}
                      checked={form.payment_method === value} onChange={handleChange}
                      style={{ accentColor: '#16a34a' }}
                    />
                    <div>
                      <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{label}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div>
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '96px' }}>
              <h3 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>Order Summary</h3>
              <div style={{ maxHeight: '192px', overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748b' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>{item.product.name} × {item.quantity}</span>
                    <span style={{ flexShrink: 0 }}>₹{(parseFloat(item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: '#64748b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span><span>₹{total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery</span>
                  <span style={{ color: deliveryFee === 0 ? '#16a34a' : 'inherit', fontWeight: deliveryFee === 0 ? 600 : 400 }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#1e293b', fontSize: '1.1rem', marginBottom: '20px' }}>
                <span>Grand Total</span><span>₹{grandTotal}</span>
              </div>
              <button type="submit" disabled={loading || items.length === 0} className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1rem', justifyContent: 'center' }}>
                <CheckCircle size={19} />
                {loading ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}

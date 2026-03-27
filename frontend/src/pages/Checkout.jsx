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

  return (
    <div className="page-container fade-in">
      <h1 className="text-2xl font-extrabold text-slate-800 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-green-600" /> Delivery Address
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1 *</label>
                  <input name="address_line1" value={form.address_line1} onChange={handleChange}
                    placeholder="House no., Street, Area" required className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2</label>
                  <input name="address_line2" value={form.address_line2} onChange={handleChange}
                    placeholder="Landmark (optional)" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    placeholder="City" required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                  <input name="state" value={form.state} onChange={handleChange}
                    placeholder="State" required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange}
                    placeholder="6-digit pincode" pattern="\d{6}" required className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Notes</label>
                  <input name="notes" value={form.notes} onChange={handleChange}
                    placeholder="Leave at door, etc." className="input" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-green-600" /> Payment Method
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when order arrives' },
                  { value: 'upi', label: '📱 UPI', desc: 'Google Pay, PhonePe, Paytm' },
                  { value: 'card', label: '💳 Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { value: 'netbanking', label: '🏦 Net Banking', desc: 'All major banks' },
                ].map(({ value, label, desc }) => (
                  <label key={value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${form.payment_method === value ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value={value}
                      checked={form.payment_method === value}
                      onChange={handleChange}
                      className="accent-green-600"
                    />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{label}</p>
                      <p className="text-xs text-slate-400">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-4">Order Summary</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-slate-600">
                    <span className="truncate mr-2">{item.product.name} × {item.quantity}</span>
                    <span className="shrink-0">₹{(parseFloat(item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-3 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span><span>₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-extrabold text-slate-800 text-lg mb-5">
                <span>Grand Total</span><span>₹{grandTotal}</span>
              </div>
              <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full py-3 text-base">
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

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
        <div className="max-w-md mx-auto text-center py-24">
          <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-8">Add fresh groceries and get them delivered in 30 minutes.</p>
          <Link to="/products" className="btn-primary">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container fade-in">
      <h1 className="text-2xl font-extrabold text-slate-800 mb-6">My Cart ({items.length} items)</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => <CartItemComponent key={item.id} item={item} />)}
        </div>

        {/* Order summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm text-slate-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={total >= 500 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                  {total >= 500 ? 'FREE' : '₹49'}
                </span>
              </div>
              {total < 500 && (
                <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  Add ₹{(500 - total).toFixed(2)} more for free delivery!
                </p>
              )}
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between font-extrabold text-slate-800 text-lg mb-5">
              <span>Total</span>
              <span>₹{(total + (total >= 500 ? 0 : 49)).toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3 text-base"
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/products" className="btn-ghost w-full mt-3 text-sm justify-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

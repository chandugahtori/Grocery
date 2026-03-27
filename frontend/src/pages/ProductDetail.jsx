import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, ArrowLeft, Star, Package, Zap } from 'lucide-react'
import { getProduct } from '../api/productService'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isLoggedIn } = useAuth()
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  })

  const product = data?.data

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }
    try {
      setAdding(true)
      await addItem(product.id, qty)
      toast.success(`${product.name} added to cart!`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add to cart')
    } finally {
      setAdding(false)
    }
  }

  if (isLoading) return <div className="page-container"><Loader /></div>
  if (error || !product) return (
    <div className="page-container text-center py-20">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="text-2xl font-bold text-slate-700 mb-2">Product not found</h2>
      <button onClick={() => navigate('/products')} className="btn-primary mt-4">Browse Products</button>
    </div>
  )

  const price = product.discount_price || product.price
  const discountPct = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : null

  return (
    <div className="page-container fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-50 aspect-square max-h-[480px]">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600' }}
          />
          {discountPct && (
            <span className="absolute top-4 left-4 badge badge-green text-sm px-3 py-1">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="badge badge-green mb-3">{product.category?.name}</span>
          <h1 className="text-3xl font-extrabold text-slate-800 leading-tight mb-2">{product.name}</h1>
          <p className="text-slate-500 text-sm mb-4">{product.unit}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-extrabold text-green-600">₹{price}</span>
            {product.discount_price && (
              <span className="text-xl text-slate-400 line-through">₹{product.price}</span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 10 ? (
              <span className="badge badge-green"><Package size={12} className="mr-1" /> In Stock</span>
            ) : product.stock > 0 ? (
              <span className="badge badge-orange"><Zap size={12} className="mr-1" /> Only {product.stock} left</span>
            ) : (
              <span className="badge badge-red">Out of Stock</span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-slate-50 text-lg font-bold text-slate-600 transition-colors"
                >−</button>
                <span className="w-12 text-center font-bold text-slate-800">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-slate-50 text-lg font-bold text-slate-600 transition-colors"
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="btn-primary flex-1 py-3 text-base"
              >
                <ShoppingCart size={20} />
                {adding ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
            {[
              ['🚚', 'Free Delivery', 'Above ₹500'],
              ['✅', 'Quality Assured', 'Farm fresh'],
              ['↩️', 'Easy Returns', '24hr policy'],
            ].map(([emoji, title, sub]) => (
              <div key={title}>
                <p className="text-2xl mb-1">{emoji}</p>
                <p className="text-xs font-semibold text-slate-700">{title}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

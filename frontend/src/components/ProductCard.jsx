import { ShoppingCart, Star, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { isLoggedIn } = useAuth()

  const discount = product.discount_price
  const price = discount || product.price
  const discountPct = discount
    ? Math.round(((product.price - discount) / product.price) * 100)
    : null

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart')
      return
    }
    try {
      await addItem(product.id, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to add to cart')
    }
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-50 aspect-square">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
          }}
        />
        {discountPct && (
          <span className="absolute top-2 left-2 badge badge-green font-bold">
            {discountPct}% OFF
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 badge badge-orange">
            <Zap size={10} className="mr-0.5" /> Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="badge badge-red text-sm px-3 py-1">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-slate-400 mb-0.5">{product.category?.name}</p>
        <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2 group-hover:text-green-700 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{product.unit}</p>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-green-700 font-bold text-base">₹{price}</span>
            {discount && (
              <span className="text-slate-400 text-xs line-through ml-1.5">₹{product.price}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-9 h-9 bg-green-600 text-white rounded-xl flex items-center justify-center hover:bg-green-700 active:scale-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            aria-label="Add to cart"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </Link>
  )
}

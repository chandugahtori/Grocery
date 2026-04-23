import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function CartItem({ item }) {
  const { updateItem, removeItem } = useCart()
  const { product, quantity, id } = item

  const price = parseFloat(product.discount_price || product.price)
  const subtotal = (price * quantity).toFixed(2)

  const handleUpdate = async (newQty) => {
    if (newQty < 1) return
    if (newQty > product.stock) {
      toast.error('Not enough stock')
      return
    }
    try {
      await updateItem(id, newQty)
    } catch {
      toast.error('Failed to update quantity')
    }
  }

  const handleRemove = async () => {
    try {
      await removeItem(id)
      toast.success('Item removed from cart')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition-colors duration-200 fade-in">
      {/* Product Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 shrink-0">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200' }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-800 text-sm truncate">{product.name}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{product.unit}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-green-700 font-bold text-sm">₹{price}</span>
          {product.discount_price && (
            <span className="text-slate-400 text-xs line-through">₹{product.price}</span>
          )}
        </div>
      </div>

      {/* Quantity control */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => handleUpdate(quantity - 1)}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-90 transition-all duration-200"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center font-semibold text-slate-800 text-sm">{quantity}</span>
        <button
          onClick={() => handleUpdate(quantity + 1)}
          disabled={quantity >= product.stock}
          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-90 disabled:opacity-40 transition-all duration-200"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal + remove */}
      <div className="text-right shrink-0">
        <p className="font-bold text-slate-800 text-sm">₹{subtotal}</p>
        <button
          onClick={handleRemove}
          className="mt-1 text-red-400 hover:text-red-600 transition-colors duration-200"
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

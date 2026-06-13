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
    if (newQty > product.stock) { toast.error('Not enough stock'); return }
    try { await updateItem(id, newQty) }
    catch { toast.error('Failed to update quantity') }
  }

  const handleRemove = async () => {
    try { await removeItem(id); toast.success('Item removed from cart') }
    catch { toast.error('Failed to remove item') }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', transition: 'border-color 0.2s' }}
      className="fade-in"
      onMouseEnter={e => e.currentTarget.style.borderColor = '#e2e8f0'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#f1f5f9'}
    >
      {/* Product Image */}
      <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', flexShrink: 0 }}>
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200' }}
        />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h4>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{product.unit}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span style={{ color: '#15803d', fontWeight: 700, fontSize: '0.875rem' }}>₹{price}</span>
          {product.discount_price && (
            <span style={{ color: '#94a3b8', fontSize: '0.75rem', textDecoration: 'line-through' }}>₹{product.price}</span>
          )}
        </div>
      </div>

      {/* Quantity control */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => handleUpdate(quantity - 1)}
          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <Minus size={14} />
        </button>
        <span style={{ width: '32px', textAlign: 'center', fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{quantity}</span>
        <button
          onClick={() => handleUpdate(quantity + 1)}
          disabled={quantity >= product.stock}
          style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer', opacity: quantity >= product.stock ? 0.4 : 1, transition: 'background 0.15s' }}
          onMouseEnter={e => { if (quantity < product.stock) e.currentTarget.style.background = '#f8fafc' }}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal + remove */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>₹{subtotal}</p>
        <button
          onClick={handleRemove}
          style={{ marginTop: '4px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
          onMouseLeave={e => e.currentTarget.style.color = '#f87171'}
          aria-label="Remove item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

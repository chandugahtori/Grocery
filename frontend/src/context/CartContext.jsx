import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../api/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [cart, setCart] = useState({ id: null, items: [], total: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) return
    try {
      setLoading(true)
      const { data } = await getCart()
      setCart(data)
    } catch {
      setCart({ id: null, items: [], total: 0 })
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addItem = async (productId, quantity = 1) => {
    const { data } = await addToCart({ product_id: productId, quantity })
    setCart(data)
    return data
  }

  const updateItem = async (itemId, quantity) => {
    const { data } = await updateCartItem(itemId, { quantity })
    setCart(data)
  }

  const removeItem = async (itemId) => {
    const { data } = await removeCartItem(itemId)
    setCart(data)
  }

  const emptyCart = async () => {
    await clearCart()
    setCart({ id: null, items: [], total: 0 })
  }

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addItem, updateItem, removeItem, emptyCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

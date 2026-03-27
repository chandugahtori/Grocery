import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  LayoutDashboard, Package, ShoppingBag, Users, TrendingUp,
  Plus, Edit2, Trash2, Check, X, ChevronDown,
} from 'lucide-react'
import { getAnalytics, adminGetOrders, updateOrderStatus, getAdminUsers } from '../../api/orderService'
import { adminGetProducts, createProduct, updateProduct, deleteProduct } from '../../api/productService'
import { getCategories } from '../../api/productService'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'badge-slate', confirmed: 'badge-blue', processing: 'badge-blue',
  shipped: 'badge-orange', delivered: 'badge-green', cancelled: 'badge-red',
}
const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const EMPTY_PRODUCT = { name: '', description: '', price: '', discount_price: '', stock: '', unit: '1 pc', category_id: '', image_url: '', is_active: true }

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [editProduct, setEditProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const queryClient = useQueryClient()

  // Queries
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({ queryKey: ['analytics'], queryFn: getAnalytics })
  const { data: ordersData, isLoading: ordersLoading } = useQuery({ queryKey: ['admin-orders'], queryFn: () => adminGetOrders({ size: 50 }) })
  const { data: productsData, isLoading: productsLoading } = useQuery({ queryKey: ['admin-products'], queryFn: () => adminGetProducts({ size: 50 }) })
  const { data: usersData } = useQuery({ queryKey: ['admin-users'], queryFn: () => getAdminUsers({ size: 50 }) })
  const { data: catData } = useQuery({ queryKey: ['categories'], queryFn: getCategories })

  const analytics = analyticsData?.data
  const orders = ordersData?.data || []
  const products = productsData?.data?.items || []
  const users = usersData?.data || []
  const categories = catData?.data || []

  // Mutations
  const orderStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries(['admin-orders']); toast.success('Order status updated') },
    onError: () => toast.error('Failed to update status'),
  })
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { queryClient.invalidateQueries(['admin-products']); setShowForm(false); setForm(EMPTY_PRODUCT); toast.success('Product created!') },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to create product'),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['admin-products']); setEditProduct(null); toast.success('Product updated!') },
    onError: (e) => toast.error(e.response?.data?.detail || 'Failed to update product'),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { queryClient.invalidateQueries(['admin-products']); toast.success('Product deleted') },
    onError: () => toast.error('Failed to delete product'),
  })

  const TABS = [
    ['overview', LayoutDashboard, 'Overview'],
    ['products', Package, 'Products'],
    ['orders', ShoppingBag, 'Orders'],
    ['users', Users, 'Users'],
  ]

  const handleProductSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: parseFloat(form.price),
      discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      stock: parseInt(form.stock),
      category_id: parseInt(form.category_id),
    }
    if (editProduct) {
      updateMutation.mutate({ id: editProduct.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const startEdit = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name, description: product.description || '', price: product.price,
      discount_price: product.discount_price || '', stock: product.stock,
      unit: product.unit, category_id: product.category_id,
      image_url: product.image_url || '', is_active: product.is_active,
    })
    setShowForm(true)
    setTab('products')
  }

  return (
    <div className="page-container fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Admin Dashboard</h1>
        <span className="badge badge-orange">Admin</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit overflow-x-auto">
        {TABS.map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${tab === key ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        analyticsLoading ? <Loader /> : analytics && (
          <div className="space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `₹${analytics.total_revenue.toFixed(2)}`, icon: TrendingUp, color: 'from-green-400 to-emerald-500' },
                { label: 'Total Orders', value: analytics.total_orders, icon: ShoppingBag, color: 'from-blue-400 to-cyan-500' },
                { label: 'Total Users', value: analytics.total_users, icon: Users, color: 'from-purple-400 to-violet-500' },
                { label: "Today's Revenue", value: `₹${analytics.revenue_today.toFixed(2)}`, icon: TrendingUp, color: 'from-orange-400 to-amber-500' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-800">{value}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top products */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-800 mb-4">Top Products by Sales</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.top_products} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="qty" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Orders by status */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-800 mb-4">Orders by Status</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.orders_by_status).map(([status, count]) => (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-slate-600">{status}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                          style={{ width: `${Math.min(100, (count / analytics.total_orders) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent orders */}
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>{['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {analytics.recent_orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-slate-400">#{o.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-5 py-3 font-medium text-slate-700">{o.user_name}</td>
                        <td className="px-5 py-3 font-bold text-slate-800">₹{o.total_amount}</td>
                        <td className="px-5 py-3"><span className={`badge ${STATUS_COLORS[o.status] || 'badge-slate'} capitalize`}>{o.status}</span></td>
                        <td className="px-5 py-3 text-slate-400">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}

      {/* ── PRODUCTS ── */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-500">{products.length} products</p>
            <button onClick={() => { setEditProduct(null); setForm(EMPTY_PRODUCT); setShowForm(!showForm) }} className="btn-primary text-sm py-2 px-4">
              <Plus size={16} /> Add Product
            </button>
          </div>

          {/* Product Form */}
          {showForm && (
            <div className="card p-6 mb-6 fade-in">
              <h3 className="font-bold text-slate-800 mb-4">{editProduct ? 'Edit Product' : 'New Product'}</h3>
              <form onSubmit={handleProductSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input" placeholder="Fresh Bananas" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input h-20 resize-none" placeholder="Product description..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
                    <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input" placeholder="99.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discount Price (₹)</label>
                    <input type="number" step="0.01" min="0" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} className="input" placeholder="Leave empty if no discount" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock *</label>
                    <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className="input" placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                    <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input" placeholder="1 kg, 500g, 6 pcs..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required className="input">
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                    <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input" placeholder="https://..." />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-green-600 w-4 h-4" />
                    <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active (visible to customers)</label>
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary">
                    <Check size={16} /> {editProduct ? (updateMutation.isPending ? 'Saving…' : 'Save Changes') : (createMutation.isPending ? 'Creating…' : 'Create Product')}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditProduct(null) }} className="btn-secondary">
                    <X size={16} /> Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products table */}
          {productsLoading ? <Loader /> : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>{['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image_url || ''} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                              onError={(e) => { e.target.style.display = 'none' }} />
                            <span className="font-medium text-slate-800 max-w-[160px] truncate">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{p.category?.name}</td>
                        <td className="px-5 py-3">
                          <span className="font-semibold text-green-700">₹{p.discount_price || p.price}</span>
                          {p.discount_price && <span className="text-slate-400 text-xs line-through ml-1">₹{p.price}</span>}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`font-semibold ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-orange-500' : 'text-slate-700'}`}>{p.stock}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`badge ${p.is_active ? 'badge-green' : 'badge-slate'}`}>{p.is_active ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                            <button onClick={() => { if (window.confirm('Delete this product?')) deleteMutation.mutate(p.id) }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS ── */}
      {tab === 'orders' && (
        ordersLoading ? <Loader /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>{['Order ID', 'Customer', 'Amount', 'Status', 'Date', 'Update Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-slate-400">#{o.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-5 py-3 text-slate-600">{o.address_line1.slice(0, 20)}…</td>
                      <td className="px-5 py-3 font-bold text-slate-800">₹{o.total_amount}</td>
                      <td className="px-5 py-3"><span className={`badge ${STATUS_COLORS[o.status] || 'badge-slate'} capitalize`}>{o.status}</span></td>
                      <td className="px-5 py-3 text-slate-400">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="px-5 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => orderStatusMutation.mutate({ id: o.id, status: e.target.value })}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
                        >
                          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>{['Name', 'Email', 'Phone', 'Status', 'Joined'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 px-5 py-3 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-800">{u.name}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3 text-slate-500">{u.phone || '—'}</td>
                    <td className="px-5 py-3"><span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-5 py-3 text-slate-400">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

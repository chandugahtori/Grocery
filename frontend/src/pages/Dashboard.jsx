import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Package, Edit2, Check, X, ChevronRight } from 'lucide-react'
import { getOrders } from '../api/orderService'
import { getProfile, updateProfile } from '../api/authService'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  pending: 'badge-slate', confirmed: 'badge-blue', processing: 'badge-blue',
  shipped: 'badge-orange', delivered: 'badge-green', cancelled: 'badge-red',
}

export default function Dashboard() {
  const [tab, setTab] = useState('orders')
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' })
  const queryClient = useQueryClient()

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    onSuccess: (data) => setProfileForm({ name: data.data.name, phone: data.data.phone || '' }),
  })

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile'])
      setEditing(false)
      toast.success('Profile updated!')
    },
    onError: () => toast.error('Failed to update profile'),
  })

  const orders = ordersData?.data || []
  const profile = profileData?.data

  if (ordersLoading || profileLoading) return <div className="page-container"><Loader /></div>

  return (
    <div className="page-container fade-in">
      <h1 className="text-2xl font-extrabold text-slate-800 mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {[['orders', Package, 'My Orders'], ['profile', User, 'Profile']].map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === key ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-semibold text-slate-700">No orders yet</p>
              <p className="text-sm text-slate-400 mt-1">Your order history will appear here</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="text-xs text-slate-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${STATUS_COLORS[order.status] || 'badge-slate'} capitalize mb-1`}>{order.status}</span>
                    <p className="font-bold text-slate-800 text-sm">₹{order.total_amount}</p>
                  </div>
                </div>
                <div className="border-t border-slate-50 pt-3">
                  <p className="text-xs text-slate-400 mb-1.5">Items</p>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-slate-600 truncate mr-2">{item.product_name} × {item.quantity}</span>
                        <span className="text-slate-500 shrink-0">₹{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 truncate">📍 {order.address_line1}, {order.city}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && profile && (
        <div className="max-w-md">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">{profile.name}</h2>
                <p className="text-sm text-slate-400">{profile.email}</p>
                <span className={`badge mt-1 ${profile.role === 'admin' ? 'badge-orange' : 'badge-green'} capitalize`}>{profile.role}</span>
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+91 98765 43210" className="input" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateMutation.mutate(profileForm)} disabled={updateMutation.isPending} className="btn-primary flex-1">
                    <Check size={16} /> {updateMutation.isPending ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary flex-1">
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[['Email', profile.email], ['Phone', profile.phone || '—'], ['Member since', new Date(profile.created_at).toLocaleDateString('en-IN')]].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className="text-sm font-semibold text-slate-700">{value}</span>
                  </div>
                ))}
                <button onClick={() => { setProfileForm({ name: profile.name, phone: profile.phone || '' }); setEditing(true) }} className="btn-secondary w-full mt-2">
                  <Edit2 size={16} /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

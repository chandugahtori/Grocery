import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Package, Edit2, Check, X } from 'lucide-react'
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

  const { data: ordersData, isLoading: ordersLoading } = useQuery({ queryKey: ['orders'], queryFn: getOrders })
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'], queryFn: getProfile,
    onSuccess: (data) => setProfileForm({ name: data.data.name, phone: data.data.phone || '' }),
  })
  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => { queryClient.invalidateQueries(['profile']); setEditing(false); toast.success('Profile updated!') },
    onError: () => toast.error('Failed to update profile'),
  })

  const orders = ordersData?.data || []
  const profile = profileData?.data

  if (ordersLoading || profileLoading) return <div className="page-container"><Loader /></div>

  return (
    <div className="page-container fade-in">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '24px' }}>My Account</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        {[['orders', Package, 'My Orders'], ['profile', User, 'Profile']].map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
              background: tab === key ? '#fff' : 'transparent',
              color: tab === key ? '#15803d' : '#64748b',
              boxShadow: tab === key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📦</p>
              <p style={{ fontWeight: 600, color: '#334155' }}>No orders yet</p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px' }}>Your order history will appear here</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '2px' }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${STATUS_COLORS[order.status] || 'badge-slate'} capitalize`}>{order.status}</span>
                    <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem', marginTop: '4px' }}>₹{order.total_amount}</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #f8fafc', paddingTop: '12px' }}>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>Items</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {order.items.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>{item.product_name} × {item.quantity}</span>
                        <span style={{ color: '#64748b', flexShrink: 0 }}>₹{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    📍 {order.address_line1}, {order.city}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Profile Tab */}
      {tab === 'profile' && profile && (
        <div style={{ maxWidth: '480px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #4ade80, #10b981)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 700, flexShrink: 0 }}>
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>{profile.name}</h2>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{profile.email}</p>
                <span className={`badge mt-1 ${profile.role === 'admin' ? 'badge-orange' : 'badge-green'} capitalize`}>{profile.role}</span>
              </div>
            </div>

            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Name</label>
                  <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>Phone</label>
                  <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+91 98765 43210" className="input" />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => updateMutation.mutate(profileForm)} disabled={updateMutation.isPending} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    <Check size={16} /> {updateMutation.isPending ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[['Email', profile.email], ['Phone', profile.phone || '—'], ['Member since', new Date(profile.created_at).toLocaleDateString('en-IN')]].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>{value}</span>
                  </div>
                ))}
                <button onClick={() => { setProfileForm({ name: profile.name, phone: profile.phone || '' }); setEditing(true) }}
                  className="btn-secondary" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>
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

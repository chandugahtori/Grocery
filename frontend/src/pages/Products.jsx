import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { getProducts, getCategories, searchProducts } from '../api/productService'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [localQ, setLocalQ] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  })
  const categories = catData?.data || []

  const fetchFn = q
    ? () => searchProducts({ q, page, size: 16 })
    : () => getProducts({ category, page, size: 16 })

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', q, category, page],
    queryFn: fetchFn,
    keepPreviousData: true,
  })

  const products = data?.data?.items || []
  const total = data?.data?.total || 0
  const pages = data?.data?.pages || 0

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setSearchParams(localQ ? { q: localQ } : {})
  }

  const handleCategory = (slug) => {
    setPage(1)
    setLocalQ('')
    setSearchParams(slug ? { category: slug } : {})
  }

  const clearFilters = () => {
    setLocalQ('')
    setPage(1)
    setSearchParams({})
  }

  return (
    <div className="page-container fade-in">
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Sidebar — categories */}
        <aside style={{ width: '220px', flexShrink: 0 }}>
          <div className="card" style={{ padding: '20px', position: 'sticky', top: '96px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Categories</h3>
              {(q || category) && (
                <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>
                <button
                  onClick={() => handleCategory('')}
                  style={{
                    width: '100%', textAlign: 'left', fontSize: '0.875rem',
                    padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: !category && !q ? '#f0fdf4' : 'transparent',
                    color: !category && !q ? '#15803d' : '#475569',
                    fontWeight: !category && !q ? 600 : 400,
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { if (category || q) e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { if (category || q) e.currentTarget.style.background = 'transparent' }}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategory(cat.slug)}
                    style={{
                      width: '100%', textAlign: 'left', fontSize: '0.875rem',
                      padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: category === cat.slug ? '#f0fdf4' : 'transparent',
                      color: category === cat.slug ? '#15803d' : '#475569',
                      fontWeight: category === cat.slug ? 600 : 400,
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { if (category !== cat.slug) e.currentTarget.style.background = '#f8fafc' }}
                    onMouseLeave={e => { if (category !== cat.slug) e.currentTarget.style.background = 'transparent' }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', zIndex: 1 }} />
              <input
                type="text"
                placeholder="Search products…"
                value={localQ}
                onChange={(e) => setLocalQ(e.target.value)}
                className="input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
            <button type="submit" className="btn-primary">Search</button>
          </form>

          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500">
              {q ? `Results for "${q}"` : category ? `Category: ${category.replace('-', ' ')}` : 'All Products'}
              <span className="ml-1 text-slate-400">({total} items)</span>
            </p>
            {isFetching && <span className="text-xs text-green-600 animate-pulse">Updating…</span>}
          </div>

          {/* Grid */}
          {isLoading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-lg font-semibold text-slate-700">No products found</p>
              <p className="text-sm text-slate-400 mt-1">Try a different search or category</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Browse All</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-ghost disabled:opacity-40 px-4"
                  >
                    ← Prev
                  </button>
                  <span className="flex items-center px-4 text-sm font-semibold text-slate-600">
                    Page {page} of {pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                    className="btn-ghost disabled:opacity-40 px-4"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

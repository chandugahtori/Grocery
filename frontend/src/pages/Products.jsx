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
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar — categories */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="card p-4 sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Categories</h3>
              {(q || category) && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                  <X size={12} /> Clear
                </button>
              )}
            </div>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleCategory('')}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-200 ${!category && !q ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  All Products
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategory(cat.slug)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-200 ${category === cat.slug ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
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
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products…"
                value={localQ}
                onChange={(e) => setLocalQ(e.target.value)}
                className="input pl-9"
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

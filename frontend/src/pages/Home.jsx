import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Truck, Shield, Clock, Leaf } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import { getProducts, getCategories } from '../api/productService'

const HERO_CATEGORIES = [
  { name: 'Fruits & Veg', slug: 'fruits-vegetables', emoji: '🥦', color: 'from-green-400 to-emerald-500' },
  { name: 'Dairy & Eggs', slug: 'dairy-eggs', emoji: '🥛', color: 'from-blue-400 to-cyan-500' },
  { name: 'Beverages', slug: 'beverages', emoji: '🧃', color: 'from-orange-400 to-amber-500' },
  { name: 'Snacks', slug: 'snacks-namkeen', emoji: '🍿', color: 'from-purple-400 to-violet-500' },
  { name: 'Bakery', slug: 'bakery-bread', emoji: '🍞', color: 'from-yellow-400 to-orange-500' },
  { name: 'Spices', slug: 'spices-masala', emoji: '🌶', color: 'from-red-400 to-rose-500' },
]

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹500', color: 'text-green-600 bg-green-50' },
  { icon: Shield, title: 'Quality Assured', desc: 'Freshness guaranteed', color: 'text-blue-600 bg-blue-50' },
  { icon: Clock, title: 'Express Delivery', desc: 'Delivered in 30 mins', color: 'text-orange-600 bg-orange-50' },
  { icon: Leaf, title: '100% Organic', desc: 'Sourced from farms', color: 'text-emerald-600 bg-emerald-50' },
]

export default function Home() {
  const navigate = useNavigate()

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['products-featured'],
    queryFn: () => getProducts({ size: 8 }),
  })

  const products = featuredData?.data?.items || []

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              🚀 Now delivering in 30 minutes!
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
              Fresh Groceries<br />
              <span className="text-green-200">Delivered Fast</span>
            </h1>
            <p className="text-lg text-green-100 mb-8 max-w-lg">
              Shop from 500+ fresh products. Quality produce, pantry essentials, and more — delivered right to your door.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 active:scale-95 transition-all duration-200 shadow-lg"
              >
                Shop Now <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 active:scale-95 transition-all duration-200 border border-white/30"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{title}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Shop by Category</h2>
          <Link to="/products" className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {HERO_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white border border-slate-100"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm`}>
                {cat.emoji}
              </div>
              <span className="text-xs font-semibold text-slate-700 text-center leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-container pt-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Featured Products</h2>
          <Link to="/products" className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1">
            See all <ArrowRight size={15} />
          </Link>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="page-container pt-0">
        <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2">First Order? Get 20% Off!</h3>
            <p className="text-orange-100">Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded-lg">NAVIX20</span> at checkout</p>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 active:scale-95 transition-all duration-200 whitespace-nowrap shadow-lg"
          >
            Claim Offer
          </button>
        </div>
      </section>
    </div>
  )
}

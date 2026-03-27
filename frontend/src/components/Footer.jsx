import { Link } from 'react-router-dom'
import { Leaf, Github, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">Navix</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Fresh groceries delivered to your doorstep. Quality products, great prices, lightning-fast delivery.
            </p>
            <div className="flex gap-3 mt-4">
              {[Github, Twitter, Instagram, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['All Products', '/products'],
                ['Fruits & Vegetables', '/products?category=fruits-vegetables'],
                ['Dairy & Eggs', '/products?category=dairy-eggs'],
                ['Beverages', '/products?category=beverages'],
                ['Snacks', '/products?category=snacks-namkeen'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-green-400 transition-colors duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Login', '/login'],
                ['Register', '/register'],
                ['My Orders', '/dashboard'],
                ['My Profile', '/dashboard'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-green-400 transition-colors duration-200">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 Navix. All rights reserved.</p>
          <p className="text-xs text-slate-500">Built with ❤️ for fresh grocery delivery</p>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { Leaf, Github, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: "https://github.com/chandugahtori", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/not_available", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/chandugahtori", label: "Instagram" },
    { icon: Mail, href: "mailto:chandu2004gahtori@gmail.com", label: "Email" },
  ]

  return (
    <footer style={{ background: '#0f172a', color: '#cbd5e1', marginTop: '64px' }}>
      <div className="section-container" style={{ paddingTop: '64px', paddingBottom: '64px' }}>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #22c55e, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Leaf size={18} color="#fff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Navix</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.7, maxWidth: '260px', marginBottom: '24px' }}>
              Fresh groceries delivered to your doorstep. Quality products, great prices, lightning-fast delivery.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target={social.icon === Mail ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{ width: '38px', height: '38px', background: '#1e293b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', textDecoration: 'none', color: '#94a3b8' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#1e293b'}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>Shop</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['All Products', '/products'],
                ['Fruits & Vegetables', '/products?category=fruits-vegetables'],
                ['Dairy & Eggs', '/products?category=dairy-eggs'],
                ['Beverages', '/products?category=beverages'],
                ['Snacks', '/products?category=snacks-namkeen'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>Account</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                ['Login', '/login'],
                ['Register', '/register'],
                ['My Orders', '/dashboard'],
                ['My Profile', '/dashboard'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #1e293b', marginTop: '48px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '0.75rem', color: '#475569' }}>© 2026 Navix. All rights reserved.</p>
          <p style={{ fontSize: '0.75rem', color: '#475569' }}>Built with ❤️ for fresh grocery delivery</p>
        </div>

      </div>
    </footer>
  )
}
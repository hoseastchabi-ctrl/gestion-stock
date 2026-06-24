import { useEffect, useState } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import {
  Archive, Repeat, UserCircle2, Package, User, Plus, LayoutDashboard, History,
} from 'lucide-react'
import WelcomeModal from '../components/WelcomeModal'
import { getUser } from '../api/auth'

const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/catalog', label: 'Catalogue', icon: Archive },
  { to: '/movement', label: 'Mouvements', icon: Repeat },
  { to: '/history', label: 'Historique', icon: History },
  { to: '/profile', label: 'Mon Profil', icon: UserCircle2 },
]

const mobileNavItems = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/catalog', label: 'Produits', icon: Archive },
  { to: '/movement', label: 'Flux', icon: Repeat },
  { to: '/profile', label: 'Profil', icon: UserCircle2 },
]

export default function DashboardLayout() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeType, setWelcomeType] = useState('login')
  const [photoUrl, setPhotoUrl] = useState(null)
  const userName = localStorage.getItem('stockme_user_name') || 'Gérant'

  useEffect(() => {
    const type = localStorage.getItem('stockme_welcome_type')
    if (type) {
      setWelcomeType(type)
      setShowWelcome(true)
      localStorage.removeItem('stockme_welcome_type')
    }

    getUser()
      .then((user) => setPhotoUrl(user.profile_photo_url ?? null))
      .catch(() => setPhotoUrl(null))
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      {showWelcome && (
        <WelcomeModal name={userName} type={welcomeType} onClose={() => setShowWelcome(false)} />
      )}

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-14 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-2">
          <Package className="text-primary" size={24} />
          <h1 className="text-lg font-bold text-primary">StockMe</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-6 mr-2">
            {navItems.slice(0, 3).map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-xs font-bold transition-colors ${
                    isActive ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors overflow-hidden"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <User size={18} />
            )}
          </Link>
        </div>
      </header>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 py-6 bg-surface border-r border-outline-variant z-40 mt-14 h-[calc(100vh-3.5rem)]">
        <div className="px-6 mb-8 mt-4">
          <p className="font-bold text-primary">Bonjour, {userName}</p>
          <p className="text-sm text-on-surface-variant">StockMe PWA</p>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 mx-2 px-4 py-3 rounded-full transition-colors ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-base">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-6">
          <p className="text-on-surface-variant opacity-50 text-[10px]">v1.0.4 • STOCKME CORE</p>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="min-h-screen px-4 md:px-8 pt-20 pb-24 md:pb-8 md:ml-64">
        <Outlet />
      </main>

      {/* BottomNavBar mobile */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-16 bg-surface border-t border-outline-variant shadow-lg md:hidden">
        {mobileNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-4 py-1 rounded-full transition-transform active:scale-95 ${
                isActive ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-[11px] font-semibold mt-0.5">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* FAB mobile */}
      <button className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-secondary text-white rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform">
        <Plus size={28} />
      </button>
    </div>
  )
}
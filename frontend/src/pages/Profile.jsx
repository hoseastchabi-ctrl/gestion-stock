import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  UserCircle2, Mail, ShieldCheck, Building2, Save, LogOut, Pencil, BadgeCheck,
} from 'lucide-react'
import { getUser, logout } from '../api/auth'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const data = await getUser()
        setUser(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return <p className="text-sm text-on-surface-variant">Chargement du profil...</p>
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* En-tête profil */}
      <section className="flex flex-col items-center py-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-surface-container flex items-center justify-center">
  {user?.profile_photo_url ? (
    <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
  ) : (
    <UserCircle2 className="text-outline" size={64} />
  )}
</div>
          <Link
            to="/profile/edit"
            className="absolute bottom-1 right-1 bg-secondary text-white p-2 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform"
          >
            <Pencil size={18} />
          </Link>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-on-surface">{user?.name}</h2>
          <p className="text-on-surface-variant mt-1">{user?.role ?? 'Administrateur Entrepôt'}</p>
          <span className="inline-flex items-center mt-3 px-3 py-1 bg-secondary-fixed text-on-secondary-variant text-xs font-bold rounded-full uppercase tracking-wider">
            {user?.access_level ?? 'Accès Total'}
          </span>
        </div>
      </section>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <UserCircle2 className="text-secondary" size={20} />
            <h3 className="text-lg font-semibold text-on-surface">Compte</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Email</label>
              <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                <p className="flex items-center gap-2"><Mail size={16} className="text-outline" /> {user?.email}</p>
                <BadgeCheck className="text-secondary" size={18} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Mot de passe</label>
              <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                <p>••••••••••••</p>
                <Link to="/profile/edit" className="text-secondary text-sm font-bold hover:underline">
                  Changer
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-outline-variant p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="text-secondary" size={20} />
            <h3 className="text-lg font-semibold text-on-surface">Entreprise</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Nom de l'entreprise</label>
              <div className="p-3 bg-surface-container rounded-lg">
                <p>{user?.company ?? '—'}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1">Adresse</label>
              <div className="p-3 bg-surface-container rounded-lg">
                <p>{user?.address ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 mb-12">
        <Link
          to="/profile/edit"
          className="w-full bg-secondary text-white h-12 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] transition-all"
        >
          <Save size={20} />
          Modifier le profil
        </Link>
        <button
          onClick={handleLogout}
          className="w-full border border-error text-error h-12 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-error-container hover:text-on-error-container transition-colors active:scale-[0.99]"
        >
          <LogOut size={20} />
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
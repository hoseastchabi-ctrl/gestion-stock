import { useState } from 'react'
import { Package, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { login } from '../api/auth'
import { Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

async function handleSubmit(e) {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    await login(email, password)
    window.location.href = '/dashboard'
  } catch (err) {
    setError('Identifiants incorrects. Veuillez réessayer.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="relative min-h-screen bg-surface flex flex-col">
      {/* Fond décoratif */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-fixed blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-secondary-fixed-dim blur-[100px]" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">

          {/* En-tête */}
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-primary" size={36} strokeWidth={2} />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                StockMe
              </h1>
            </div>
            <p className="text-base text-on-surface-variant max-w-[280px]">
              Gestion d'inventaire professionnelle pour les experts en logistique.
            </p>
          </div>

          {/* Carte de connexion */}
          <div className="bg-surface-lowest border border-outline-variant p-6 md:p-8 rounded-xl shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-semibold tracking-wide text-on-surface-variant">
                  ADRESSE EMAIL
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 text-outline" size={20} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@entreprise.com"
                    className="w-full h-12 pl-10 pr-4 bg-surface border border-outline-variant rounded text-base placeholder:text-outline focus:outline-none focus:border-secondary transition-all"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-semibold tracking-wide text-on-surface-variant">
                  MOT DE PASSE
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-outline" size={20} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-10 pr-12 bg-surface border border-outline-variant rounded text-base placeholder:text-outline focus:outline-none focus:border-secondary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 text-on-surface-variant hover:text-primary transition-colors h-12 flex items-center justify-center"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Mot de passe oublié */}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs font-semibold text-secondary hover:text-on-secondary-variant underline-offset-4 hover:underline">
  Mot de passe oublié ?
</Link>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-white font-semibold text-base rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
            <p className="text-center text-sm text-on-surface-variant mt-6">
  Pas encore de compte ?{' '}
  <Link to="/register" className="text-secondary font-bold hover:underline">
    S'inscrire
  </Link>
</p>
          </div>

          {/* Pied de page */}
          <div className="text-center pt-4">
            <p className="text-sm text-outline">
              Propulsé par <span className="font-bold text-on-surface-variant">StockMe Enterprise</span> v1.0.4
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="#" className="text-xs font-semibold text-outline hover:text-on-surface transition-colors">Assistance</a>
              <span className="text-outline-variant">•</span>
              <a href="#" className="text-xs font-semibold text-outline hover:text-on-surface transition-colors">Confidentialité</a>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
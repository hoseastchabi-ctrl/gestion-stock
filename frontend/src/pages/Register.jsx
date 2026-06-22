import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, User, Mail, Lock, LockKeyhole, Eye, EyeOff,
  Store, ShieldCheck, CloudCheck, ArrowRight, Loader2, CheckCircle2
} from 'lucide-react'
import { register } from '../api/auth'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    company: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

 async function handleSubmit(e) {
  e.preventDefault()
  setError('')
  setFieldErrors({})

  if (!agreed) {
    setError('Vous devez accepter les conditions d\'utilisation.')
    return
  }

  setLoading(true)
  try {
    await register(form)
    window.location.href = '/dashboard'
  } catch (err) {
    if (err.response?.status === 422) {
      setFieldErrors(err.response.data.errors || {})
      setError('Veuillez corriger les champs en erreur.')
    } else {
      setError('Une erreur est survenue. Veuillez réessayer.')
    }
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center">

      {/* En-tête */}
      <header className="w-full h-44 md:h-56 flex flex-col items-center justify-center text-center px-4">
        <div className="bg-primary text-white w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center shadow-lg mb-2">
          <Package size={36} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">StockMe</h1>
        <p className="text-sm text-on-surface-variant max-w-[280px] mt-1">
          Système de gestion d'inventaire haute performance
        </p>
      </header>

      {/* Conteneur principal */}
      <main className="w-full max-w-lg px-4 md:px-8 -mt-6 pb-6 z-10">
        <div className="bg-white rounded-xl shadow-sm border border-outline-variant p-6 md:p-10">

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-on-surface">Créer un compte</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Rejoignez StockMe pour optimiser votre logistique.
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Section Informations personnelles */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <User size={18} />
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Informations personnelles
                </h3>
              </div>

              <Field
                label="Nom complet"
                icon={<User size={18} />}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                error={fieldErrors.name}
              />

              <Field
                label="Adresse e-mail"
                icon={<Mail size={18} />}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jean.dupont@entreprise.fr"
                error={fieldErrors.email}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Mot de passe"
                  icon={<Lock size={18} />}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={fieldErrors.password}
                  toggle={{
                    show: showPassword,
                    onToggle: () => setShowPassword((v) => !v),
                  }}
                />
                <Field
                  label="Confirmation"
                  icon={<LockKeyhole size={18} />}
                  name="password_confirmation"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={handleChange}
                  placeholder="••••••••"
                  toggle={{
                    show: showConfirm,
                    onToggle: () => setShowConfirm((v) => !v),
                  }}
                />
              </div>
            </div>

            <hr className="border-outline-variant my-6" />

            {/* Section Entreprise */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Store size={18} />
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  Informations d'entreprise
                </h3>
              </div>

              <Field
                label="Nom de l'entreprise / boutique"
                icon={<Store size={18} />}
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Entrepôt LogiPro S.A."
                error={fieldErrors.company}
              />
            </div>

            {/* Conditions + bouton */}
            <div className="pt-4 flex flex-col gap-4">
              <label className="flex items-start gap-3 px-1 text-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 text-secondary border-outline-variant rounded focus:ring-secondary"
                />
                <span>
                  J'accepte les <a href="#" className="text-secondary font-semibold hover:underline">conditions d'utilisation</a>{' '}
                  et la <a href="#" className="text-secondary font-semibold hover:underline">politique de confidentialité</a>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-12 bg-primary text-white font-semibold text-base rounded-lg shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {success ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>Compte créé</span>
                  </>
                ) : loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>S'inscrire</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-outline-variant text-center">
            <p className="text-sm text-on-surface-variant">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-secondary font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Badges de confiance */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <TrustBadge icon={<ShieldCheck size={22} />} title="Sécurisé" subtitle="Chiffrement AES-256" />
          <TrustBadge icon={<CloudCheck size={22} />} title="Cloud Sync" subtitle="Accès en temps réel" />
        </div>
      </main>

      <footer className="mt-auto py-6">
        <p className="text-xs text-on-surface-variant/60">
          © 2024 StockMe Logistique SAS. Tous droits réservés.
        </p>
      </footer>
    </div>
  )
}

function Field({ label, icon, error, toggle, ...inputProps }) {
  return (
    <div>
      <label htmlFor={inputProps.name} className="block text-xs font-semibold text-on-surface-variant mb-1 ml-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline">
          {icon}
        </span>
        <input
          id={inputProps.name}
          required
          className={`w-full h-12 pl-12 ${toggle ? 'pr-12' : 'pr-4'} bg-surface border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all ${
            error ? 'border-red-400' : 'border-outline-variant'
          }`}
          {...inputProps}
        />
        {toggle && (
          <button
            type="button"
            onClick={toggle.onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors p-1"
          >
            {toggle.show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1 ml-1">{error[0]}</p>}
    </div>
  )
}

function TrustBadge({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center p-4 bg-surface-container rounded-xl text-center">
      <span className="text-primary mb-2">{icon}</span>
      <span className="text-xs font-semibold text-primary">{title}</span>
      <span className="text-[10px] text-on-surface-variant leading-tight">{subtitle}</span>
    </div>
  )
}
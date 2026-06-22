import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { forgotPassword } from '../api/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError('Impossible d\'envoyer le lien. Vérifiez votre adresse email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-surface flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-fixed blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] rounded-full bg-secondary-fixed-dim blur-[100px]" />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-6">

          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-primary" size={36} />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">StockMe</h1>
            </div>
            <p className="text-base text-on-surface-variant max-w-[280px]">
              Réinitialisez l'accès à votre compte professionnel.
            </p>
          </div>

          <div className="bg-surface-lowest border border-outline-variant p-6 md:p-8 rounded-xl shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center">
                  <CheckCircle2 className="text-secondary" size={28} />
                </div>
                <h2 className="text-lg font-bold text-primary">Email envoyé</h2>
                <p className="text-sm text-on-surface-variant">
                  Si un compte existe avec l'adresse <strong>{email}</strong>, un lien de réinitialisation vient d'être envoyé.
                </p>
                <Link to="/login" className="text-secondary font-semibold text-sm hover:underline mt-2">
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <h2 className="text-xl font-semibold text-on-surface mb-1">Mot de passe oublié</h2>
                  <p className="text-sm text-on-surface-variant">
                    Entrez votre adresse email, nous vous envoyons un lien de réinitialisation.
                  </p>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                    {error}
                  </div>
                )}

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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary text-white font-semibold text-base rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span>Envoyer le lien</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  <ArrowLeft size={16} />
                  Retour à la connexion
                </Link>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
import { CheckCircle2, X } from 'lucide-react'

export default function WelcomeModal({ name, type, onClose }) {
  const isRegister = type === 'register'

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center">
            <CheckCircle2 className="text-secondary" size={28} />
          </div>
          <h3 className="text-lg font-bold text-primary">
            Bienvenue, {name} !
          </h3>
          <p className="text-sm text-on-surface-variant">
            {isRegister
              ? 'Votre compte StockMe a été créé avec succès. Vous êtes prêt à gérer votre inventaire.'
              : 'Vous êtes connecté à votre espace StockMe.'}
          </p>
          <button
            onClick={onClose}
            className="w-full h-11 mt-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-container transition-all"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  )
}
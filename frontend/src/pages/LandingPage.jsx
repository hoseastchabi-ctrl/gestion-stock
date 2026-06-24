import { useNavigate, Link } from 'react-router-dom'
import {
  Package,
  Bell,
  Activity,
  Smartphone,
  ArrowRight,
  Zap,
  Globe,
  Share2,
  Menu,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { useState } from 'react'

const features = [
  {
    icon: Activity,
    title: 'Suivi en temps réel',
    description:
      'Visualisez l\'état de votre inventaire instantanément, avec des indicateurs clairs et à jour.',
    accent: 'bg-secondary-container text-on-secondary-container',
  },
  {
    icon: Bell,
    title: 'Alertes de stock faible',
    description:
      'Définissez des seuils critiques et recevez des notifications avant toute rupture.',
    accent: 'bg-error-container text-on-error-container',
  },
  {
    icon: Package,
    title: 'Historique complet des mouvements',
    description:
      'Tracez chaque entrée et sortie pour une traçabilité totale de vos opérations logistiques.',
    accent: 'bg-primary-fixed text-on-secondary-variant',
  },
  {
    icon: Smartphone,
    title: 'Mode PWA / Hors-ligne',
    description:
      'Accédez à StockMe depuis n\'importe quel appareil, même sans connexion internet.',
    accent: 'bg-surface-container text-primary',
  },
]

const footerProductLinks = [
  { label: 'Accueil', href: '#' },
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'Démo', href: '#demo' },
]

const footerSupportLinks = [
  { label: 'Contact', href: '#' },
  { label: 'Documentation', href: '#guide' },
  { label: 'Confidentialité', href: '#' },
  { label: 'Statut', href: '#' },
]

function Logo({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Package className="text-primary" size={28} strokeWidth={2} />
      <span className="text-xl font-bold tracking-tight text-primary">StockMe</span>
    </div>
  )
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xs md:max-w-sm">
      <div className="rounded-[2.5rem] bg-primary p-3 shadow-xl">
        <div className="overflow-hidden rounded-[2rem] bg-surface-lowest">
          <div className="flex items-center justify-between bg-primary px-4 py-3">
            <div className="flex items-center gap-2">
              <Package className="text-white" size={16} />
              <span className="text-xs font-bold text-white">StockMe</span>
            </div>
            <div className="h-2 w-2 rounded-full bg-secondary-container" />
          </div>
          <div className="space-y-3 p-4">
            <div className="rounded-lg bg-surface-container px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Valeur du stock
              </p>
              <p className="text-lg font-black text-primary">124 580 FCFA</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-outline-variant bg-surface-lowest p-2">
                <p className="text-[9px] text-on-surface-variant">Produits</p>
                <p className="text-sm font-bold text-primary">48</p>
              </div>
              <div className="rounded-lg border border-outline-variant bg-surface-lowest p-2">
                <p className="text-[9px] text-on-surface-variant">Alertes</p>
                <p className="text-sm font-bold text-error">3</p>
              </div>
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-lowest p-3">
              <p className="mb-2 text-[9px] font-bold uppercase text-on-surface-variant">
                Mouvements récents
              </p>
              <div className="flex items-end justify-between gap-1 h-16">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-secondary-container"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LandingHeader({ onDemo, navOpen, setNavOpen }) {
  const navLinks = [
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Tarifs', href: '#tarifs' },
    { label: 'À propos', href: '#about' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant bg-surface-lowest/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" aria-label="StockMe accueil">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDemo}
            className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-container hover:scale-105 active:scale-95 sm:inline-flex"
          >
            Accéder à l&apos;application
          </button>

          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            className="inline-flex rounded-lg p-2 text-primary md:hidden"
            aria-label={navOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {navOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {navOpen && (
        <div className="border-t border-outline-variant bg-surface-lowest px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setNavOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-primary"
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setNavOpen(false)
                onDemo()
              }}
              className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white"
            >
              Connexion
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

function HeroSection({ onDemo, onGuide }) {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 md:px-8 md:pb-24 md:pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
        <div className="absolute -top-[20%] left-1/2 h-[60%] w-[80%] -translate-x-1/2 rounded-full bg-primary-fixed blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[5%] h-[40%] w-[40%] rounded-full bg-secondary-fixed-dim blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-on-secondary-variant">
          <Sparkles size={12} />
          Solution logistique pro
        </span>

        <h1 className="text-3xl font-black leading-tight tracking-tight text-primary md:text-5xl lg:text-6xl">
          Gérez votre stock en un clin d&apos;œil
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
          StockMe est l&apos;outil de gestion d&apos;inventaire professionnel conçu pour les
          experts en logistique. Suivez, analysez et optimisez vos flux en toute simplicité.
        </p>

        <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-lg">
          <button
            type="button"
            onClick={onDemo}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-secondary text-base font-semibold text-white shadow-sm transition-all hover:bg-secondary-container hover:scale-105 active:scale-95"
          >
            Lancer la Démo gratuite
            <ArrowRight size={20} />
          </button>
          <button
            type="button"
            onClick={onGuide}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-lowest text-base font-semibold text-primary shadow-sm transition-all hover:bg-surface-container hover:scale-105 active:scale-95"
          >
            <BookOpen size={18} />
            Voir le guide
          </button>
        </div>

        <div className="mt-14 md:mt-20">
          <PhoneMockup />
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 bg-surface-lowest px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2 className="text-2xl font-black text-primary md:text-4xl">Fonctionnalités Clés</h2>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-base">
            Tout ce dont vous avez besoin pour piloter votre inventaire au quotidien, dans une
            interface claire et performante.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-2">
          {features.map(({ icon: Icon, title, description, accent }) => (
            <article
              key={title}
              className="group flex gap-4 rounded-xl border border-outline-variant bg-surface-lowest p-5 shadow-sm transition-all hover:border-secondary/30 hover:shadow-md md:p-6"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
                <Icon size={22} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary md:text-lg">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl rounded-2xl border border-outline-variant bg-surface-lowest p-8 text-center shadow-sm md:p-12">
        <h2 className="text-xl font-black text-primary md:text-3xl">À propos de StockMe</h2>
        <p className="mt-4 text-sm leading-relaxed text-on-surface-variant md:text-base">
          StockMe est une PWA moderne pensée pour les PME et les équipes logistiques qui veulent
          un outil fiable, rapide et accessible partout — sans installation complexe.
        </p>
      </div>
    </section>
  )
}

function TarifsSection() {
  return (
    <section id="tarifs" className="scroll-mt-20 bg-surface-container/50 px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-xl font-black text-primary md:text-3xl">Tarifs</h2>
        <p className="mt-3 text-sm text-on-surface-variant md:text-base">
          Commencez gratuitement avec la démo. Aucune carte bancaire requise.
        </p>
        <div className="mt-8 rounded-2xl border border-outline-variant bg-surface-lowest p-8 shadow-sm">
          <p className="text-4xl font-black text-primary">0 FCFA</p>
          <p className="mt-1 text-sm font-semibold text-on-surface-variant">Accès démo illimité</p>
          <ul className="mt-6 space-y-2 text-left text-sm text-on-surface-variant">
            <li>• Catalogue produits complet</li>
            <li>• Mouvements de stock & historique</li>
            <li>• Tableau de bord en temps réel</li>
            <li>• Mode PWA installable</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function CtaSection({ onDemo }) {
  return (
    <section
      id="demo"
      className="scroll-mt-20 bg-gradient-to-b from-primary via-tertiary-container to-[#0f3d2e] px-4 py-16 md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-black text-white md:text-4xl">
          Prêt à optimiser votre stock ?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
          Explorez l&apos;environnement de démonstration et découvrez comment StockMe simplifie
          votre gestion logistique dès aujourd&apos;hui.
        </p>
        <button
          type="button"
          onClick={onDemo}
          className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-surface-lowest px-8 text-base font-semibold text-secondary shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Zap size={20} className="text-secondary" />
          Accéder à la démo
        </button>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
          Aucune installation requise
        </p>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t border-outline-variant bg-surface-lowest px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-surface-variant">
              La solution professionnelle de gestion d&apos;inventaire pour les experts en
              logistique et supply chain.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Produit</h4>
            <ul className="mt-4 space-y-2">
              {footerProductLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-on-surface-variant transition-colors hover:text-secondary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Support</h4>
            <ul className="mt-4 space-y-2">
              {footerSupportLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-on-surface-variant transition-colors hover:text-secondary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-6 sm:flex-row">
          <p className="text-xs text-outline">© {new Date().getFullYear()} StockMe PWA</p>
          <div className="flex items-center gap-4 text-outline">
            <button type="button" aria-label="Langue" className="transition-colors hover:text-primary">
              <Globe size={18} />
            </button>
            <button type="button" aria-label="Partager" className="transition-colors hover:text-primary">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false)

  function goToApp() {
    const token = localStorage.getItem('stockme_token')
    navigate(token ? '/dashboard' : '/login')
  }

  function scrollToGuide() {
    document.getElementById('guide')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-surface">
      <LandingHeader onDemo={goToApp} navOpen={navOpen} setNavOpen={setNavOpen} />
      <main>
        <HeroSection onDemo={goToApp} onGuide={scrollToGuide} />
        <FeaturesSection />
        <section id="guide" className="scroll-mt-20 px-4 pb-8 md:px-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-outline-variant bg-surface-lowest/60 p-6 text-center">
            <BookOpen className="mx-auto text-secondary" size={28} />
            <h3 className="mt-3 text-lg font-bold text-primary">Guide rapide</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              1. Créez un compte ou connectez-vous · 2. Ajoutez vos produits au catalogue ·
              3. Enregistrez vos mouvements · 4. Consultez le tableau de bord et l&apos;historique.
            </p>
          </div>
        </section>
        <AboutSection />
        <TarifsSection />
        <CtaSection onDemo={goToApp} />
      </main>
      <LandingFooter />
    </div>
  )
}

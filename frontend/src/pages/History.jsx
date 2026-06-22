import { useEffect, useMemo, useState } from 'react'
import {
  Search, Filter, Calendar, ChevronDown, ArrowUp, ArrowDown,
} from 'lucide-react'
import { getAllMovements } from '../api/movement'

const TYPE_OPTIONS = [
  { value: 'ALL', label: 'TOUS LES TYPES' },
  { value: 'IN', label: 'ENTRÉES' },
  { value: 'OUT', label: 'SORTIES' },
]

const PERIOD_OPTIONS = [
  { value: 7, label: '7 DERNIERS JOURS' },
  { value: 30, label: '30 DERNIERS JOURS' },
  { value: 0, label: 'TOUT L\'HISTORIQUE' },
]

const PAGE_SIZE = 10

export default function History() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [period, setPeriod] = useState(7)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllMovements()
        setMovements(data.data ?? data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    const now = Date.now()

    return movements.filter((m) => {
      if (typeFilter !== 'ALL' && m.type !== typeFilter) return false

      if (period > 0) {
        const days = (now - new Date(m.created_at).getTime()) / 86400000
        if (days > period) return false
      }

      if (term) {
        const haystack = `${m.product?.name ?? ''} ${m.user?.name ?? ''} ${m.reason ?? ''}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }

      return true
    })
  }, [movements, search, typeFilter, period])

  const visible = filtered.slice(0, visibleCount)

  const grouped = useMemo(() => {
    const groups = {}
    visible.forEach((m) => {
      const key = formatDateGroup(m.created_at)
      if (!groups[key]) groups[key] = []
      groups[key].push(m)
    })
    return groups
  }, [visible])

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Journal d'activité</h2>
        <p className="text-on-surface-variant">
          Suivez chaque mouvement de stock à travers votre installation.
        </p>
      </header>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-2 bg-white p-3 rounded-xl shadow-sm border border-outline-variant flex items-center gap-3">
          <Search className="text-outline" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
            placeholder="Rechercher par produit, utilisateur ou motif..."
            className="w-full bg-transparent border-none focus:outline-none text-base"
          />
        </div>

        <SelectField
          icon={<Filter className="text-secondary" size={20} />}
          value={typeFilter}
          onChange={(v) => { setTypeFilter(v); setVisibleCount(PAGE_SIZE) }}
          options={TYPE_OPTIONS}
        />

        <SelectField
          icon={<Calendar className="text-secondary" size={20} />}
          value={period}
          onChange={(v) => { setPeriod(Number(v)); setVisibleCount(PAGE_SIZE) }}
          options={PERIOD_OPTIONS}
        />
      </div>

      {/* Timeline */}
      <div className="relative">
        {loading && <p className="text-sm text-on-surface-variant">Chargement de l'historique...</p>}
        {!loading && Object.keys(grouped).length === 0 && (
          <p className="text-sm text-on-surface-variant">Aucun mouvement trouvé.</p>
        )}

        {Object.entries(grouped).map(([dateLabel, items]) => (
          <div key={dateLabel} className="mb-8 relative">
            <h3 className="text-xs font-semibold text-outline uppercase tracking-widest mb-4">
              {dateLabel}
            </h3>
            <div className="space-y-4 relative pl-12">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-outline-variant" />
              {items.map((m) => (
                <MovementCard key={m.id} movement={m} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-6 py-3 border border-secondary text-secondary rounded-lg text-sm font-semibold hover:bg-secondary/5 transition-colors active:scale-95"
          >
            CHARGER LES ANCIENS LOGS
          </button>
        </div>
      )}
    </div>
  )
}

function MovementCard({ movement: m }) {
  const isOut = m.type === 'OUT'
  const time = new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const initials = (m.user?.name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="relative">
      <div className={`absolute -left-12 top-1 w-10 h-10 rounded-full bg-white border-2 flex items-center justify-center shadow-sm ${
        isOut ? 'border-error' : 'border-secondary'
      }`}>
        {isOut ? <ArrowUp className="text-error" size={18} /> : <ArrowDown className="text-secondary" size={18} />}
      </div>

      <div className="bg-white p-4 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
              isOut ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
            }`}>
              {isOut ? 'Sortie' : 'Entrée'}
            </span>
            <h4 className="font-semibold text-primary">{m.product?.name}</h4>
          </div>
          <span className="text-xs text-outline">{time}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-on-surface-variant">
          <div>
            <p className="text-[10px] font-semibold text-outline uppercase mb-1">Quantité</p>
            <p className={`text-lg font-bold ${isOut ? 'text-primary' : 'text-secondary'}`}>
              {isOut ? '−' : '+'} {m.quantity}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-outline uppercase mb-1">Motif</p>
            <p className="text-sm">{m.reason || '—'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] font-semibold text-outline uppercase mb-1">Opérateur</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-primary">
                {initials}
              </div>
              <p className="text-sm">{m.user?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SelectField({ icon, value, onChange, options }) {
  return (
    <div className="relative bg-white p-3 rounded-xl shadow-sm border border-outline-variant">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-none focus:outline-none text-xs font-semibold appearance-none pr-6 pl-7"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</span>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={16} />
    </div>
  )
}

function formatDateGroup(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()

  const formatted = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })

  if (isSameDay(date, today)) return `Aujourd'hui — ${formatted}`
  if (isSameDay(date, yesterday)) return `Hier — ${formatted}`
  return formatted
}
import { useEffect, useRef, useState } from 'react'
import { Search, PlusCircle, MinusCircle, Minus, Plus, CheckCircle2, ArrowDown, ArrowUp } from 'lucide-react'
import { getProducts } from '../api/catalog'
import { createMovement, getProductMovements } from '../api/movement'

export default function StockMovement() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [selected, setSelected] = useState(null)
  const [type, setType] = useState('in')
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState('')
  const [recent, setRecent] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    async function search() {
      if (!query) { setResults([]); return }
      const data = await getProducts({ search: query })
      setResults((data.data ?? data).slice(0, 6))
    }
    const timeout = setTimeout(search, 250)
    return () => clearTimeout(timeout)
  }, [query])

useEffect(() => {
  if (!selected) return
  getProductMovements(selected.id)
    .then((data) => setRecent((data.data ?? data).slice(0, 5)))
    .catch(() => setRecent([]))
}, [selected])

  useEffect(() => {
    if (!selected) return
    getRecentMovements(selected.id).then((data) => setRecent(data.data ?? data)).catch(() => setRecent([]))
  }, [selected])

  function selectProduct(p) {
    setSelected(p)
    setQuery(`${p.name} — ${p.sku}`)
    setShowResults(false)
  }

async function handleSubmit(e) {
  e.preventDefault()
  if (!selected) return
  setSubmitting(true)
  try {
    await createMovement({
      product_id: selected.id,
      type: type === 'in' ? 'IN' : 'OUT',
      quantity: Number(quantity),
      reason,
    })
    setToast(true)
    setTimeout(() => setToast(false), 3000)
    setQuantity(1)
    setReason('')
    const updated = await getProducts()
    const refreshed = (updated.data ?? updated).find((p) => p.id === selected.id)
    if (refreshed) setSelected(refreshed)
  } catch (err) {
    console.error(err)
  } finally {
    setSubmitting(false)
  }
}

  const capacityPercent = selected
    ? Math.min(100, Math.round((selected.quantity / (selected.stock_alert_threshold * 10 || 100)) * 100))
    : 0

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Mouvement de Stock</h2>
        <p className="text-sm text-on-surface-variant">
          Enregistrez une entrée ou une sortie d'article en quelques secondes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Formulaire */}
        <section className="lg:col-span-8 bg-white border border-outline-variant rounded-xl p-4 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Recherche produit */}
            <div className="space-y-2" ref={wrapperRef}>
              <label className="text-xs font-semibold text-on-surface-variant block">
                SÉLECTIONNER UN PRODUIT
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(null); setShowResults(true) }}
                  onFocus={() => setShowResults(true)}
                  placeholder="Rechercher par nom ou SKU..."
                  className="w-full h-12 pl-12 pr-4 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all text-base"
                  required
                />
                {showResults && results.length > 0 && (
                  <div className="absolute w-full mt-1 bg-white border border-outline-variant rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {results.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => selectProduct(p)}
                        className="p-3 hover:bg-surface-container cursor-pointer border-b border-outline-variant last:border-0 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-primary">{p.name}</p>
                          <p className="text-xs text-on-surface-variant">SKU: {p.sku}</p>
                        </div>
                        <span className={`text-xs font-semibold ${p.quantity <= (p.stock_alert_threshold ?? 5) ? 'text-error' : 'text-secondary'}`}>
                          Stock: {p.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Type de mouvement */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant block">TYPE DE MOUVEMENT</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('in')}
                  className={`flex items-center justify-center gap-2 h-12 rounded-lg border-2 transition-all ${
                    type === 'in' ? 'border-green-600 bg-green-50 text-green-800' : 'border-outline-variant bg-surface text-on-surface-variant'
                  }`}
                >
                  <PlusCircle size={20} />
                  <span className="font-semibold text-sm">Entrée</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('out')}
                  className={`flex items-center justify-center gap-2 h-12 rounded-lg border-2 transition-all ${
                    type === 'out' ? 'border-error bg-red-50 text-red-800' : 'border-outline-variant bg-surface text-on-surface-variant'
                  }`}
                >
                  <MinusCircle size={20} />
                  <span className="font-semibold text-sm">Sortie</span>
                </button>
              </div>
            </div>

            {/* Quantité */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant block">QUANTITÉ</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))}
                  className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-primary active:scale-95 transition-transform"
                >
                  <Minus size={20} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="flex-1 h-12 text-center text-xl font-bold bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Number(q) + 1)}
                  className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-primary active:scale-95 transition-transform"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Motif */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant block">MOTIF DU MOUVEMENT</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Ex: Réception commande #452, Vente client, Casse lors du déchargement..."
                className="w-full p-4 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary resize-none text-base"
              />
            </div>

            <button
              type="submit"
              disabled={!selected || submitting}
              className="w-full h-14 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-primary-container active:scale-[0.99] transition-all shadow-md disabled:opacity-60"
            >
              <CheckCircle2 size={20} />
              {submitting ? 'Enregistrement...' : 'Valider le mouvement'}
            </button>
          </form>
        </section>

        {/* Résumé contextuel */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-primary-container text-white rounded-xl p-4">
            <h3 className="text-xs font-semibold mb-2 opacity-80">RÉSUMÉ DU STOCK ACTUEL</h3>
            {selected ? (
              <>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-xs opacity-70">Produit sélectionné</p>
                    <p className="font-semibold">{selected.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{selected.quantity}</p>
                    <p className="text-[10px] uppercase tracking-widest">UNITÉS</p>
                  </div>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: `${capacityPercent}%` }} />
                </div>
              </>
            ) : (
              <p className="text-sm opacity-70 py-4">Sélectionnez un produit pour voir le résumé.</p>
            )}
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-4">
            <h3 className="text-xs font-semibold text-on-surface-variant mb-3">DERNIERS MOUVEMENTS</h3>
            <div className="space-y-3">
              {recent.length === 0 && (
                <p className="text-xs text-on-surface-variant">Aucun mouvement récent.</p>
              )}
            {recent.map((m, i) => (
  <div key={m.id} className={`flex items-center gap-3 ${i > 0 ? 'border-t border-outline-variant pt-3' : ''}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
      {m.type === 'IN' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
    </div>
    <div className="flex-1">
      <p className="text-xs font-bold text-primary">
        {m.type === 'IN' ? '+' : '-'}{m.quantity} Unités
      </p>
      <p className="text-[10px] text-on-surface-variant">
        {m.reason} — {new Date(m.created_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
))}
            </div>
          </div>
        </aside>
      </div>

      {toast && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-xl z-[100]">
          <CheckCircle2 className="text-green-400" size={20} />
          <span>Mouvement enregistré avec succès !</span>
        </div>
      )}
    </div>
  )
}
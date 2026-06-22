import { useEffect, useMemo, useState } from 'react'
import { Search, MoreVertical, Plus, Package, Pencil, Trash2, Filter } from 'lucide-react'
import { getProducts, deleteProduct } from '../api/catalog'
import { getCategories } from '../api/category'
import ProductFormModal from '../components/ProductFormModal'

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)

  async function loadProducts() {
    setLoading(true)
    try {
      const data = await getProducts()
      setProducts(data.data ?? data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    getCategories().then((data) => setCategories(data.data ?? data)).catch(console.error)
  }, [])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return products.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(term) || p.reference?.toLowerCase().includes(term)
      const matchesCategory = !categoryFilter || String(p.category?.id) === String(categoryFilter)
      return matchesSearch && matchesCategory
    })
  }, [products, search, categoryFilter])

  const totalUnits = products.reduce((sum, p) => sum + (p.quantity ?? 0), 0)
  const categoryCount = new Set(products.map((p) => p.category?.id)).size

  function openCreateModal() {
    setEditingProduct(null)
    setShowModal(true)
  }

  function openEditModal(product) {
    setEditingProduct(product)
    setShowModal(true)
    setOpenMenuId(null)
  }

  async function handleDelete(product) {
    if (!window.confirm(`Supprimer "${product.name}" ?`)) return
    try {
      await deleteProduct(product.id)
      loadProducts()
    } catch (err) {
      console.error(err)
    }
    setOpenMenuId(null)
  }

  function handleSaved() {
    setShowModal(false)
    loadProducts()
  }

  return (
    <div>
      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-primary">Catalogue d'inventaire</h2>
            <p className="text-sm text-on-surface-variant">
              {totalUnits.toLocaleString('fr-FR')} unités gérées sur {categoryCount} catégories.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par référence ou nom..."
              className="w-full h-12 pl-12 pr-4 bg-surface-container border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary transition-all text-base"
            />
          </div>

          <div className="relative md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-surface-container border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary appearance-none text-base"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p className="text-sm text-on-surface-variant">Chargement du catalogue...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-on-surface-variant">Aucun produit trouvé.</p>
        )}
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            menuOpen={openMenuId === product.id}
            onToggleMenu={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
            onEdit={() => openEditModal(product)}
            onDelete={() => handleDelete(product)}
          />
        ))}
      </section>

      <button
        onClick={openCreateModal}
        className="fixed right-6 bottom-24 md:bottom-8 z-50 w-14 h-14 bg-secondary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform hover:bg-secondary-container"
      >
        <Plus size={28} />
        <span className="sr-only">Ajouter un produit</span>
      </button>

      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}

function formatFCFA(value) {
  return `${Number(value).toLocaleString('fr-FR')} FCFA`
}

function ProductCard({ product, menuOpen, onToggleMenu, onEdit, onDelete }) {
  const status = getStockStatus(product.quantity)

  return (
    <div className={`bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative ${status.dimmed ? 'opacity-80' : ''}`}>
      <div className="h-32 overflow-hidden relative bg-surface-container flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="text-outline" size={36} />
        )}
        {product.category?.name && (
          <div className="absolute top-3 right-3 bg-secondary/10 backdrop-blur-md px-3 py-1 rounded-full border border-secondary/20">
            <span className="text-secondary font-bold text-[10px] uppercase">{product.category.name}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-primary truncate pr-2">{product.name}</h3>
            <span className="text-primary font-bold text-sm whitespace-nowrap">
              {formatFCFA(product.price)}
            </span>
          </div>
          <p className="text-outline text-xs tracking-wider uppercase mb-3">Réf: {product.reference}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-outline-variant/30">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${status.bg} ${status.border}`}>
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            <span className={`font-bold text-[10px] ${status.text}`}>
              {status.label} ({product.quantity})
            </span>
          </div>

          <div className="relative">
            <button
              onClick={onToggleMenu}
              className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors"
            >
              <MoreVertical className="text-outline" size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 bottom-10 bg-white border border-outline-variant rounded-lg shadow-lg overflow-hidden z-10 w-36">
                <button
                  onClick={onEdit}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  <Pencil size={16} /> Modifier
                </button>
                <button
                  onClick={onDelete}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error-container transition-colors"
                >
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getStockStatus(quantity, threshold = 5) {
  if (quantity === 0) {
    return { label: 'RUPTURE', bg: 'bg-error-container', border: 'border-error/20', dot: 'bg-error', text: 'text-on-error-container', dimmed: true }
  }
  if (quantity <= threshold) {
    return { label: 'STOCK FAIBLE', bg: 'bg-orange-50', border: 'border-orange-100', dot: 'bg-orange-500', text: 'text-orange-700', dimmed: false }
  }
  return { label: 'EN STOCK', bg: 'bg-green-50', border: 'border-green-100', dot: 'bg-green-500', text: 'text-green-700', dimmed: false }
}
import { useEffect, useState } from 'react'
import { X, Package, Tag, Hash, Banknote, Boxes, Loader2, Image as ImageIcon, Upload } from 'lucide-react'
import { getCategories } from '../api/category'
import { createProduct, updateProduct } from '../api/catalog'

export default function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = Boolean(product)

  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    category_id: product?.category_id ?? product?.category?.id ?? '',
    name: product?.name ?? '',
    reference: product?.reference ?? '',
    price: product?.price ?? '',
    quantity: product?.quantity ?? '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.image_url ?? null)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategories()
        setCategories(data.data ?? data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingCategories(false)
      }
    }
    load()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setSaving(true)

    const formData = new FormData()
    formData.append('category_id', form.category_id)
    formData.append('name', form.name)
    formData.append('reference', form.reference)
    formData.append('price', form.price)
    formData.append('quantity', form.quantity)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      if (isEdit) {
        await updateProduct(product.id, formData)
      } else {
        await createProduct(formData)
      }
      onSaved()
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {})
        setError('Veuillez corriger les champs en erreur.')
      } else {
        setError('Impossible d\'enregistrer le produit.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-primary">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          {/* Upload image */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Photo du produit
            </label>
            <label className="flex items-center gap-4 cursor-pointer">
              <div className="w-20 h-20 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-outline" size={28} />
                )}
              </div>
              <div className="flex items-center gap-2 text-secondary text-sm font-semibold">
                <Upload size={16} />
                {imagePreview ? 'Changer la photo' : 'Ajouter une photo'}
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {fieldErrors.image && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.image[0]}</p>
            )}
          </div>

          <Field
            label="Nom du produit"
            icon={<Package size={18} />}
            name="name"
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
            required
          />

          <Field
            label="Référence"
            icon={<Hash size={18} />}
            name="reference"
            value={form.reference}
            onChange={handleChange}
            error={fieldErrors.reference}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Catégorie
            </label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                className="w-full h-12 pl-11 pr-4 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary appearance-none text-base"
              >
                <option value="" disabled>
                  {loadingCategories ? 'Chargement...' : 'Sélectionner une catégorie'}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            {fieldErrors.category_id && (
              <p className="text-xs text-red-600 mt-1">{fieldErrors.category_id[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Prix (FCFA)"
              icon={<Banknote size={18} />}
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              error={fieldErrors.price}
              required
            />
            <Field
              label="Quantité en stock"
              icon={<Boxes size={18} />}
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              error={fieldErrors.quantity}
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-12 bg-primary text-white font-semibold rounded-lg mt-2 flex items-center justify-center gap-2 hover:bg-primary-container active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : (isEdit ? 'Enregistrer les modifications' : 'Ajouter le produit')}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, icon, error, ...inputProps }) {
  return (
    <div>
      <label htmlFor={inputProps.name} className="block text-xs font-semibold text-on-surface-variant mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline">{icon}</span>
        <input
          id={inputProps.name}
          className={`w-full h-12 pl-11 pr-4 bg-surface border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-base ${
            error ? 'border-red-400' : 'border-outline-variant'
          }`}
          {...inputProps}
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error[0]}</p>}
    </div>
  )
}
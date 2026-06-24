import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, UserCircle2, Mail, Building2, Lock, ChevronRight, Save,
  X, CheckCircle2, Loader2, Pencil,
} from 'lucide-react'
import { getUser, updateProfile, updatePassword } from '../api/auth'

export default function EditProfile() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', company: '' })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
function handlePhotoChange(e) {
  const file = e.target.files[0]
  if (!file) return
  setPhotoFile(file)
  setPhotoPreview(URL.createObjectURL(file))
}
  useEffect(() => {
    async function load() {
      try {
        const user = await getUser()
        setForm({ name: user.name ?? '', email: user.email ?? '', company: user.company ?? '' })
        setPhotoPreview(user.profile_photo_url ?? null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

async function handleSubmit(e) {
  e.preventDefault()
  setError('')
  setSaving(true)

  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('email', form.email)
  formData.append('company', form.company || '')
  if (photoFile) {
    formData.append('profile_photo', photoFile)
  }

  try {
    await updateProfile(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  } catch (err) {
    setError('Impossible d\'enregistrer les modifications.')
  } finally {
    setSaving(false)
  }
}

  if (loading) {
    return <p className="text-sm text-on-surface-variant">Chargement...</p>
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-primary hover:opacity-70 transition-opacity">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-xl font-bold text-primary">Modifier le profil</h2>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
<div className="flex flex-col items-center gap-3 mb-2">
  <label className="cursor-pointer relative">
    <div className="w-24 h-24 rounded-full bg-surface-container border border-outline-variant flex items-center justify-center overflow-hidden">
      {photoPreview ? (
        <img src={photoPreview} alt="Photo de profil" className="w-full h-full object-cover" />
      ) : (
        <UserCircle2 className="text-outline" size={48} />
      )}
    </div>
    <span className="absolute bottom-0 right-0 bg-secondary text-white p-1.5 rounded-full shadow">
      <Pencil size={14} />
    </span>
    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
  </label>
  <span className="text-xs text-secondary font-semibold">Changer la photo</span>
</div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

        <Field
          label="Nom complet"
          icon={<UserCircle2 size={20} />}
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <Field
          label="Adresse Email"
          icon={<Mail size={20} />}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <Field
          label="Nom de l'entreprise"
          icon={<Building2 size={20} />}
          name="company"
          value={form.company}
          onChange={handleChange}
        />

        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center justify-between w-full h-12 px-4 bg-white border border-outline-variant rounded-lg hover:bg-surface-container transition-colors"
        >
          <div className="flex items-center gap-3">
            <Lock className="text-on-surface-variant" size={20} />
            <span>Changer le mot de passe</span>
          </div>
          <ChevronRight className="text-on-surface-variant" size={20} />
        </button>

        <button
          type="submit"
          disabled={saving}
          className="w-full h-12 bg-secondary text-white font-semibold rounded-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={20} className="animate-spin" />
          ) : saved ? (
            <>
              <CheckCircle2 size={20} /> Modifié !
            </>
          ) : (
            <>
              <Save size={20} /> Enregistrer les modifications
            </>
          )}
        </button>
      </form>

      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  )
}

function Field({ label, icon, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputProps.name} className="text-xs font-semibold text-on-surface-variant">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          {icon}
        </span>
        <input
          id={inputProps.name}
          className="w-full h-12 pl-12 pr-4 bg-white border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all text-base"
          {...inputProps}
        />
      </div>
    </div>
  )
}

function PasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await updatePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      })
      onClose()
    } catch (err) {
      setError('Mot de passe actuel incorrect ou données invalides.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-primary">Nouveau mot de passe</h3>
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
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">Ancien mot de passe</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">Nouveau mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">Confirmer le mot de passe</label>
            <input
              type="password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full h-12 px-4 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 bg-primary text-white font-semibold rounded-lg mt-2 disabled:opacity-60"
          >
            {submitting ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}
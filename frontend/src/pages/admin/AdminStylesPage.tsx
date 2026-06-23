import { useEffect, useState } from 'react'
import { getTattooStyles, createTattooStyle, updateTattooStyle, deleteTattooStyle } from '@/api/tattooStyles'
import type { TattooStyle } from '@/types'

const empty = { name: '', description: '', imageUrl: '' }

const AdminStylesPage = () => {
  const [styles, setStyles] = useState<TattooStyle[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getTattooStyles().then(setStyles).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) return
    setSubmitting(true)
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
      }
      if (editing) {
        const updated = await updateTattooStyle(editing, payload)
        setStyles(prev => prev.map(s => s.id === editing ? updated : s))
        setEditing(null)
      } else {
        const created = await createTattooStyle(payload)
        setStyles(prev => [...prev, created])
      }
      setForm(empty)
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (style: TattooStyle) => {
    setEditing(style.id)
    setForm({ name: style.name, description: style.description ?? '', imageUrl: style.imageUrl ?? '' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this style?')) return
    await deleteTattooStyle(id)
    setStyles(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-2">Tattoo Styles</h1>
      <p className="text-[#444] text-xs uppercase tracking-widest mb-10">Manage Styles</p>

      {/* Form */}
      <div className="border border-[#111] p-6 mb-12">
        <p className="text-xs uppercase tracking-widest text-[#444] mb-6">
          {editing ? 'Edit Style' : 'New Style'}
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Style Name *"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <input
            value={form.imageUrl}
            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            placeholder="Image URL (optional)"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Description (optional)"
            className="md:col-span-2 bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
          />
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs uppercase tracking-widest hover:bg-[#b8973b] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editing ? 'Update' : 'Add Style'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setForm(empty) }}
                className="px-6 py-3 border border-[#1a1a1a] text-[#444] text-xs uppercase tracking-widest hover:border-[#333] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-px bg-[#111]">
          {styles.map(style => (
            <div key={style.id} className="bg-[#0a0a0a] p-5 flex items-center gap-4">
              {style.imageUrl && (
                <img src={style.imageUrl} alt={style.name} className="w-14 h-14 object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg text-[#e5e5e5]">{style.name}</p>
                {style.description && (
                  <p className="text-[#444] text-xs mt-1 line-clamp-1">{style.description}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(style)}
                  className="text-xs uppercase tracking-widest px-3 py-1 border border-[#1a1a1a] text-[#444] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(style.id)}
                  className="text-xs uppercase tracking-widest px-3 py-1 border border-red-900/50 text-red-500 hover:bg-red-900/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminStylesPage

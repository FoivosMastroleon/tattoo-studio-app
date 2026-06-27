import { useEffect, useState } from 'react'
import { getGalleryImages, createGalleryImage, deleteGalleryImage } from '@/api/galleryImage'
import { getTattooStyles } from '@/api/tattooStyles'
import ImageUploadInput from '@/components/ImageUploadInput'
import type { GalleryImage, TattooStyle } from '@/types'

const AdminGalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [styles, setStyles] = useState<TattooStyle[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', imageUrl: '', description: '', style: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getGalleryImages(), getTattooStyles()])
      .then(([imgs, stls]) => { setImages(imgs); setStyles(stls) })
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.imageUrl) return
    setSubmitting(true)
    setError(null)
    try {
      const created = await createGalleryImage({
        title: form.title,
        imageUrl: form.imageUrl,
        description: form.description || undefined,
        style: form.style || undefined,
      })
      setImages(prev => [created, ...prev])
      setForm({ title: '', imageUrl: '', description: '', style: '' })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Error adding image')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return
    await deleteGalleryImage(id)
    setImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-2">Gallery</h1>
      <p className="text-[#444] text-xs uppercase tracking-widest mb-10">Manage Images</p>

      {/* Form */}
      <div className="border border-[#111] p-6 mb-12">
        <p className="text-xs uppercase tracking-widest text-[#444] mb-6">Add Image</p>
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Title *"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <select
            value={form.style}
            onChange={e => setForm(f => ({ ...f, style: e.target.value }))}
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          >
            <option value="">No style</option>
            {styles.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Description (optional)"
            className="bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          <div className="md:col-span-2">
            <ImageUploadInput
              label="Image *"
              required
              value={form.imageUrl}
              onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs uppercase tracking-widest hover:bg-[#b8973b] transition-colors disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add Image'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {images.map(img => (
            <div key={img.id} className="relative group aspect-square overflow-hidden">
              <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-3">
                <p className="text-white text-xs text-center">{img.title}</p>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-xs uppercase tracking-widest px-3 py-1 border border-red-900 text-red-500 hover:bg-red-900/30 transition-colors"
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

export default AdminGalleryPage

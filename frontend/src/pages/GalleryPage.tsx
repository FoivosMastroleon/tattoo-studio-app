import { useEffect, useState } from 'react'
import { getGalleryImages } from '@/api/galleryImage'
import type { GalleryImage } from '@/types'

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<GalleryImage | null>(null)

  useEffect(() => {
    getGalleryImages().then(setImages).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">Our Work</p>
      <h1 className="font-display text-4xl text-center mb-16">Gallery</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <p className="text-center text-[#444] py-20 text-xs uppercase tracking-widest">No images yet</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {images.map(img => (
            <div
              key={img.id}
              className="aspect-square overflow-hidden cursor-pointer group"
              onClick={() => setSelected(img)}
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={selected.imageUrl}
              alt={selected.title}
              className="w-full max-h-[70vh] object-contain"
            />
            <div className="mt-4">
              <p className="font-display text-xl text-[#e5e5e5]">{selected.title}</p>
              {selected.description && <p className="text-[#666] text-sm mt-1">{selected.description}</p>}
              {selected.style && <p className="text-[#c9a84c] text-xs uppercase tracking-widest mt-2">{selected.style.name}</p>}
            </div>
          </div>
          <button
            onClick={() => setSelected(null)}
            className="absolute top-6 right-8 text-[#555] hover:text-white text-3xl transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default GalleryPage

import { useEffect, useState, useCallback } from 'react'
import { getGalleryImages } from '@/api/galleryImage'
import type { GalleryImage } from '@/types'

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    getGalleryImages().then(setImages).finally(() => setLoading(false))
  }, [])

  const selected = selectedIndex !== null ? images[selectedIndex] : null

  const prev = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
  }, [selectedIndex, images.length])

  const next = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % images.length)
  }, [selectedIndex, images.length])

  useEffect(() => {
    if (selectedIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setSelectedIndex(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedIndex, prev, next])

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
          {images.map((img, i) => (
            <div
              key={img.id}
              className="aspect-square overflow-hidden cursor-pointer group"
              onClick={() => setSelectedIndex(i)}
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

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Prev button */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#c9a84c] hover:border-[#c9a84c] transition-colors"
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={selected.imageUrl}
              alt={selected.title}
              className="w-full max-h-[70vh] object-contain"
            />
            <div className="mt-4 flex items-start justify-between">
              <div>
                <p className="font-display text-xl text-[#e5e5e5]">{selected.title}</p>
                {selected.description && <p className="text-[#666] text-sm mt-1">{selected.description}</p>}
                {selected.style && <p className="text-[#c9a84c] text-xs uppercase tracking-widest mt-2">{selected.style.name}</p>}
              </div>
              <p className="text-[#444] text-xs mt-1 shrink-0 ml-4">
                {selectedIndex! + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#c9a84c] hover:border-[#c9a84c] transition-colors"
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => setSelectedIndex(null)}
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

import { useEffect, useState } from 'react'
import { getTattooStyles } from '@/api/tattooStyles'
import type { TattooStyle } from '@/types'

const StylesPage = () => {
  const [styles, setStyles] = useState<TattooStyle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTattooStyles().then(setStyles).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">Specializations</p>
      <h1 className="font-display text-4xl text-center mb-16">Tattoo Styles</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : styles.length === 0 ? (
        <p className="text-center text-[#444] py-20 text-xs uppercase tracking-widest">No styles yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {styles.map(style => (
            <div key={style.id} className="group">
              {style.imageUrl && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={style.imageUrl}
                    alt={style.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="pt-4">
                <h3 className="font-display text-xl text-[#e5e5e5] mb-2">{style.name}</h3>
                {style.description && (
                  <p className="text-[#555] text-sm leading-relaxed">{style.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StylesPage

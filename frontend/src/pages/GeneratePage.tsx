import { useEffect, useState } from 'react'
import { getTattooStyles } from '@/api/tattooStyles'
import { generateConcept } from '@/api/ai'
import type { TattooStyle } from '@/types'

const GeneratePage = () => {
  const [styles, setStyles] = useState<TattooStyle[]>([])
  const [referenceUrl, setReferenceUrl] = useState('')
  const [description, setDescription] = useState('')
  const [styleId, setStyleId] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getTattooStyles().then(setStyles)
  }, [])

  const handleGenerate = async () => {
    const style = styles.find(s => s.id === styleId)
    if (!style || !description.trim()) return

    setGenerating(true)
    setError(null)
    try {
      const image = await generateConcept({ style: style.name, description })
      setGeneratedImage(image)
    } catch (err: any) {
      setError(err?.message ?? 'Generation failed.')
    } finally {
      setGenerating(false)
    }
  }

  const inputClass = "w-full bg-[#111] border border-[#1a1a1a] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
  const labelClass = "block text-xs uppercase tracking-widest text-[#666] mb-2"

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">AI Tool</p>
      <h1 className="font-display text-4xl text-center mb-16">Generate Concept</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Left — inputs */}
        <div className="flex flex-col gap-6">
          <div>
            <label className={labelClass}>Tattoo Style</label>
            <select
              value={styleId}
              onChange={e => setStyleId(e.target.value)}
              className={inputClass}
            >
              <option value="">Select a style...</option>
              {styles.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the tattoo concept..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>
              Reference Image URL <span className="text-[#333]">(optional)</span>
            </label>
            <input
              value={referenceUrl}
              onChange={e => setReferenceUrl(e.target.value)}
              type="url"
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          {referenceUrl && (
            <div>
              <p className={labelClass}>Reference</p>
              <img
                src={referenceUrl}
                alt="Reference"
                className="w-full object-cover max-h-64"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
              <a
                href={referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-widest text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors mt-2 inline-block"
              >
                View Original →
              </a>
            </div>
          )}

          {error && <p className="text-red-400 text-xs uppercase tracking-widest">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={!styleId || !description.trim() || generating}
            className="py-3 bg-[#c9a84c] text-[#0a0a0a] text-xs uppercase tracking-widest hover:bg-[#b8973b] transition-colors disabled:opacity-40"
          >
            {generating ? 'Generating...' : 'Generate Concept'}
          </button>
        </div>

        {/* Right — generated image */}
        <div>
          <p className={labelClass}>Generated Concept</p>
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated concept"
              className="w-full object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-[#111] border border-[#1a1a1a] flex items-center justify-center">
              <p className="text-xs uppercase tracking-widest text-[#333]">
                {generating ? 'Loading...' : 'No concept generated yet'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default GeneratePage

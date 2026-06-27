import { useRef, useState } from 'react'
import { uploadImage } from '@/api/upload'

type Mode = 'url' | 'file'

type Props = {
  value: string
  onChange: (url: string) => void
  label: string
  required?: boolean
  error?: string
}

const ImageUploadInput = ({ value, onChange, label, required, error }: Props) => {
  const [mode, setMode] = useState<Mode>('url')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (err: any) {
      setUploadError(err?.message ?? 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    const fakeEvent = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>
    handleFileChange(fakeEvent)
  }

  const displayError = error ?? uploadError

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs uppercase tracking-widest text-[#666]">
          {label}{required && <span className="text-[#c9a84c] ml-1">*</span>}
        </label>
        <div className="flex gap-1 text-[10px] uppercase tracking-widest">
          <button
            type="button"
            onClick={() => { setMode('url'); setUploadError(null) }}
            className={`px-4 py-1 border transition-colors ${
              mode === 'url'
                ? 'border-[#c9a84c] text-[#c9a84c]'
                : 'border-[#2a2a2a] text-[#444] hover:border-[#444] hover:text-[#666]'
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => { setMode('file'); setUploadError(null) }}
            className={`px-4 py-1 border transition-colors ${
              mode === 'file'
                ? 'border-[#c9a84c] text-[#c9a84c]'
                : 'border-[#2a2a2a] text-[#444] hover:border-[#444] hover:text-[#666]'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
        />
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full bg-[#111] border border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
            uploading ? 'border-[#c9a84c] opacity-70' : 'border-[#222] hover:border-[#c9a84c]'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-[#c9a84c]">
              <div className="w-4 h-4 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs uppercase tracking-widest">Uploading...</span>
            </div>
          ) : (
            <p className="text-xs uppercase tracking-widest text-[#444]">
              Drop image or <span className="text-[#c9a84c]">browse</span>
            </p>
          )}
        </div>
      )}

      {displayError && <p className="text-red-400 text-xs mt-1">{displayError}</p>}

      {value && (
        <div className="mt-2 relative w-full aspect-video bg-[#111] overflow-hidden">
          <img src={value} alt="preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/70 text-[#999] hover:text-white text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageUploadInput

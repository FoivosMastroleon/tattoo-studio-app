import { useRef, Children } from 'react'

const Carousel = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  const items = Children.toArray(children)

  const scroll = (dir: 1 | -1) => {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir * ref.current.offsetWidth, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Previous"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#c9a84c] hover:border-[#c9a84c] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        ref={ref}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((child, i) => (
          <div key={i} className="flex-none snap-start w-full md:w-[calc(33.333%-0.334rem)]">
            {child}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Next"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-[#0a0a0a] border border-[#1a1a1a] flex items-center justify-center text-[#555] hover:text-[#c9a84c] hover:border-[#c9a84c] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export default Carousel

import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-[#1a1a1a] py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        <div>
          <p className="font-display text-lg text-[#c9a84c] tracking-widest">INK & SOUL</p>
          <p className="text-xs text-[#555] mt-1 uppercase tracking-widest">Athens, Greece</p>
        </div>

        <nav className="flex gap-6">
          <Link to="/gallery" className="text-xs uppercase tracking-widest text-[#555] hover:text-[#c9a84c] transition-colors">Gallery</Link>
          <Link to="/styles" className="text-xs uppercase tracking-widest text-[#555] hover:text-[#c9a84c] transition-colors">Styles</Link>
          <Link to="/news" className="text-xs uppercase tracking-widest text-[#555] hover:text-[#c9a84c] transition-colors">News</Link>
          <Link to="/book" className="text-xs uppercase tracking-widest text-[#555] hover:text-[#c9a84c] transition-colors">Book</Link>
        </nav>

        <p className="text-xs text-[#333]">© {new Date().getFullYear()} Ink & Soul</p>

      </div>
    </footer>
  )
}

export default Footer

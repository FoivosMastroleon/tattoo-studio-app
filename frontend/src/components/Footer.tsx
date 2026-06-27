const Footer = () => {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-10 md:gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <p className="font-display text-2xl text-[#c9a84c] tracking-widest">INK & SOUL</p>
          <p className="text-[#333] text-[10px] uppercase tracking-[0.25em] leading-relaxed max-w-[140px]">
            Fine line & dark art<br />tattoo studio
          </p>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a84c] mb-1">Location</p>
          <p className="text-[#555] text-xs leading-relaxed">
            Ermou 42 & Athinas<br />
            Athens, 10563<br />
            Greece
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a84c] mb-1">Contact</p>
          <div className="flex flex-col gap-1.5 text-[#555] text-xs">
            <a href="mailto:info@inkandsoul.gr" className="hover:text-[#c9a84c] transition-colors">
              E. info@inkandsoul.gr
            </a>
            <a href="tel:+302101234567" className="hover:text-[#c9a84c] transition-colors">
              T. +30 210 123 4567
            </a>
            <a href="tel:+306901234567" className="hover:text-[#c9a84c] transition-colors">
              M. +30 690 123 4567
            </a>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a84c] mb-1">Opening Hours</p>
          <div className="flex flex-col gap-2 text-xs">
            <div>
              <p className="text-[#888] font-medium">Monday – Friday</p>
              <p className="text-[#555]">11:00 – 20:00</p>
            </div>
            <div>
              <p className="text-[#888] font-medium">Saturday</p>
              <p className="text-[#555]">11:00 – 18:00</p>
            </div>
            <div>
              <p className="text-[#555]">Sunday — Closed</p>
            </div>
          </div>
        </div>

        {/* Join Us */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a84c] mb-1">Join Us</p>
          <div className="flex gap-4">
            <a href="#" aria-label="Instagram" className="text-[#555] hover:text-[#c9a84c] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-[#555] hover:text-[#c9a84c] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className="text-[#555] hover:text-[#c9a84c] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#111] py-4">
        <p className="text-center text-[#2a2a2a] text-[10px] uppercase tracking-widest">
          © {new Date().getFullYear()} Ink & Soul · Athens, Greece
        </p>
      </div>
    </footer>
  )
}

export default Footer

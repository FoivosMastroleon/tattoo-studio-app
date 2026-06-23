const Footer = () => {
  return (
    <footer className="border-t border-[#1a1a1a] py-10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-base text-[#c9a84c] tracking-widest">INK & SOUL</p>
        <p className="text-xs text-[#333] uppercase tracking-widest">Athens, Greece</p>
        <p className="text-xs text-[#333]">© {new Date().getFullYear()} Ink & Soul</p>
      </div>
    </footer>
  )
}

export default Footer

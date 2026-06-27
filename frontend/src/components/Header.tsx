import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthProvider'
import Avatar from '@/components/Avatars'
import { getPendingCount } from '@/api/appointments'

const Header = () => {
  const { isAuthenticated, role, logoutUser, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)
  const seenKey = user?.id ? `appt_last_seen_${user.id}` : null

  useEffect(() => {
    if (!isAuthenticated || !user?.id) { setPendingCount(0); return }
    const since = seenKey ? (localStorage.getItem(seenKey) ?? undefined) : undefined
    getPendingCount(since).then(r => setPendingCount(r.count)).catch(() => {})
  }, [isAuthenticated, role, location.pathname, user?.id])

  useEffect(() => {
    const handler = () => setPendingCount(prev => Math.max(0, prev - 1))
    window.addEventListener('appt-seen', handler)
    return () => window.removeEventListener('appt-seen', handler)
  }, [])

  const handleMarkSeen = () => {
    if (seenKey) localStorage.setItem(seenKey, new Date().toISOString())
    setPendingCount(0)
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs uppercase tracking-widest transition-colors ${
      isActive ? 'text-[#c9a84c]' : 'text-[#e5e5e5] hover:text-[#c9a84c]'
    }`

  const isAdmin = role === 'admin'

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-8">

        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Ink & Soul" className="h-14 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          {isAdmin ? (
            <>
              <NavLink to="/admin" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/admin/appointments" className={linkClass} onClick={handleMarkSeen}>
                <span className="relative">
                  Appointments
                  {pendingCount > 0 && (
                    <span className="absolute -top-2.5 -right-4 min-w-[1.1rem] h-[1.1rem] rounded-full bg-[#c9a84c] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center px-0.5">
                      {pendingCount > 99 ? '99+' : pendingCount}
                    </span>
                  )}
                </span>
              </NavLink>
              <NavLink to="/generate" className={linkClass}>Generate</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/gallery" className={linkClass}>Gallery</NavLink>
              <NavLink to="/styles" className={linkClass}>Styles</NavLink>
              <NavLink to="/news" className={linkClass}>News</NavLink>
            </>
          )}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center justify-end gap-6">
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  {role === 'artist' && (
                    <NavLink to="/generate" className={linkClass}>Generate</NavLink>
                  )}
                  <NavLink to="/my-appointments" className={linkClass} onClick={handleMarkSeen}>
                    <span className="relative">
                      My Appointments
                      {pendingCount > 0 && (
                        <span className="absolute -top-2.5 -right-4 min-w-[1.1rem] h-[1.1rem] rounded-full bg-[#c9a84c] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center px-0.5">
                          {pendingCount > 99 ? '99+' : pendingCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                </>
              )}
              {user && <Avatar name={user.username} />}
              <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-[#e5e5e5] hover:text-[#c9a84c] transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <Link to="/register" className="text-xs uppercase tracking-widest px-4 py-2 border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0a0a0a] transition-all">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-[#e5e5e5] hover:text-[#c9a84c] justify-self-end col-start-3" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#1a1a1a] px-6 py-4 flex flex-col gap-4">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          {isAdmin ? (
            <>
              <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/admin/appointments" className={linkClass} onClick={() => { handleMarkSeen(); setMenuOpen(false) }}>
                <span className="relative">
                  Appointments
                  {pendingCount > 0 && (
                    <span className="absolute -top-2.5 -right-4 min-w-[1.1rem] h-[1.1rem] rounded-full bg-[#c9a84c] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center px-0.5">
                      {pendingCount > 99 ? '99+' : pendingCount}
                    </span>
                  )}
                </span>
              </NavLink>
              <NavLink to="/generate" className={linkClass} onClick={() => setMenuOpen(false)}>Generate</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/gallery" className={linkClass} onClick={() => setMenuOpen(false)}>Gallery</NavLink>
              <NavLink to="/styles" className={linkClass} onClick={() => setMenuOpen(false)}>Styles</NavLink>
              <NavLink to="/news" className={linkClass} onClick={() => setMenuOpen(false)}>News</NavLink>
              {isAuthenticated && role === 'artist' && (
                <NavLink to="/generate" className={linkClass} onClick={() => setMenuOpen(false)}>Generate</NavLink>
              )}
              {isAuthenticated && (
                <NavLink to="/my-appointments" className={linkClass} onClick={() => { handleMarkSeen(); setMenuOpen(false) }}>
                  <span className="relative">
                    My Appointments
                    {pendingCount > 0 && (
                      <span className="absolute -top-2.5 -right-4 min-w-[1.1rem] h-[1.1rem] rounded-full bg-[#c9a84c] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center px-0.5">
                        {pendingCount > 99 ? '99+' : pendingCount}
                      </span>
                    )}
                  </span>
                </NavLink>
              )}
            </>
          )}
          {isAuthenticated ? (
            <>
              {user && (
                <div className="flex items-center gap-2">
                  <Avatar name={user.username} />
                  <span className="text-xs uppercase tracking-widest text-[#555]">{user.username}</span>
                </div>
              )}
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-left text-xs uppercase tracking-widest text-[#e5e5e5] hover:text-[#c9a84c] transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={linkClass} onClick={() => setMenuOpen(false)}>Register</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default Header

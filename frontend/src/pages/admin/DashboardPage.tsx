import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Appointments', path: '/admin/appointments', description: 'Manage bookings' },
  { label: 'Gallery',      path: '/admin/gallery',      description: 'Manage images' },
  { label: 'News',         path: '/admin/news',         description: 'Studio updates' },
  { label: 'Styles',       path: '/admin/styles',       description: 'Tattoo styles' },
  { label: 'Users',        path: '/admin/users',        description: 'Manage accounts' },
]

const DashboardPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] mb-3">Admin Panel</p>
      <h1 className="font-display text-4xl text-[#e5e5e5] mb-12">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[#222]">
        {LINKS.map(({ label, path, description }) => (
          <Link
            key={path}
            to={path}
            className="group bg-[#0f0f0f] py-10 px-6 flex flex-col items-center gap-3 hover:bg-[#141414] transition-colors"
          >
            <span className="text-sm uppercase tracking-widest text-[#e5e5e5] group-hover:text-[#c9a84c] transition-colors font-medium">
              {label}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#555] group-hover:text-[#888] transition-colors">
              {description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage

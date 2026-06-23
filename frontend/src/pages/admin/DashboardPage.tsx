import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Appointments', path: '/admin/appointments' },
  { label: 'Gallery', path: '/admin/gallery' },
  { label: 'News', path: '/admin/news' },
  { label: 'Styles', path: '/admin/styles' },
  { label: 'Users', path: '/admin/users' },
]

const DashboardPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-2">Dashboard</h1>
      <p className="text-[#444] text-xs uppercase tracking-widest mb-10">Admin Panel</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[#111]">
        {LINKS.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className="bg-[#0a0a0a] py-10 text-center text-xs uppercase tracking-widest text-[#444] hover:text-[#c9a84c] transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage

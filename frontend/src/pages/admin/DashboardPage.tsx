import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAppointments, confirmAppointment, cancelAppointment, completeAppointment, updateAppointment } from '@/api/appointments'
import { getUsers } from '@/api/users'
import type { Appointment, User } from '@/types'

const statusStyle: Record<string, string> = {
  pending:   'text-yellow-500',
  confirmed: 'text-green-500',
  completed: 'text-[#c9a84c]',
  cancelled: 'text-[#333]',
}

const DashboardPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [artists, setArtists] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getAppointments().then(setAppointments).finally(() => setLoading(false))
    getUsers().then(users => setArtists(users.filter(u => u.role === 'artist')))
  }, [])

  const update = async (fn: () => Promise<Appointment>, id: string) => {
    const updated = await fn()
    setAppointments(prev => prev.map(a => a.id === id ? updated : a))
  }

  const handleAssignArtist = async (appointmentId: string, artistId: string) => {
    const updated = await updateAppointment(appointmentId, { artist: artistId || undefined })
    setAppointments(prev => prev.map(a => a.id === appointmentId ? updated : a))
  }

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter)

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-2">Dashboard</h1>
      <p className="text-[#444] text-xs uppercase tracking-widest mb-10">Admin Panel</p>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#111] mb-16">
        {[
          { label: 'Gallery', path: '/admin/gallery' },
          { label: 'News', path: '/admin/news' },
          { label: 'Styles', path: '/admin/styles' },
          { label: 'Users', path: '/admin/users' },
        ].map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className="bg-[#0a0a0a] py-6 text-center text-xs uppercase tracking-widest text-[#444] hover:text-[#c9a84c] transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap mb-8">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs uppercase tracking-widest px-3 py-1 border transition-colors ${
              filter === s
                ? 'border-[#c9a84c] text-[#c9a84c]'
                : 'border-[#1a1a1a] text-[#444] hover:border-[#333]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-[#444] text-xs uppercase tracking-widest py-20 text-center">No appointments</p>
      ) : (
        <div className="flex flex-col gap-px bg-[#111]">
          {filtered.map(apt => (
            <div key={apt.id} className="bg-[#0a0a0a] p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-[#e5e5e5] text-sm font-medium">{apt.customer.username}</p>
                  <p className="text-[#555] text-xs mt-0.5">{apt.customer.email}{apt.phone && ` · ${apt.phone}`}</p>
                  {(apt.status === 'pending' || apt.status === 'confirmed') && artists.length > 0 && (
                    <select
                      value={apt.artist?.id ?? ''}
                      onChange={e => handleAssignArtist(apt.id, e.target.value)}
                      className="mt-2 bg-[#111] border border-[#1a1a1a] px-2 py-1 text-xs text-[#888] focus:outline-none focus:border-[#c9a84c] transition-colors"
                    >
                      <option value="">No artist assigned</option>
                      {artists.map(a => (
                        <option key={a.id} value={a.id}>{a.username}</option>
                      ))}
                    </select>
                  )}
                  {apt.artist && !(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <p className="text-xs text-[#555] mt-1">Artist: {apt.artist.username}</p>
                  )}
                  <p className="text-[#444] text-xs uppercase tracking-widest mt-1">
                    {apt.tattooStyle.name} — {new Date(apt.appointmentDate).toLocaleDateString('en-GB')} {apt.timeSlot}
                  </p>
                  {apt.clientNotes && (
                    <p className="text-[#333] text-xs mt-2 italic">"{apt.clientNotes}"</p>
                  )}
                  {apt.referenceImageUrl && (
                    <a
                      href={apt.referenceImageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs uppercase tracking-widest text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors mt-1 inline-block"
                    >
                      View Reference →
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs uppercase tracking-widest ${statusStyle[apt.status]}`}>
                    {apt.status}
                  </span>
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => update(() => confirmAppointment(apt.id), apt.id)}
                      className="text-xs uppercase tracking-widest px-3 py-1 border border-green-900 text-green-500 hover:bg-green-900/20 transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => update(() => completeAppointment(apt.id), apt.id)}
                      className="text-xs uppercase tracking-widest px-3 py-1 border border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <button
                      onClick={() => update(() => cancelAppointment(apt.id), apt.id)}
                      className="text-xs uppercase tracking-widest px-3 py-1 border border-red-900/50 text-red-500 hover:bg-red-900/20 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage

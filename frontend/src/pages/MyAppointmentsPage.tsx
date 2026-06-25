import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { cancelAppointment, completeAppointment } from '@/api/appointments'
import { useAppointments } from '@/hooks/useAppointments'
import { useAuth } from '@/context/AuthProvider'
import { formatDate, formatDateTime } from '@/utils/formatDate'

const statusStyle: Record<string, string> = {
  pending:   'text-yellow-500',
  confirmed: 'text-green-500',
  completed: 'text-[#c9a84c]',
  cancelled: 'text-[#333]',
}


const MyAppointmentsPage = () => {
  const { appointments, updateOne, loading } = useAppointments()
  const { role, user } = useAuth()
  const isArtist = role === 'artist' || role === 'admin'
  const [filter, setFilter] = useState('all')

  const seenAtKey = `appt_seen_at_${user?.id ?? ''}`
  const [seenAt] = useState<number>(() => parseInt(sessionStorage.getItem(seenAtKey) || '0'))
  useEffect(() => { sessionStorage.setItem(seenAtKey, String(Date.now())) }, [seenAtKey])
  const isNew = (updatedAt: string) => new Date(updatedAt).getTime() > seenAt

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      const updated = await cancelAppointment(id)
      updateOne(updated)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to cancel appointment')
    }
  }

  const handleComplete = async (id: string) => {
    if (!confirm('Mark this appointment as completed?')) return
    try {
      const updated = await completeAppointment(id)
      updateOne(updated)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to complete appointment')
    }
  }

  const CUSTOMER_STATUS_ORDER: Record<string, number> = { confirmed: 0, pending: 1, cancelled: 2, completed: 3 }

  const filtered = (filter === 'all' ? appointments : appointments.filter(a => a.status === filter))
    .slice()
    .sort((a, b) => {
      if (role === 'customer' && filter === 'all') {
        const diff = CUSTOMER_STATUS_ORDER[a.status] - CUSTOMER_STATUS_ORDER[b.status]
        if (diff !== 0) return diff
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">Your Bookings</p>
      <h1 className="font-display text-4xl text-center mb-10">My Appointments</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#444] text-xs uppercase tracking-widest mb-8">No appointments yet</p>
          <Link
            to="/book"
            className="text-xs uppercase tracking-widest text-[#c9a84c] border-b border-[#c9a84c]/40 pb-1 hover:border-[#c9a84c] transition-colors"
          >
            Book a Session
          </Link>
        </div>
      ) : (
        <>
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

          {filtered.length === 0 ? (
            <p className="text-[#444] text-xs uppercase tracking-widest py-20 text-center">No appointments</p>
          ) : (
            <div className="flex flex-col gap-px bg-[#111]">
              {filtered.map(apt => (
                <div key={apt.id} className={`bg-[#0a0a0a] p-5 border-l-2 ${isNew(apt.updatedAt) ? 'border-[#c9a84c]' : 'border-transparent'}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-lg text-[#e5e5e5]">{apt.tattooStyle.name}</p>
                      <p className="text-[#555] text-xs uppercase tracking-widest mt-1">
                        {formatDate(apt.appointmentDate)} — {apt.timeSlot}
                      </p>
                      {apt.artist && (
                        <p className="text-[#444] text-xs mt-1">Artist: {apt.artist.username}</p>
                      )}
                      {apt.clientNotes && (
                        <p className="text-[#333] text-xs italic mt-2">"{apt.clientNotes}"</p>
                      )}
                      {apt.artistNotes && (
                        <p className="text-[#555] text-xs mt-1">Note: {apt.artistNotes}</p>
                      )}
                      {apt.referenceImageUrl && (
                        <a
                          href={apt.referenceImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs uppercase tracking-widest text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors mt-2 inline-block"
                        >
                          View Reference →
                        </a>
                      )}
                      <p className="text-[#2a2a2a] text-xs mt-3">Booked {formatDateTime(apt.createdAt)}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className={`text-xs uppercase tracking-widest ${statusStyle[apt.status]}`}>
                        {apt.status}
                      </span>
                      <div className="flex gap-3">
                        {isArtist && apt.status === 'confirmed' && (
                          <button
                            onClick={() => handleComplete(apt.id)}
                            className="text-xs uppercase tracking-widest text-[#c9a84c] hover:text-[#b8973b] transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {(apt.status === 'pending' || apt.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="text-xs uppercase tracking-widest text-[#333] hover:text-red-500 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MyAppointmentsPage

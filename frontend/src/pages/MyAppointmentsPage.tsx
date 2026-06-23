import { Link } from 'react-router-dom'
import { cancelAppointment } from '@/api/appointments'
import { useAppointments } from '@/hooks/useAppointments'
import { formatDateLong } from '@/utils/formatDate'

const statusStyle: Record<string, string> = {
  pending:   'text-yellow-500 border-yellow-500/20',
  confirmed: 'text-green-500 border-green-500/20',
  completed: 'text-[#c9a84c] border-[#c9a84c]/20',
  cancelled: 'text-[#333] border-[#1a1a1a]',
}

const MyAppointmentsPage = () => {
  const { appointments, updateOne, loading } = useAppointments()

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return
    const updated = await cancelAppointment(id)
    updateOne(updated)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">Your Bookings</p>
      <h1 className="font-display text-4xl text-center mb-16">My Appointments</h1>

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
        <div className="flex flex-col gap-px bg-[#111]">
          {appointments.map(apt => (
            <div key={apt.id} className="bg-[#0a0a0a] p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-display text-lg text-[#e5e5e5]">{apt.tattooStyle.name}</p>
                  <p className="text-[#555] text-xs uppercase tracking-widest mt-1">
                    {formatDateLong(apt.appointmentDate)} — {apt.timeSlot}
                  </p>
                </div>
                <span className={`text-xs uppercase tracking-widest px-3 py-1 border ${statusStyle[apt.status]}`}>
                  {apt.status}
                </span>
              </div>

              {apt.artist && (
                <p className="text-xs text-[#444] uppercase tracking-widest mb-2">
                  Artist: {apt.artist.username}
                </p>
              )}
              {apt.clientNotes && (
                <p className="text-sm text-[#444] italic mt-2">"{apt.clientNotes}"</p>
              )}
              {apt.artistNotes && (
                <p className="text-sm text-[#666] mt-2">Note: {apt.artistNotes}</p>
              )}
              {apt.referenceImageUrl && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-widest text-[#444] mb-2">Reference Image</p>
                  <img src={apt.referenceImageUrl} alt="Reference" className="max-h-48 object-contain" />
                </div>
              )}

              {(apt.status === 'pending' || apt.status === 'confirmed') && (
                <button
                  onClick={() => handleCancel(apt.id)}
                  className="mt-4 text-xs uppercase tracking-widest text-[#333] hover:text-red-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointmentsPage

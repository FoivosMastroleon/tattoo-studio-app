import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getTattooStyles } from '@/api/tattooStyles'
import { createAppointment } from '@/api/appointments'
import { createAppointmentSchema, type CreateAppointmentFields } from '@/schemas/appointment'
import type { TattooStyle } from '@/types'

const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

const BookPage = () => {
  const [styles, setStyles] = useState<TattooStyle[]>([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateAppointmentFields>({
    resolver: zodResolver(createAppointmentSchema),
  })

  useEffect(() => {
    getTattooStyles().then(setStyles).catch(() => {})
  }, [])

  const onSubmit = async (data: CreateAppointmentFields) => {
    setError(null)
    try {
      await createAppointment(data)
      setSuccess(true)
      reset()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Something went wrong')
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full border border-[#c9a84c] flex items-center justify-center mb-8">
          <svg className="w-7 h-7 text-[#c9a84c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-3xl mb-3">Request Sent</h2>
        <p className="text-[#555] text-sm mb-10 uppercase tracking-widest">We'll confirm your booking shortly</p>
        <button
          onClick={() => setSuccess(false)}
          className="text-xs uppercase tracking-widest px-6 py-3 border border-[#2a2a2a] text-[#666] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
        >
          Book Another
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="text-[#c9a84c] text-xs uppercase tracking-[0.4em] text-center mb-3">Reserve Your Spot</p>
      <h1 className="font-display text-4xl text-center mb-16">Book a Session</h1>

      {error && (
        <p className="text-red-400 text-sm text-center mb-8">{error}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Tattoo Style</label>
          <select
            {...register('tattooStyle')}
            className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          >
            <option value="">Select a style...</option>
            {styles.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.tattooStyle && <p className="text-red-400 text-xs mt-1">{errors.tattooStyle.message}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Preferred Date</label>
          <input
            {...register('appointmentDate')}
            type="date"
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          {errors.appointmentDate && <p className="text-red-400 text-xs mt-1">{errors.appointmentDate.message}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">Time Slot</label>
          <select
            {...register('timeSlot')}
            className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          >
            <option value="">Select a time...</option>
            {TIME_SLOTS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.timeSlot && <p className="text-red-400 text-xs mt-1">{errors.timeSlot.message}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">
            Reference Image URL <span className="text-[#333]">(optional)</span>
          </label>
          <input
            {...register('referenceImageUrl')}
            type="url"
            placeholder="https://..."
            className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
          {errors.referenceImageUrl && <p className="text-red-400 text-xs mt-1">{errors.referenceImageUrl.message}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-[#666] mb-2">
            Notes <span className="text-[#333]">(optional)</span>
          </label>
          <textarea
            {...register('clientNotes')}
            rows={4}
            placeholder="Describe your idea, size, placement..."
            className="w-full bg-[#111] border border-[#222] px-4 py-3 text-sm text-[#e5e5e5] focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
          />
          {errors.clientNotes && <p className="text-red-400 text-xs mt-1">{errors.clientNotes.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#c9a84c] text-[#0a0a0a] text-xs uppercase tracking-widest font-medium hover:bg-[#b8973b] transition-colors disabled:opacity-50 mt-2"
        >
          {isSubmitting ? 'Submitting...' : 'Request Appointment'}
        </button>
      </form>
    </div>
  )
}

export default BookPage

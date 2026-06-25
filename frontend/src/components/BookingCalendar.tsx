import { useState, useEffect } from 'react'
import { getBookedSlots } from '@/api/appointments'

const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

interface Props {
  selectedDate: string
  selectedTime: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
}

const pad = (n: number) => String(n).padStart(2, '0')

const toDateStr = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`

const BookingCalendar = ({ selectedDate, selectedTime, onDateChange, onTimeChange }: Props) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [bookedMap, setBookedMap] = useState<Record<string, string[]>>({})

  const monthKey = `${viewYear}-${pad(viewMonth + 1)}`

  useEffect(() => {
    getBookedSlots(monthKey).then(setBookedMap).catch(() => {})
  }, [monthKey])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const firstDayDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDayDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const isPast = (day: number) => new Date(viewYear, viewMonth, day) <= today
  const isSunday = (day: number) => new Date(viewYear, viewMonth, day).getDay() === 0
  const isFullyBooked = (day: number) =>
    (bookedMap[toDateStr(viewYear, viewMonth, day)] ?? []).length >= TIME_SLOTS.length
  const isSelected = (day: number) => selectedDate === toDateStr(viewYear, viewMonth, day)

  const handleDayClick = (day: number) => {
    if (isPast(day) || isSunday(day) || isFullyBooked(day)) return
    const dateStr = toDateStr(viewYear, viewMonth, day)
    onDateChange(dateStr)
    onTimeChange('')
  }

  const canGoPrev = viewYear > today.getFullYear() || viewMonth > today.getMonth()
  const selectedBookedSlots = selectedDate ? (bookedMap[selectedDate] ?? []) : []

  return (
    <div className="flex flex-col gap-6">
      {/* Calendar */}
      <div className="border border-[#1a1a1a] p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-[#c9a84c] transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="text-sm uppercase tracking-widest text-[#e5e5e5]">
            {MONTHS[viewMonth]} {viewYear}
          </p>
          <button
            type="button"
            onClick={nextMonth}
            className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-[#c9a84c] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] uppercase tracking-widest text-[#333] py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((day, idx) => {
            if (!day) return <div key={idx} />
            const disabled = isPast(day) || isSunday(day) || isFullyBooked(day)
            const selected = isSelected(day)
            const fullyBooked = !isPast(day) && !isSunday(day) && isFullyBooked(day)

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={disabled}
                className={`
                  relative aspect-square flex items-center justify-center text-xs transition-colors
                  ${selected
                    ? 'bg-[#c9a84c] text-[#0a0a0a] font-semibold'
                    : fullyBooked
                      ? 'text-[#2a2a2a] cursor-not-allowed'
                      : disabled
                        ? 'text-[#222] cursor-not-allowed'
                        : 'text-[#aaa] hover:bg-[#1a1a1a] hover:text-[#c9a84c] cursor-pointer'
                  }
                `}
              >
                {day}
                {fullyBooked && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-800" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-5 mt-4 pt-3 border-t border-[#111]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
            <span className="text-[10px] uppercase tracking-widest text-[#444]">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-800" />
            <span className="text-[10px] uppercase tracking-widest text-[#444]">Fully Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#222]" />
            <span className="text-[10px] uppercase tracking-widest text-[#444]">Unavailable</span>
          </div>
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-xs uppercase tracking-widest text-[#666] mb-3">Available Times</p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map(slot => {
              const booked = selectedBookedSlots.includes(slot)
              const selected = selectedTime === slot
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={booked}
                  onClick={() => onTimeChange(slot)}
                  className={`
                    py-3 text-xs tracking-widest border transition-colors
                    ${selected
                      ? 'bg-[#c9a84c] border-[#c9a84c] text-[#0a0a0a] font-semibold'
                      : booked
                        ? 'border-[#111] text-[#2a2a2a] cursor-not-allowed line-through'
                        : 'border-[#1a1a1a] text-[#aaa] hover:border-[#c9a84c] hover:text-[#c9a84c] cursor-pointer'
                    }
                  `}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingCalendar

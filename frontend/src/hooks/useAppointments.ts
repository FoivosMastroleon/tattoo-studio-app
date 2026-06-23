import { useEffect, useState } from 'react'
import { getAppointments } from '@/api/appointments'
import type { Appointment } from '@/types'

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAppointments().then(setAppointments).finally(() => setLoading(false))
  }, [])

  const updateOne = (updated: Appointment) =>
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a))

  return { appointments, setAppointments, loading, updateOne }
}

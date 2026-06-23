import Appointment, { IAppointment } from '../models/appointment.model';

const POPULATE = 'customer artist tattooStyle';

export const findAllAppointments = () => Appointment.find().populate(POPULATE);

export const findAppointmentsByCustomer = (customerId: string) =>
  Appointment.find({ customer: customerId }).populate(POPULATE);

export const findAppointmentsByArtist = (artistId: string) =>
  Appointment.find({ artist: artistId }).populate(POPULATE);

export const findAppointmentById = (id: string) =>
  Appointment.findById(id).populate(POPULATE);

export const createAppointment = (data: Partial<IAppointment>) =>
  Appointment.create(data);

export const updateAppointmentById = (id: string, data: Partial<IAppointment>) =>
  Appointment.findByIdAndUpdate(id, data, { new: true }).populate(POPULATE);

export const deleteAppointmentById = (id: string) =>
  Appointment.findByIdAndDelete(id);

export const countNotifications = (role: string, userId: string) => {
  if (role === 'admin') {
    return Appointment.countDocuments({ status: 'pending' })
  } else if (role === 'artist') {
    return Appointment.countDocuments({ status: 'confirmed', artist: userId })
  } else {
    return Appointment.countDocuments({ status: { $in: ['confirmed', 'cancelled'] }, customer: userId })
  }
}

export const findBookedSlotsByMonth = (year: number, month: number) => {
  const start = new Date(`${year}-${String(month).padStart(2, '0')}-01`)
  const end = new Date(start)
  end.setUTCMonth(end.getUTCMonth() + 1)
  return Appointment.find(
    { appointmentDate: { $gte: start, $lt: end }, status: { $in: ['pending', 'confirmed'] } },
    { appointmentDate: 1, timeSlot: 1 }
  ).lean()
}


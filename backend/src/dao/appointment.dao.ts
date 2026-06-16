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


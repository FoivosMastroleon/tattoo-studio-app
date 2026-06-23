import { IAppointment } from '../models/appointment.model';
import { AppointmentDTO } from '../dto/appointment.dto';
import { IUser } from '../models/user.model';
import { UserDTO } from '../dto/user.dto';  
import { toUserDTO } from './user.mapper';
import { ITattooStyle } from '../models/tattooStyle.model';
import { toTattooStyleDTO } from './tattooStyle.mapper';


export const toAppointmentDTO = (appointment: IAppointment): AppointmentDTO => {
  const customer = appointment.customer as unknown as IUser;
  const artist = appointment.artist as unknown as IUser;
  const tattooStyle = appointment.tattooStyle as unknown as ITattooStyle;
  

  return {
    id: String(appointment._id),
    customer: toUserDTO(customer),
    artist: artist ? toUserDTO(artist) : undefined,
    tattooStyle: toTattooStyleDTO(tattooStyle),
    appointmentDate: appointment.appointmentDate,
    timeSlot: appointment.timeSlot,
    status: appointment.status,
    phone: appointment.phone,
    clientNotes: appointment.clientNotes,
    artistNotes: appointment.artistNotes,
    referenceImageUrl: appointment.referenceImageUrl,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
};

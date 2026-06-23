import { TattooStyleDTO } from "./tattooStyle.dto";
import { UserDTO } from "./user.dto";


export interface AppointmentDTO {
    id: string;
    customer: UserDTO;
    artist?: UserDTO;
    tattooStyle: TattooStyleDTO;
    appointmentDate: Date;
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    phone?: string;
    clientNotes?: string;
    artistNotes?: string;
    referenceImageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
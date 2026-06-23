import { Document, model, Schema, Types } from 'mongoose';

export interface IAppointment extends Document {
    customer: Types.ObjectId;
    artist?: Types.ObjectId;
    tattooStyle: Types.ObjectId;
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

const AppointmentSchema = new Schema<IAppointment>({
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    artist: { type: Schema.Types.ObjectId, ref: 'User' },
    tattooStyle: { type: Schema.Types.ObjectId, ref: 'TattooStyle', required: true },
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    phone: { type: String },
    clientNotes: { type: String },
    artistNotes: { type: String },
    referenceImageUrl: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

export default model<IAppointment>('Appointment', AppointmentSchema);
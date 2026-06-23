import { Types } from 'mongoose';
import * as appointmentDao from '../dao/appointment.dao';
import * as galleryImageDao from '../dao/galleryImage.dao';
import { toAppointmentDTO } from '../mappers/appointment.mapper';
import { CreateAppointmentInput, UpdateAppointmentInput } from '../validators/appointment.validator';

export const getAllAppointments = async (userId: string, role: string) => {
    let appointments;
    if (role === 'customer') {
        appointments = await appointmentDao.findAppointmentsByCustomer(userId);
    } else if (role === 'artist') {
        appointments = await appointmentDao.findAppointmentsByArtist(userId);
    } else {
        appointments = await appointmentDao.findAllAppointments();
    }
    return appointments.map(toAppointmentDTO);
};

export const createAppointment = async (customerId: string, data: CreateAppointmentInput) => {
    const created = await appointmentDao.createAppointment({
        customer: new Types.ObjectId(customerId),
        tattooStyle: new Types.ObjectId(data.tattooStyle),
        appointmentDate: data.appointmentDate,
        timeSlot: data.timeSlot,
        clientNotes: data.clientNotes,
        referenceImageUrl: data.referenceImageUrl,
    });
    const populated = await appointmentDao.findAppointmentById(String(created._id));
    if (!populated) throw new Error('Failed to create appointment');
    return toAppointmentDTO(populated);
};

export const updateAppointment = async (id: string, data: UpdateAppointmentInput) => {
    const appointment = await appointmentDao.findAppointmentById(id);
    if (!appointment) throw new Error('Appointment not found');

    const updateData: Record<string, unknown> = { ...data };
    if (data.artist) updateData.artist = new Types.ObjectId(data.artist);
    if (data.tattooStyle) updateData.tattooStyle = new Types.ObjectId(data.tattooStyle);

    const updated = await appointmentDao.updateAppointmentById(id, updateData as any);
    if (!updated) throw new Error('Update failed');
    return toAppointmentDTO(updated);
};

export const confirmAppointment = async (id: string) => {
    const appointment = await appointmentDao.findAppointmentById(id);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.status !== 'pending') throw new Error('Only pending appointments can be confirmed');

    const updated = await appointmentDao.updateAppointmentById(id, { status: 'confirmed' });
    return toAppointmentDTO(updated!);
};

export const cancelAppointment = async (id: string, userId: string, role: string) => {
    const appointment = await appointmentDao.findAppointmentById(id);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.status === 'completed') throw new Error('Cannot cancel a completed appointment');

    if (role === 'customer') {
        const customerId = String((appointment.customer as any)._id);
        if (customerId !== userId) throw new Error('Forbidden');
        if (appointment.status !== 'pending') throw new Error('Customers can only cancel pending appointments');
    }

    const updated = await appointmentDao.updateAppointmentById(id, { status: 'cancelled' });
    return toAppointmentDTO(updated!);
};

export const completeAppointment = async (id: string, userId: string) => {
    const appointment = await appointmentDao.findAppointmentById(id);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.status !== 'confirmed') throw new Error('Only confirmed appointments can be completed');

    const updated = await appointmentDao.updateAppointmentById(id, { status: 'completed' });

    if (appointment.referenceImageUrl) {
        const styleId = (appointment.tattooStyle as any)._id;
        await galleryImageDao.createGalleryImage({
            title: `${(appointment.tattooStyle as any).name} — Completed`,
            imageUrl: appointment.referenceImageUrl,
            style: styleId,
            uploadedBy: new Types.ObjectId(userId) as any,
        });
    }

    return toAppointmentDTO(updated!);
};

import { Request, Response } from 'express';
import * as appointmentService from '../services/appointment.service';
import { createAppointmentSchema, updateAppointmentSchema } from '../validators/appointment.validator';

export const getAppointments = async (req: Request, res: Response): Promise<void> => {
    try {
        const appointments = await appointmentService.getAllAppointments(req.user!.userId, req.user!.role);
        res.json(appointments);
    } catch (err: unknown) {
        res.status(500).json({ message: 'Failed to fetch appointments' });
    }
};

export const createAppointment = async (req: Request, res: Response): Promise<void> => {
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues[0].message });
        return;
    }
    try {
        const appointment = await appointmentService.createAppointment(req.user!.userId, parsed.data);
        res.status(201).json(appointment);
    } catch (err: unknown) {
        res.status(400).json({ message: err instanceof Error ? err.message : 'Failed to create appointment' });
    }
};

export const updateAppointment = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const parsed = updateAppointmentSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: parsed.error.issues[0].message });
        return;
    }
    try {
        const appointment = await appointmentService.updateAppointment(req.params.id, parsed.data);
        res.json(appointment);
    } catch (err: unknown) {
        res.status(400).json({ message: err instanceof Error ? err.message : 'Update failed' });
    }
};

export const confirmAppointment = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const appointment = await appointmentService.confirmAppointment(req.params.id);
        res.json(appointment);
    } catch (err: unknown) {
        res.status(400).json({ message: err instanceof Error ? err.message : 'Confirm failed' });
    }
};

export const cancelAppointment = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const appointment = await appointmentService.cancelAppointment(req.params.id, req.user!.userId, req.user!.role);
        res.json(appointment);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Cancel failed';
        res.status(message === 'Forbidden' ? 403 : 400).json({ message });
    }
};

export const completeAppointment = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
        const appointment = await appointmentService.completeAppointment(req.params.id);
        res.json(appointment);
    } catch (err: unknown) {
        res.status(400).json({ message: err instanceof Error ? err.message : 'Complete failed' });
    }
};

import { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../services/appointment.service';
import { createAppointmentSchema, updateAppointmentSchema } from '../validators/appointment.validator';
import { AppError } from '../utils/AppError';

export const getAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const appointments = await appointmentService.getAllAppointments(req.user!.userId, req.user!.role);
        res.json(appointments);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to fetch appointments', 500));
    }
};

export const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = createAppointmentSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        const appointment = await appointmentService.createAppointment(req.user!.userId, parsed.data);
        res.status(201).json(appointment);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to create appointment', 400));
    }
};

export const updateAppointment = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    const parsed = updateAppointmentSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        const appointment = await appointmentService.updateAppointment(req.params.id, parsed.data);
        res.json(appointment);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Update failed', 400));
    }
};

export const confirmAppointment = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const appointment = await appointmentService.confirmAppointment(req.params.id);
        res.json(appointment);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Confirm failed', 400));
    }
};

export const cancelAppointment = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const appointment = await appointmentService.cancelAppointment(req.params.id, req.user!.userId, req.user!.role);
        res.json(appointment);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Cancel failed';
        next(new AppError(message, message === 'Forbidden' ? 403 : 400));
    }
};

export const getPendingCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const since = req.query.since ? new Date(req.query.since as string) : undefined;
        const count = await appointmentService.getPendingCount(req.user!.role, req.user!.userId, since);
        res.json({ count });
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to fetch count', 500));
    }
};

export const getBookedSlots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { month } = req.query;
    if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
        next(new AppError('month parameter required (YYYY-MM)', 400));
        return;
    }
    const [year, m] = month.split('-').map(Number);
    try {
        const slots = await appointmentService.getBookedSlotsByMonth(year, m);
        res.json(slots);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to fetch availability', 500));
    }
};

export const completeAppointment = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        const appointment = await appointmentService.completeAppointment(req.params.id, req.user!.userId);
        res.json(appointment);
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Complete failed', 400));
    }
};

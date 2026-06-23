import { Router } from 'express';
import { getAppointments, createAppointment, updateAppointment, confirmAppointment, cancelAppointment, completeAppointment, getBookedSlots, getPendingCount } from '../controller/appointment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.get('/pending-count', getPendingCount);
router.get('/booked-slots', getBookedSlots);
router.get('/', getAppointments);
router.post('/', requireRole('customer', 'admin', 'artist'), createAppointment);
router.patch('/:id', requireRole('admin', 'artist'), updateAppointment);
router.patch('/:id/confirm', requireRole('admin', 'artist'), confirmAppointment);
router.patch('/:id/cancel', requireRole('admin', 'artist', 'customer'), cancelAppointment);
router.patch('/:id/complete', requireRole('admin', 'artist'), completeAppointment);

export default router;

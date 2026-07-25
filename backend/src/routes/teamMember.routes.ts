import { Router } from 'express';
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../controller/teamMember.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', getAllTeamMembers);
router.post('/', authenticate, requireRole('admin'), createTeamMember);
router.put('/:id', authenticate, requireRole('admin'), updateTeamMember);
router.delete('/:id', authenticate, requireRole('admin'), deleteTeamMember);

export default router;

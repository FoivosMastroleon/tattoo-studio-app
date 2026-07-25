import { Request, Response, NextFunction } from 'express';
import * as teamMemberService from '../services/teamMember.service';
import { createTeamMemberSchema, updateTeamMemberSchema } from '../validators/teamMember.validator';
import { AppError } from '../utils/AppError';

export const getAllTeamMembers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.json(await teamMemberService.getAllTeamMembers());
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to fetch team members', 500));
    }
};

export const createTeamMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const parsed = createTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        res.status(201).json(await teamMemberService.createTeamMember(parsed.data));
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Failed to create team member', 400));
    }
};

export const updateTeamMember = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    const parsed = updateTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) { next(new AppError(parsed.error.issues[0].message, 400)); return; }
    try {
        res.json(await teamMemberService.updateTeamMember(req.params.id, parsed.data));
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Team member not found', 404));
    }
};

export const deleteTeamMember = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
        await teamMemberService.deleteTeamMember(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(new AppError(err instanceof Error ? err.message : 'Team member not found', 404));
    }
};

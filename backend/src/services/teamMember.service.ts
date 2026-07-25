import * as teamMemberDao from '../dao/teamMember.dao';
import { toTeamMemberDTO } from '../mappers/teamMember.mapper';
import { CreateTeamMemberInput, UpdateTeamMemberInput } from '../validators/teamMember.validator';

export const getAllTeamMembers = async () => {
    const members = await teamMemberDao.findAllTeamMembers();
    return members.map(toTeamMemberDTO);
};

export const createTeamMember = async (data: CreateTeamMemberInput) => {
    const member = await teamMemberDao.createTeamMember(data);
    return toTeamMemberDTO(member);
};

export const updateTeamMember = async (id: string, data: UpdateTeamMemberInput) => {
    const updated = await teamMemberDao.updateTeamMemberById(id, data);
    if (!updated) throw new Error('Team member not found');
    return toTeamMemberDTO(updated);
};

export const deleteTeamMember = async (id: string) => {
    const member = await teamMemberDao.findTeamMemberById(id);
    if (!member) throw new Error('Team member not found');
    await teamMemberDao.deleteTeamMemberById(id);
};

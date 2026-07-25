import TeamMember, { ITeamMember } from '../models/teamMember.model';

export const findAllTeamMembers = async (): Promise<ITeamMember[]> => {
    return TeamMember.find().sort({ order: 1, name: 1 });
};

export const findTeamMemberById = async (id: string) => {
    return TeamMember.findById(id);
};

export const createTeamMember = async (teamMemberData: Partial<ITeamMember>) => {
    const teamMember = new TeamMember(teamMemberData);
    return teamMember.save();
};

export const updateTeamMemberById = async (id: string, teamMemberData: Partial<ITeamMember>) => {
    return TeamMember.findByIdAndUpdate(id, teamMemberData, { new: true });
};

export const deleteTeamMemberById = async (id: string) => {
    return TeamMember.findByIdAndDelete(id);
};

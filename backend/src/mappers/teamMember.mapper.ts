import { ITeamMember } from '../models/teamMember.model';
import { TeamMemberDTO } from '../dto/teamMember.dto';

export const toTeamMemberDTO = (teamMember: ITeamMember): TeamMemberDTO => ({
    id: String(teamMember._id),
    name: teamMember.name,
    role: teamMember.role,
    imageUrl: teamMember.imageUrl,
    position: teamMember.position,
    order: teamMember.order,
});

import axiosInstance from '@/lib/axiosInstance';
import type { TeamMember } from '@/types';

type TeamMemberData = {
  name: string;
  role: string;
  imageUrl?: string;
  position?: string;
  order?: number;
};

export const getTeamMembers = () =>
  axiosInstance.get<TeamMember[]>('/team').then(r => r.data);

export const createTeamMember = (data: TeamMemberData) =>
  axiosInstance.post<TeamMember>('/team', data).then(r => r.data);

export const updateTeamMember = (id: string, data: Partial<TeamMemberData>) =>
  axiosInstance.put<TeamMember>(`/team/${id}`, data).then(r => r.data);

export const deleteTeamMember = (id: string) =>
  axiosInstance.delete<void>(`/team/${id}`).then(r => r.data);

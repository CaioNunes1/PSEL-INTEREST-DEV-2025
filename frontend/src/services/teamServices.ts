import api from './api';
import { Team, TeamCreate, TeamUpdate, TeamWithMembers, UserTeamCreate } from '../types';

export const teamService = {
  // Listar equipes
  async getTeams(skip: number = 0, limit: number = 100): Promise<TeamWithMembers[]> {
    const response = await api.get(`api/v1/teams/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Criar equipe
  async createTeam(teamData: TeamCreate): Promise<Team> {
    const response = await api.post('api/v1/teams/', teamData);
    return response.data;
  },

  // Buscar equipe por ID
  async getTeam(id: number): Promise<TeamWithMembers> {
    const response = await api.get(`api/v1/teams/${id}`);
    return response.data;
  },

  // Atualizar equipe
  async updateTeam(id: number, teamData: TeamUpdate): Promise<Team> {
    const response = await api.put(`api/v1/teams/${id}`, teamData);
    return response.data;
  },

  // Excluir equipe
  async deleteTeam(id: number): Promise<void> {
    await api.delete(`api/v1/teams/${id}`);
  },

  // Adicionar membro à equipe
  async addMember(teamId: number, userId: number): Promise<any> {
    const memberData: UserTeamCreate = {
      user_id: userId,
      team_id: teamId,
    };
    const response = await api.post(`api/v1/teams/${teamId}/members`, memberData);
    return response.data;
  },

  // Remover membro da equipe
  async removeMember(teamId: number, userId: number): Promise<void> {
    await api.delete(`api/v1/teams/${teamId}/members/${userId}`);
  },

    async getTeamStatistics(): Promise<{
    totalTeams: number;
    averageMembers: number;
    teamsWithoutLeader: number;
  }> {
    const teams = await this.getTeams();
    const totalTeams = teams.length;
    const totalMembers = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0);
    const averageMembers = totalTeams > 0 ? totalMembers / totalTeams : 0;
    const teamsWithoutLeader = teams.filter(team => !team.leader_id).length;

    return {
      totalTeams,
      averageMembers: Math.round(averageMembers * 10) / 10,
      teamsWithoutLeader,
    };
  },
};
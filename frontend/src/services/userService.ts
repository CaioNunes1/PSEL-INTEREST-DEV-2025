import api from './api';
import { User, UserCreate, UserUpdate } from '../types';

export const userService = {
  // Listar usuários
  async getUsers(skip: number = 0, limit: number = 100): Promise<User[]> {
    const response = await api.get(`api/v1/users/?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Criar usuário
  async createUser(userData: UserCreate): Promise<User> {
    const response = await api.post('api/v1/users/', userData);
    return response.data;
  },

  // Atualizar usuário
  async updateUser(id: number, userData: UserUpdate): Promise<User> {
    const response = await api.put(`api/v1/users/${id}`, userData);
    return response.data;
  },

  // Excluir usuário
  async deleteUser(id: number): Promise<void> {
    await api.delete(`api/v1/users/${id}`);
  },

  // Buscar usuário por ID
  async getUser(id: number): Promise<User> {
    const response = await api.get(`api/v1/users/${id}`);
    return response.data;
  },
  
async getUsersWithoutTeam(): Promise<User[]> {
  const users = await this.getUsers();
  return users.filter(user => !user.team_id);
  },
};
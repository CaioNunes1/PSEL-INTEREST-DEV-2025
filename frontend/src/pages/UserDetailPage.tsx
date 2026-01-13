import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { userService } from '../services/userService';
import { teamService } from '../services/teamServices';
import { User, Team, UserUpdate } from '../types/index';
import { HiArrowLeft, HiPencil, HiTrash } from 'react-icons/hi';
import { Button } from '../components/ui/Button';
import UserFormModal from '../components/Users/UserForm';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [transferLoading, setTransferLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser();
      loadTeams();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getUser(parseInt(id!));
      setUser(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching user:', err);
      if (err.response?.status === 404) {
        setError('Usuário não encontrado');
      } else {
        setError('Erro ao carregar usuário');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTeams = async () => {
    try {
      const data = await teamService.getTeams();
      setTeams(data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const handleUpdateUser = async (userData: UserUpdate) => {
    if (!user) return Promise.reject(new Error('Nenhum usuário selecionado'));

    try {
      const updatedUser = await userService.updateUser(user.id, userData);
      setUser(updatedUser);
      setError(null);
      return Promise.resolve();
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  const handleDeleteUser = async () => {
    if (!user || !window.confirm(`Tem certeza que deseja excluir o usuário "${user.full_name}"?`)) {
      return;
    }

    try {
      await userService.deleteUser(user.id);
      navigate('/users');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao excluir usuário');
    }
  };

  const handleTransfer = async () => {
    if (!selectedTeamId || !user) return;

    const teamId = parseInt(selectedTeamId);
    if (teamId === user.team_id) {
      setError('O usuário já está nesta equipe');
      return;
    }

    setTransferLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Se o usuário já está em uma equipe, removê-lo primeiro
      if (user.team_id) {
        try {
          await teamService.removeMember(user.team_id, user.id);
        } catch (err) {
          console.error('Erro ao remover da equipe atual:', err);
        }
      }

      // Adicionar à nova equipe
      await teamService.addMember(teamId, user.id);

      const newTeam = teams.find(team => team.id === teamId);
      setSuccess(`Usuário transferido com sucesso para ${newTeam?.name || 'a nova equipe'}`);
      
      // Recarregar dados do usuário
      await loadUser();
      setSelectedTeamId('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Erro ao transferir usuário';
      setError(errorMessage);
    } finally {
      setTransferLoading(false);
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'N/A';
    }
  };

  const formatDateTime = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Usuário não encontrado.</p>
          <Button
            onClick={() => navigate('/users')}
            variant="outline"
            className="mt-4"
          >
            <HiArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lista de usuários
          </Button>
        </div>
      </div>
    );
  }

  // Filtrar equipes disponíveis
  const availableTeams = teams.filter(team => team.id !== user.team_id);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/users')}
          className="pl-0"
        >
          <HiArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Usuários
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center"
          >
            <HiPencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteUser}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <HiTrash className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-2xl">{user.full_name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant="secondary"
                    className={user.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}
                  >
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Equipe</p>
                  {user.team_id ? (
                    <Link to={`/teams/${user.team_id}`} className="text-sm text-blue-600 hover:underline">
                      {user.team_name || `Equipe ${user.team_id}`}
                    </Link>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma equipe atribuída</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Criado em</p>
                  <p className="text-sm">{formatDate(user.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">ID do Usuário</p>
                  <p className="text-sm font-mono">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transferir Usuário</CardTitle>
              <CardDescription>Mova este usuário para uma equipe diferente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <svg
                      className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-amber-900">Aviso de Transferência</p>
                      <p className="text-sm text-amber-700 text-pretty">
                        Transferir um usuário irá removê-lo de sua equipe atual e adicioná-lo à equipe selecionada.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Selecionar Nova Equipe</label>
                  {availableTeams.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-2 border rounded bg-gray-50">
                      Nenhuma equipe disponível para transferência
                    </div>
                  ) : (
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione uma equipe</option>
                      {availableTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-sm">
                    {success}
                  </div>
                )}

                {availableTeams.length > 0 && selectedTeamId && (
                  <Button
                    onClick={() => {
                      const selectedTeam = teams.find(team => team.id === parseInt(selectedTeamId));
                      if (selectedTeam && window.confirm(
                        user.team_id
                          ? `Transferir ${user.full_name} para a equipe "${selectedTeam.name}"?`
                          : `Adicionar ${user.full_name} à equipe "${selectedTeam.name}"?`
                      )) {
                        handleTransfer();
                      }
                    }}
                    disabled={transferLoading}
                    className="w-full"
                  >
                    {transferLoading ? 'Processando...' : user.team_id ? 'Transferir Usuário' : 'Adicionar à Equipe'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Conta Criada</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(user.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Última Atualização</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(user.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ID do Usuário</span>
                  <span className="text-sm font-mono font-medium">{user.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant="secondary"
                    className={user.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}
                  >
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UserFormModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateUser}
      />
    </div>
  );
};

export default UserDetailPage;
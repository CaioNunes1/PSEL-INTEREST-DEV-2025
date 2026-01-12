import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { teamService } from '../../services/teamServices';
import { userService } from '@/services/userService';
import { TeamWithMembers, User } from '@/types';
import { HiArrowLeft, HiPlus, HiTrash } from 'react-icons/hi';
import AddMemberForm from '../../components/Teams/AddMemberForm';

const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamWithMembers | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    if (id) {
      loadTeam();
      loadAllUsers();
    }
  }, [id]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeam(parseInt(id!));
      setTeam(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching team:', err);
      if (err.response?.status === 404) {
        setError('Equipe não encontrada');
      } else {
        setError('Erro ao carregar equipe');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const users = await userService.getUsers();
      setAllUsers(users);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    }
  };

  const handleAddMember = async (userId: number) => {
    if (!team) return;

    try {
      await teamService.addMember(team.id, userId);
      loadTeam(); // Recarregar dados da equipe
      setShowAddMember(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Erro ao adicionar membro';
      setError(errorMessage);
      
      // Se for erro de usuário já em equipe, mostrar opção de transferência
      if (errorMessage.includes('já está na equipe') || errorMessage.includes('already in team')) {
        const confirmTransfer = window.confirm(
          `${errorMessage}\n\nDeseja transferir o usuário para esta equipe?`
        );
        if (confirmTransfer) {
          try {
            await teamService.addMember(team.id, userId);
            loadTeam();
            setShowAddMember(false);
          } catch (transferErr) {
            setError('Erro ao transferir usuário');
          }
        }
      }
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!team || !window.confirm('Remover membro da equipe?')) return;

    try {
      await teamService.removeMember(team.id, userId);
      loadTeam(); // Recarregar dados da equipe
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao remover membro');
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

  const activeMembersCount = team?.members?.filter(member => member.is_active).length || 0;

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Equipe não encontrada.</p>
          <Button
            onClick={() => navigate('/teams')}
            variant="outline"
            className="mt-4"
          >
            <HiArrowLeft className="w-4 h-4 mr-2" />
            Voltar para lista de equipes
          </Button>
        </div>
      </div>
    );
  }

  const availableUsers = allUsers.filter(
    user => !team.members?.some(member => member.id === user.id)
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/teams')}
          className="mb-4 pl-0"
        >
          <HiArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Equipes
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">{team.name}</h1>
            <p className="text-muted-foreground text-balance">
              {team.description || "Sem descrição"}
            </p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {team.members?.length || 0} {team.members?.length === 1 ? 'membro' : 'membros'}
          </Badge>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.members?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembersCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Criada em</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDate(team.created_at)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Membros da Equipe</CardTitle>
              <CardDescription>Todos os membros desta equipe</CardDescription>
            </div>
            <Button onClick={() => setShowAddMember(true)}>
              <HiPlus className="w-4 h-4 mr-2" />
              Adicionar Membro
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                          {member.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.full_name}</p>
                          {team.leader?.id === member.id && (
                            <Badge className="bg-yellow-100 text-yellow-700 mt-1">
                              Líder
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          member.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                        }
                      >
                        {member.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/users/${member.id}`}>Ver Perfil</Link>
                        </Button>
                        {team.leader?.id !== member.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <HiTrash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!team.members || team.members.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <p className="text-sm text-muted-foreground">Nenhum membro nesta equipe</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {showAddMember && (
        <AddMemberForm
          team={team}
          availableUsers={availableUsers}
          onAddMember={handleAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}
    </div>
  );
};

export default TeamDetailPage;
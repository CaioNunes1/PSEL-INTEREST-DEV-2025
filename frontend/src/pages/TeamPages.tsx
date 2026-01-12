import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { teamService } from '../services/teamServices';
import { TeamWithMembers } from '../types';
import { HiPlus } from 'react-icons/hi';
import TeamForm from '../components/Teams/TeamForm';

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeams();
      setTeams(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Erro ao carregar equipes');
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    loadTeams();
  };

  const handleDeleteTeam = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta equipe?')) {
      try {
        await teamService.deleteTeam(id);
        setTeams(teams.filter(team => team.id !== id));
      } catch (err) {
        setError('Erro ao excluir equipe');
      }
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Equipes</h1>
            <p className="text-muted-foreground text-balance">Gerencie e visualize todas as equipes</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <HiPlus className="w-5 h-5 mr-2" />
            Nova Equipe
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Link key={team.id} to={`/teams/${team.id}`} className="block">
            <Card className="h-full transition-shadow hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {team.members?.length || 0} {team.members?.length === 1 ? 'membro' : 'membros'}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {team.description || "Sem descrição"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Criada em {formatDate(team.created_at)}
                  </div>
                  {team.leader && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Líder:</span>
                      <span className="font-medium">{team.leader.full_name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {teams.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg
                className="h-12 w-12 text-muted-foreground mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-sm text-muted-foreground mb-4">Nenhuma equipe encontrada</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Criar primeira equipe
              </button>
            </CardContent>
          </Card>
        )}
      </div>

      {showForm && <TeamForm onClose={handleFormClose} />}
    </div>
  );
};

export default TeamsPage;
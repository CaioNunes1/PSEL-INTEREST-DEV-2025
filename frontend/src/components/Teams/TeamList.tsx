import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamService } from '../../services/teamServices';
import { TeamWithMembers } from '../../types';
import TeamCard from './TeamCard';
import TeamForm from './TeamForm';
import { HiPlus } from 'react-icons/hi';

const TeamList: React.FC = () => {
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
      setError('Erro ao carregar equipes');
      console.error(err);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Equipes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <HiPlus className="w-5 h-5 mr-2" />
          Nova Equipe
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma equipe cadastrada.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Criar primeira equipe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link key={team.id} to={`/teams/${team.id}`}>
              <TeamCard team={team} onDelete={handleDeleteTeam} />
            </Link>
          ))}
        </div>
      )}

      {showForm && <TeamForm onClose={handleFormClose} />}
    </div>
  );
};

export default TeamList;
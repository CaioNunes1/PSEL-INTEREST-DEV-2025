import React from 'react';
import { Link } from 'react-router-dom';
import { TeamWithMembers } from '../../types';
import { 
  HiUsers, 
  HiUserCircle, 
  HiChevronRight,
  HiTrash 
} from 'react-icons/hi';
import { FaUserTie } from 'react-icons/fa';

interface TeamCardProps {
  team: TeamWithMembers;
  onDelete: (id: number) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a equipe "${team.name}"?`)) {
      onDelete(team.id);
    }
  };

  return (
    <Link to={`/teams/${team.id}`}>
      <div className="card group hover:shadow-2xl hover:border-blue-300 transition-all duration-300">
        <div className="card-body">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                  <HiUsers className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {team.name}
                </h3>
              </div>

              {/* Líder da equipe */}
              {team.leader && (
                <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                  <FaUserTie className="w-5 h-5 text-indigo-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Líder</p>
                    <p className="text-sm text-gray-600">{team.leader.full_name}</p>
                  </div>
                </div>
              )}

              {/* Membros */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Membros</span>
                  <span className="badge badge-primary">
                    {team.members?.length || 0}
                  </span>
                </div>
                
                {team.members && team.members.length > 0 && (
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 5).map((member, index) => (
                      <div 
                        key={member.id} 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-white"
                        title={member.full_name}
                      >
                        <span className="text-xs font-bold text-white">
                          {member.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {team.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white">
                        <span className="text-xs font-bold text-gray-700">
                          +{team.members.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Ações e seta */}
            <div className="flex flex-col items-end justify-between h-full">
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors mb-4"
                title="Excluir equipe"
              >
                <HiTrash className="w-5 h-5" />
              </button>
              
              <HiChevronRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>

          {/* Detalhes adicionais */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Criado em: {team.created_at ? new Date(team.created_at).toLocaleDateString('pt-BR') : 'N/A'}
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Ver detalhes
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;
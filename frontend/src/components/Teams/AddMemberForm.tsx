import React, { useState } from 'react';
import { TeamWithMembers, User } from '../../types';
import { HiX } from 'react-icons/hi';

interface AddMemberFormProps {
  team: TeamWithMembers;
  availableUsers: User[];
  onAddMember: (userId: number) => void;
  onClose: () => void;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({
  team,
  availableUsers,
  onAddMember,
  onClose,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setLoading(true);
    try {
      await onAddMember(selectedUserId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Adicionar Membro à {team.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione um usuário
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={availableUsers.length === 0}
            >
              <option value="">Selecione...</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            
            {availableUsers.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Todos os usuários já estão nesta equipe.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedUserId || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberForm;
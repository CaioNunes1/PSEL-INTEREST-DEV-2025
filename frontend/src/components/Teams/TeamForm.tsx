import React, { useState, useEffect } from 'react';
import { teamService } from '../../services/teamServices';
import { userService } from '../../services/userService';
import { User, TeamCreate } from '../../types';
import { HiX } from 'react-icons/hi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/Select';

interface TeamFormProps {
  teamId?: number;
  onClose: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ teamId, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leaderId, setLeaderId] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
    if (teamId) {
      loadTeam();
    }
  }, [teamId]);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    }
  };

  const loadTeam = async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      const team = await teamService.getTeam(teamId);
      setName(team.name);
      setDescription(team.description || '');
      setLeaderId(team.leader_id.toString());
    } catch (err) {
      setError('Erro ao carregar equipe');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !leaderId) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    const teamData: TeamCreate = {
      name: name.trim(),
      description: description.trim() || undefined,
      leader_id: parseInt(leaderId),
    };

    setLoading(true);
    setError(null);

    try {
      if (teamId) {
        await teamService.updateTeam(teamId, teamData);
      } else {
        await teamService.createTeam(teamData);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao salvar equipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {teamId ? 'Editar Equipe' : 'Nova Equipe'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <Label htmlFor="name">Nome da Equipe *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome da equipe"
              required
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da equipe (opcional)"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="leader">Líder da Equipe *</Label>
            <Select value={leaderId} onValueChange={setLeaderId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um líder" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.full_name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Salvando...' : teamId ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
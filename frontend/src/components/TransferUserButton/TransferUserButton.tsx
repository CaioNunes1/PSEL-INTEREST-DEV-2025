import React, { useState } from 'react';
import { Team } from '../../types';
import { teamService } from '../../services/teamServices';
import { Button } from '../ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';

interface TransferUserButtonProps {
  userId: number;
  userName: string;
  currentTeamId?: number;
  currentTeamName?: string;
  allTeams: Team[];
  onTransferSuccess?: () => void;
}

export const TransferUserButton: React.FC<TransferUserButtonProps> = ({
  userId,
  userName,
  currentTeamId,
  currentTeamName,
  allTeams,
  onTransferSuccess,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filtrar equipes disponíveis (remover a equipe atual se existir)
  const availableTeams = allTeams.filter(team => team.id !== currentTeamId);

  const handleTransfer = async () => {
    if (!selectedTeamId) {
      setError('Selecione uma equipe para transferir');
      return;
    }

    const teamId = parseInt(selectedTeamId);
    if (teamId === currentTeamId) {
      setError('O usuário já está nesta equipe');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Primeiro, se o usuário já está em uma equipe, precisamos removê-lo
      if (currentTeamId) {
        try {
          await teamService.removeMember(currentTeamId, userId);
        } catch (err) {
          console.error('Erro ao remover membro da equipe atual:', err);
        }
      }

      // Agora adicionar à nova equipe
      await teamService.addMember(teamId, userId);

      const newTeam = allTeams.find(team => team.id === teamId);
      setSuccess(`Usuário ${userName} transferido com sucesso para ${newTeam?.name || 'a nova equipe'}`);
      
      // Limpar seleção
      setSelectedTeamId('');
      
      // Chamar callback de sucesso
      if (onTransferSuccess) {
        onTransferSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Erro ao transferir usuário';
      setError(errorMessage);
      
      // Tratamento especial para usuário já em equipe
      if (errorMessage.includes('já está na equipe') || errorMessage.includes('already in team')) {
        setError(`${errorMessage}. Por favor, selecione outra equipe.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = () => {
    if (!selectedTeamId) return;

    const selectedTeam = allTeams.find(team => team.id === parseInt(selectedTeamId));
    if (!selectedTeam) return;

    const confirmationMessage = currentTeamId
      ? `Tem certeza que deseja transferir ${userName} da equipe "${currentTeamName || currentTeamId}" para a equipe "${selectedTeam.name}"?`
      : `Tem certeza que deseja adicionar ${userName} à equipe "${selectedTeam.name}"?`;

    if (window.confirm(confirmationMessage)) {
      handleTransfer();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Selecionar Nova Equipe</label>
        {availableTeams.length === 0 ? (
          <div className="text-sm text-muted-foreground p-2 border rounded bg-gray-50">
            Nenhuma equipe disponível para transferência
          </div>
        ) : (
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma equipe" />
            </SelectTrigger>
            <SelectContent>
              {availableTeams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {currentTeamId && (
        <div className="text-sm text-muted-foreground">
          Usuário atualmente na equipe: <span className="font-medium">{currentTeamName || `Equipe ${currentTeamId}`}</span>
        </div>
      )}

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

      {availableTeams.length > 0 && (
        <Button
          onClick={handleConfirmation}
          disabled={!selectedTeamId || loading}
          className="w-full"
        >
          {loading ? 'Processando...' : currentTeamId ? 'Transferir Usuário' : 'Adicionar à Equipe'}
        </Button>
      )}

      <div className="text-xs text-muted-foreground">
        {currentTeamId
          ? 'A transferência removerá o usuário da equipe atual e o adicionará à equipe selecionada.'
          : 'Esta ação adicionará o usuário à equipe selecionada.'}
      </div>
    </div>
  );
};
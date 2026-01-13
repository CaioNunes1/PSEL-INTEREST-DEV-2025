import React, { useEffect, useState } from 'react';
import { User, UserCreate, UserUpdate } from '../../types/index';
import { HiX } from 'react-icons/hi';
import { Button } from '../ui/Button';

interface UserFormModalProps {
  user?: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserCreate | UserUpdate) => Promise<void>;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [is_active, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setEmail(user.email);
      setIsActive(user.is_active);
    } else {
      resetForm();
    }
  }, [user]);

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setIsActive(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!full_name.trim() || !email.trim()) {
      setError('Nome completo e email são obrigatórios');
      return;
    }

    if (!email.includes('@')) {
      setError('Email inválido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = user 
        ? { full_name, email, is_active } as UserUpdate
        : { full_name, email } as UserCreate;

      await onSubmit(userData);
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-medium">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o email"
                required
              />
            </div>

            {user && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={is_active}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Usuário ativo</span>
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
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
              {loading ? 'Salvando...' : user ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
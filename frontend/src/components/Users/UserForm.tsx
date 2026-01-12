import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, UserCreate } from '../../types';
import { HiX } from 'react-icons/hi';

interface UserFormProps {
  user: User | null;
  onSubmit: (data: UserCreate) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserCreate>();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    } else {
      reset({
        name: '',
        email: '',
      });
    }
  }, [user, reset]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Nome é obrigatório' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o nome"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {user ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
import React from 'react';
import { User } from '../../types';
import { HiPencil, HiTrash, HiUser, HiMail, HiUserGroup } from 'react-icons/hi';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <div className="card group hover:scale-[1.02] transition-transform duration-300">
      <div className="card-body">
        <div className="flex items-start justify-between">
          {/* Avatar e info */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <HiUser className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {user.full_name}
              </h3>
              <div className="flex items-center mt-1 text-gray-600">
                <HiMail className="w-4 h-4 mr-2" />
                <span className="text-sm">{user.email}</span>
              </div>
              
              {user.team_name && (
                <div className="flex items-center mt-2">
                  <HiUserGroup className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600">
                    {user.team_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(user)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="Editar"
            >
              <HiPencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(user.id)}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Excluir"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status e tags */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {user.is_active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <span className="badge badge-primary">
              ID: {user.id}
            </span>
            {user.team_id && (
              <span className="badge badge-success">
                Equipe: {user.team_id}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
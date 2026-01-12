import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { User } from '../../types';
import UserCard from './UserCard';
import UserForm from './UserForm';
import { HiPlus } from 'react-icons/hi';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        setError('Erro ao excluir usuário');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleFormSubmit = async (userData: any) => {
    try {
      if (editingUser) {
        const updatedUser = await userService.updateUser(editingUser.id, userData);
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      } else {
        const newUser = await userService.createUser(userData);
        setUsers([...users, newUser]);
      }
      handleFormClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao salvar usuário');
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
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <button
          onClick={handleCreateUser}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <HiPlus className="w-5 h-5 mr-2" />
          Novo Usuário
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ))}
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default UserList;
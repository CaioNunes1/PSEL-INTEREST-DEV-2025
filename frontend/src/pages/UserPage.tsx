import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { UsersTable } from '../components/UsersTable/Users-table';
import { userService } from '../services/userService';
import { User, UserCreate, UserUpdate } from '../types/index';
import { HiPlus } from 'react-icons/hi';
import UserFormModal from '../components/Users/UserForm';
import { Button } from '../components/ui/Button';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Falha ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: UserCreate) => {
    try {
      const newUser = await userService.createUser(userData);
      setUsers([...users, newUser]);
      return Promise.resolve();
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  const handleUpdateUser = async (userData: UserUpdate) => {
    if (!editingUser) return Promise.reject(new Error('Nenhum usuário selecionado'));

    try {
      const updatedUser = await userService.updateUser(editingUser.id, userData);
      setUsers(users.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      return Promise.resolve();
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao excluir usuário');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleModalSubmit = async (userData: UserCreate | UserUpdate) => {
    if (editingUser) {
      await handleUpdateUser(userData as UserUpdate);
    } else {
      await handleCreateUser(userData as UserCreate);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_active).length;

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Usuários</h1>
          <p className="text-muted-foreground text-balance">Gerencie e visualize todos os usuários</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {totalUsers} total, {activeUsers} ativos
          </div>
          <Button onClick={handleNewUser} className="flex items-center">
            <HiPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários</CardTitle>
          <CardDescription>Lista de todos os usuários do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable 
            users={users} 
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <UserFormModal
        user={editingUser}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default UsersPage;
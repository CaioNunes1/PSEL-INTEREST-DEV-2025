import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { UsersTable } from '../components/UsersTable/Users-table';
import { userService } from '../services/userService';
import { User } from '../types/index';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
          <h1 className="text-3xl font-bold text-balance">Users</h1>
          <p className="text-muted-foreground text-balance">Manage and view all users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {totalUsers} total, {activeUsers} active
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
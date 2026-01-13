import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { User } from '../../types/index';
import { HiPencil, HiTrash } from 'react-icons/hi';

interface UsersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (id: number) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  onEditUser, 
  onDeleteUser 
}) => {
  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${name}"?`)) {
      onDeleteUser(id);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuário</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Equipe</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    user.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                  }
                >
                  {user.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                {user.team_name ? (
                  <Link to={`/teams/${user.team_id}`} className="text-sm text-blue-600 hover:underline">
                    {user.team_name}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">Sem equipe</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditUser(user)}
                    title="Editar usuário"
                  >
                    <HiPencil className="w-4 h-4" />
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                  >
                    <Link to={`/users/${user.id}`}>Ver</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(user.id, user.full_name)}
                    title="Excluir usuário"
                  >
                    <HiTrash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <p className="text-sm text-muted-foreground">Nenhum usuário encontrado</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
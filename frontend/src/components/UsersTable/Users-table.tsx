import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { User } from '../../types';

interface UsersTableProps {
  users: User[];
}

export const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                {user.team_name ? (
                  <Link to={`/teams/${user.team_id}`} className="text-sm text-blue-600 hover:underline">
                    {user.team_name}
                  </Link>
                ) : (
                  <span className="text-sm text-muted-foreground">No team</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/users/${user.id}`}>View Profile</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <p className="text-sm text-muted-foreground">No users found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
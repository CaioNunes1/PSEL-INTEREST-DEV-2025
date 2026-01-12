import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { userService } from '../services/userService';
import { teamService } from '../services/teamServices';
import { User } from '@/types';
import { format } from 'date-fns';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTeams: 0,
    adminCount: 0,
    managerCount: 0,
    userCount: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [users, teams] = await Promise.all([
          userService.getUsers(),
          teamService.getTeams(),
        ]);

        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.is_active).length;
        const totalTeams = teams.length;

        // Note: Your API doesn't have roles yet, so we'll use placeholders
        const adminCount = Math.floor(totalUsers * 0.1); // 10% as admins for demo
        const managerCount = Math.floor(totalUsers * 0.2); // 20% as managers for demo
        const userCount = totalUsers - adminCount - managerCount;

        setStats({
          totalUsers,
          activeUsers,
          totalTeams,
          adminCount,
          managerCount,
          userCount,
        });

        // Sort users by created_at (newest first) and take first 5
        const sortedUsers = [...users]
          .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 5);
        setRecentUsers(sortedUsers);
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format date safely
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper function to get last registered date
  const getLastRegisteredDate = (): string => {
    if (recentUsers.length === 0) return 'N/A';
    
    const firstUser = recentUsers[0];
    if (!firstUser.created_at) return 'N/A';
    
    return formatDate(firstUser.created_at);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground text-balance">Overview of users and teams</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{stats.activeUsers} active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeams}</div>
            <p className="text-xs text-muted-foreground">Active teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users Without Team</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentUsers.filter(u => !u.team_id).length}
            </div>
            <p className="text-xs text-muted-foreground">Available for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getLastRegisteredDate()}
            </div>
            <p className="text-xs text-muted-foreground">Last user registered</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No users yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Distribution</CardTitle>
            <CardDescription>Users by team assignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-600" />
                  <span className="text-sm font-medium">With Team</span>
                </div>
                <span className="text-sm font-bold">
                  {recentUsers.filter(u => u.team_id).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-purple-600" />
                  <span className="text-sm font-medium">Without Team</span>
                </div>
                <span className="text-sm font-bold">
                  {recentUsers.filter(u => !u.team_id).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
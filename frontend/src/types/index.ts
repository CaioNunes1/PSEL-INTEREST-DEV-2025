export interface User {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  team_id?: number | null;
  team_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  leader_id: number;
  member_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TeamWithMembers extends Team {
  members: User[];
  leader?: User;
}

export interface UserTeamCreate {
  user_id: number;
  team_id: number;
}

export interface UserCreate {
  full_name: string;
  email: string;
}

export interface UserUpdate {
  full_name?: string;
  email?: string;
}

export interface TeamCreate {
  name: string;
  description?: string;
  leader_id: number;
}

export interface TeamUpdate {
  name?: string;
  description?: string;
  leader_id?: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTeams: number;
  adminCount: number;
  managerCount: number;
  userCount: number;
}
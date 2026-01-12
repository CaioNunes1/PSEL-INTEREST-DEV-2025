import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import DashboardPage from './pages/Dashboard-page';
import UsersPage from './pages/UserPage';
import UserDetailPage from './pages/UserDetailPage';
import TeamsPage from './pages/TeamPages';
import TeamDetailPage from './pages/TeamDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id" element={<UserDetailPage />} /> 
          <Route path="teams" element={<TeamsPage />} />
          <Route path="teams/:id" element={<TeamDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
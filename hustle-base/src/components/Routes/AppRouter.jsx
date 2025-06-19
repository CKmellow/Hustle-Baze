import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import EmployerLayout from '../EmployerView/EmployerLayout';
import UniLayout from '../Uni-View/UniLayout';
import StudentLayout from '../studview/StudLayout';
import LoginPage from '../LoginPage';
import HomePage from '../HomePage';
import VerifyEmail from '../VerifyEmail';
import ViewAnalytics from '../Uni-View/ViewAnalytics';
import AnalyticsLayout from '../Uni-View/AnalyticsLayout';

<Route path="/verify-email" element={<VerifyEmail />} />



const RoleRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token && user) {
      if (user.role === 'student') {
        navigate('/student');
      } else if (user.role === 'employer') {
        navigate('/employer');
      } else if (user.role === 'CareerOfficer') {
        navigate('/career-dashboard');
      }
    }
  }, [navigate]);

  return <HomePage />; // fallback UI if no user
};

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <Routes>
          {/* Redirects to role-specific dashboard if logged in */}

          <Route path="/" element={<RoleRedirector />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />

          <Route
            path="/employer"
            element={<ProtectedRoute element={<EmployerLayout />} />}
          />
          <Route
            path="/student"
            element={<ProtectedRoute element={<StudentLayout />} />}
          />
          <Route path="/analytics" element={<ViewAnalytics />} />
          <Route path="/analytics-dashboard" element={<AnalyticsLayout />} />
          <Route
            path="/career-dashboard"
            element={<ProtectedRoute element={<UniLayout />} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;

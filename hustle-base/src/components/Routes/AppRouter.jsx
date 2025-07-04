import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import EmployerLayout from '../EmployerView/EmployerLayout';
import UniLayout from '../Uni-View/UniLayout';
import StudentLayout from '../studview/StudLayout';
import StudentProfile from '../studview/StudentProfile';
import LoginPage from '../LoginPage';
import HomePage from '../HomePage';
import VerifyEmail from '../VerifyEmail';
import ViewAnalytics from '../Uni-View/ViewAnalytics';
import AnalyticsLayout from '../Uni-View/AnalyticsLayout';
import VerifyOrgLayout from '../Uni-View/VerifyOrgLayout';
import CareerOfficerProfile from '../Uni-View/CareerOfficerProfile';
import ForgotPassword from '../ForgotPassword';
import ResetPassword from '../ResetPassword';
import AvailableInternships from '../AvailableInternships'; // adjust path if needed
import ManageUsers from '../Uni-View/ManageUsers';



<Route path="/verify-email" element={<VerifyEmail />} />



const RoleRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const validateToken = async () => {
      if (!user || !token) {
        return navigate("/login");
      }

      try {
        const res = await fetch("http://localhost:5000/api/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          // Token expired or invalid
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          return navigate("/login");
        }

        // Valid token — redirect by role
        if (user.role === 'student') {
          navigate('/student');
        } else if (user.role === 'employer') {
          navigate('/employer');
        } else if (user.role === 'CareerOfficer') {
          navigate('/career-dashboard');
        }
      } catch (err) {
        console.error("Token validation failed:", err);
        navigate("/login");
      }
    };

    validateToken();
  }, [navigate]);

  return <HomePage />;
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
          
          <Route path="/profile" element={<CareerOfficerProfile />} />
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/internships" element={<AvailableInternships />} />
          <Route path="/verify-organizations" element={<VerifyOrgLayout />} />
          <Route path="/analytics-dashboard" element={<AnalyticsLayout />} />
          <Route
            path="/career-dashboard"
            element={<ProtectedRoute element={<UniLayout />} />}
          />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/students/profile/:id" element={<StudentProfile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import EmployerLayout from '../EmployerView/EmployerLayout';
import UniLayout from '../Uni-View/UniLayout';
import StudentLayout from '../studview/StudLayout';
import LoginPage from '../LoginPage';
import NavBar from '../NavBar';
import LandingPage from '../LandingPage';

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        {/*<NavBar />  ✅ Placed outside Routes */}
        <Routes>
          /*  Landing Page to open first */
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<LandingPage />} /> {/* Landing page */}

          <Route
            path="/employer"
            element={
              <ProtectedRoute element={<EmployerLayout />} />
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute element={<StudentLayout />} />
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute element={<UniLayout />} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;

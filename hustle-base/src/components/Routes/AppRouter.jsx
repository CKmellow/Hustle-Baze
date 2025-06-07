import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import EmployerLayout from '../EmployerView/EmployerLayout';
import UniLayout from '../Uni-View/UniLayout';
import StudentLayout from '../studview/StudLayout';
import LoginPage from '../LoginPage';
import LandingPage from '../LandingPage';


const AppRouter = () => {


    return (
        <Router>
            <div className="min-h-screen bg-gray-100 p-8">
                {/* Routes */}
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    
                    {/* Pass props to employer */}
                    <Route 
                        path="/employer" 
                        element={
                            <ProtectedRoute 
                                element={<EmployerLayout />} 
                            />
                        } 
                    />


                    {/* Pass props to Student */}
                    <Route 
                        path="/student" 
                        element={
                            <ProtectedRoute 
                                element={<StudentLayout />} 
                            />
                        } 
                    />

                     {/* Staff (Career Officer) Route */}
                     <Route 
                        path="/staff" 
                        element={
                            <ProtectedRoute 
                               element={<UniLayout />} 
                            />
                        } 
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default AppRouter;
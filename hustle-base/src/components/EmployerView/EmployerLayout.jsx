import React, { useState } from 'react';
// import AdminSidebar from './AdminSidebar';
// import AdminDashboard from './AdminDashboard';
// import CreateSession from './CreateSession';
// import './AdminLayout.css';
import EmployerDash from './EmployerDash';

const EmployerLayout = () => {
    const [activePage, setActivePage] = useState("dashboard");

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return <EmployerDash />;
            case "create":
                //return <CreateSession />;
            default:
               // return <AdminDashboard />;
        }
    };

    return (
        <div className="employer-layout">
            <div className="sidebar-container">
                {/* <AdminSidebar setActivePage={setActivePage} /> */}
            </div>
            <div className="content-container">
                {renderPage()}
            </div>
        </div>
    );
};

export default EmployerLayout;

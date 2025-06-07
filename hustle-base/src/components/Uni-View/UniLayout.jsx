import React, { useState } from 'react';


const UniLayout = () => {
    const [activePage, setActivePage] = useState("dashboard");

    const renderPage = () => {
        switch (activePage) {
            case "dashboard":
                return ;
            case "create":
            return ;
            default:
                return ;
        }
    };

    return (
        <div className="uni-layout">
            <div className="sidebar-container">
                {/* //<AdminSidebar setActivePage={setActivePage} /> */}
            </div>
            <div className="content-container">
                {renderPage()}
            </div>
        </div>
    );
};

export default UniLayout;

import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Install using: npm install jwt-decode

const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (!token) {
        return <Navigate to="/student" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decoded.exp < currentTime) {
            // Token expired, redirect to login
            localStorage.removeItem("token"); // Clear expired token
            return <Navigate to="/" replace />;
        }

        return element; // Allow access if token is valid
    } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // Remove corrupted token
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;
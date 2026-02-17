import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement, allowedRoles?: string[] }) => {
    // Mock authentication check
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        console.warn(`ProtectedRoute: Access denied for role ${user.role}. Allowed: ${allowedRoles}`);
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;

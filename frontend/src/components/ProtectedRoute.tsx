import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    component: React.ComponentType;
    redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, redirectTo }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to={redirectTo} /> : <Component />;
};

export default ProtectedRoute;

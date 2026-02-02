import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../domain/types';

interface Props {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Basic redirect - in a router like react-router-dom we would use <Navigate />
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">Access Denied</h2>
        <p className="text-gray-600 mb-4">You must be logged in to view this page.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-red-600 mb-2">403 - Forbidden</h2>
        <p className="text-gray-600">You do not have permission to access this resource.</p>
      </div>
    );
  }

  return <>{children}</>;
};
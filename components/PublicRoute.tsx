
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (user) {
    // If logged in, send directly to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

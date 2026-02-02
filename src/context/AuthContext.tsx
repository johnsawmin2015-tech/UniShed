import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, Role } from '../domain/types';
import { AuthService, LoginCredentials, RegisterData } from '../application/authService';

interface AuthContextType extends AuthState {
  login: (creds: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });

  // Check for existing session on mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setAuth({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (creds: LoginCredentials) => {
    const result = await AuthService.login(creds);
    if (result.success && result.user) {
      setAuth({ user: result.user, isAuthenticated: true });
    }
    return result;
  };

  const register = async (data: RegisterData) => {
    const result = await AuthService.registerStudent(data);
    if (result.success && result.user) {
      setAuth({ user: result.user, isAuthenticated: true });
    }
    return result;
  };

  const logout = () => {
    AuthService.logout();
    setAuth({ user: null, isAuthenticated: false });
  };

  // Computed role properties
  const isAdmin = auth.user?.role === 'ADMIN';
  const isStudent = auth.user?.role === 'STUDENT';

  return (
    <AuthContext.Provider value={{
      ...auth,
      login,
      register,
      logout,
      isAdmin,
      isStudent
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Utility hook for protected routes
export const useRequireAuth = (requiredRole?: Role) => {
  const auth = useAuth();

  const isAuthorized = () => {
    if (!auth.isAuthenticated) return false;
    if (!requiredRole) return true;
    return auth.user?.role === requiredRole;
  };

  return {
    ...auth,
    isAuthorized: isAuthorized(),
  };
};
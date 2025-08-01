import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, AuthContextType } from '../types/auth';
import { authService } from '../services/authApi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Verify token and get user info
      authService.getCurrentUser(storedToken)
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const authToken = await authService.login(credentials);
      const userData = await authService.getCurrentUser(authToken.access_token);
      
      setToken(authToken.access_token);
      setUser(userData);
      localStorage.setItem('token', authToken.access_token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await authService.register(data);
      // Auto-login after registration
      await login({ email: data.email, password: data.password });
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    authService.logout().catch(() => {
      // Ignore logout errors
    });
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
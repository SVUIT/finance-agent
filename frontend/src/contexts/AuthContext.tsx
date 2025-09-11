import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Verify token with server
      refreshUser();
    }
    setIsLoading(false);
  }, []);

  const refreshUser = async (): Promise<void> => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } else {
        // Token is invalid, logout user
        logout();
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // On error, keep current user data
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.access_token);
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Đăng nhập thất bại' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Lỗi kết nối đến server' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.access_token);
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Đăng ký thất bại' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Lỗi kết nối đến server' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    refreshUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


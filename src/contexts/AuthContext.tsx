import { createContext, ReactElement } from 'react';
import LoginResponse from '../types/LoginResponse';
import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useNotification } from '../hooks/useNotification';

export type AuthContextType = {
  user: LoginResponse | null;
  authenticate: (login: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const api = useApi();
  const notification = useNotification();

  useEffect(() => {
    const token = localStorage.getItem('TOKEN');
    if (token)
      setUser({
        token: token ?? '',
        name: localStorage.getItem('NAME') ?? '',
        permissions: JSON.parse(localStorage.getItem('PERMISSIONS') ?? ''),
      });
    setIsLoading(false);
  }, []);

  const authenticate = async (login: string, password: string) => {
    try {
      const data = await api.login(login, password);
      setUser(data);
      localStorage.clear();
      localStorage.setItem('TOKEN', data.token);
      localStorage.setItem('NAME', data.name);
      localStorage.setItem('PERMISSIONS', JSON.stringify(data.permissions));
    } catch (ex: any) {
      notification.alert('error', ex);
      return false;
    }
    return true;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authenticate, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
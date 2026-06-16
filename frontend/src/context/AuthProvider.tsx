import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login, register, googleLogin } from '@/api/auth';
import type { LoginFields, RegisterFields } from '@/schemas/auth';
import type { User, UserRole } from '@/types';

type JwtPayload = {
  userId: string;
  role: UserRole;
};

type AuthContextProps = {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginUser: (fields: LoginFields) => Promise<void>;
  registerUser: (fields: RegisterFields) => Promise<void>;
  googleLoginUser: (idToken: string) => Promise<void>;
  logoutUser: () => void;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function readRoleFromToken(token: string | null): UserRole | null {
  if (!token) return null;
  try {
    return jwtDecode<JwtPayload>(token).role ?? null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  );
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const saveAuth = (newUser: User, newToken: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const loginUser = async (fields: LoginFields) => {
    const res = await login(fields);
    saveAuth(res.user, res.token);
  };

  const registerUser = async (fields: RegisterFields) => {
    const res = await register(fields);
    saveAuth(res.user, res.token);
  };

  const googleLoginUser = async (idToken: string) => {
    const res = await googleLogin(idToken);
    saveAuth(res.user, res.token);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      role: readRoleFromToken(token),
      isAuthenticated: !!token,
      loginUser,
      registerUser,
      googleLoginUser,
      logoutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

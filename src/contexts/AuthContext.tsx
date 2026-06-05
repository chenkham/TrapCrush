import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../lib/types';
import { signIn, signUp, signOut, getSession, signInWithProvider, updateUser } from '../lib/mockDb';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithProvider: (provider: string) => Promise<void>;
  updateUserProfile: (name: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (userId: string, secret: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession().then((session) => {
      setUser(session);
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const u = await signIn(email, password);
    setUser(u);
  };

  const register = async (email: string, password: string, name: string) => {
    const u = await signUp(email, password, name);
    setUser(u);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const loginWithProvider = async (provider: string) => {
    await signInWithProvider(provider);
  };

  const updateUserProfile = async (name: string) => {
    if (!user) return;
    const updated = await updateUser(user.id, name);
    setUser(updated);
  };

  const sendVerificationEmail = async () => {
    const { sendVerificationEmail: dbSend } = await import('../lib/mockDb');
    await dbSend();
  };

  const verifyEmail = async (userId: string, secret: string) => {
    const { verifyEmail: dbVerify } = await import('../lib/mockDb');
    await dbVerify(userId, secret);
    // Reload user to get updated verification status
    const session = await getSession();
    setUser(session);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, loginWithProvider, updateUserProfile, sendVerificationEmail, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

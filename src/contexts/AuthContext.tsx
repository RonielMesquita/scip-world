import React, { createContext, useContext, useState } from 'react';
import { Company } from '../data/mockData';

export interface CompanyProject {
  id: string;
  title: string;
  description: string;
  image: string;
  area?: string;
  type?: string;
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: string;
  phone: string;
  location: string;
  avatarInitial: string;
  avatarColor: string;
  coverImage: string;
  memberSince: string;
  stats: { projects: number; companies: number; courses: number };
}

export interface MyCompany extends Company {
  logoImage?: string;
  website?: string;
  profileViews?: number;
}

interface AuthContextType {
  user: User | null;
  myCompany: MyCompany | null;
  myProjects: CompanyProject[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (data: Partial<User>) => void;
  saveCompany: (company: MyCompany) => void;
  updateCompany: (data: Partial<MyCompany>) => void;
  addProject: (project: CompanyProject) => void;
  removeProject: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  myCompany: null,
  myProjects: [],
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  updateUser: () => {},
  saveCompany: () => {},
  updateCompany: () => {},
  addProject: () => {},
  removeProject: () => {},
  logout: () => {},
});

// Mock user database
const MOCK_USERS: Record<string, User> = {
  'roniel@email.com': {
    id: '1',
    name: 'Roniel Santos',
    firstName: 'Roniel',
    email: 'roniel@email.com',
    role: 'Incorporador',
    phone: '+1 (305) 555-0182',
    location: 'Miami, FL — EUA',
    avatarInitial: 'RS',
    avatarColor: '#FF7A00',
    coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    memberSince: 'Janeiro 2024',
    stats: { projects: 12, companies: 5, courses: 3 },
  },
  'demo@scip.com': {
    id: '2',
    name: 'Demo User',
    firstName: 'Demo',
    email: 'demo@scip.com',
    role: 'Engenheiro Civil',
    phone: '+55 11 99999-0000',
    location: 'São Paulo, SP — Brasil',
    avatarInitial: 'DU',
    avatarColor: '#2F6BFF',
    coverImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
    memberSince: 'Março 2024',
    stats: { projects: 4, companies: 2, courses: 1 },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [myCompany,  setMyCompany]  = useState<MyCompany | null>(null);
  const [myProjects, setMyProjects] = useState<CompanyProject[]>([]);

  const saveCompany    = (company: MyCompany)          => setMyCompany(company);
  const updateCompany  = (data: Partial<MyCompany>)    => setMyCompany((prev) => prev ? { ...prev, ...data } : prev);
  const addProject     = (project: CompanyProject)     => setMyProjects((prev) => [project, ...prev]);
  const removeProject  = (id: string)                  => setMyProjects((prev) => prev.filter((p) => p.id !== id));

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));

    const normalizedEmail = email.toLowerCase().trim();
    const knownUser = MOCK_USERS[normalizedEmail];

    // Accept any password >= 6 chars for demo; known users just need valid password length
    if (password.length < 6) {
      return { success: false, error: 'validation_password' };
    }

    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      return { success: false, error: 'validation_email' };
    }

    if (knownUser) {
      setUser(knownUser);
      return { success: true };
    }

    // Allow any valid email with password >= 6 chars (demo mode)
    const parts = normalizedEmail.split('@')[0];
    const name = parts.charAt(0).toUpperCase() + parts.slice(1).replace(/[._]/g, ' ');
    const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

    setUser({
      id: Math.random().toString(36).slice(2),
      name,
      firstName: name.split(' ')[0],
      email: normalizedEmail,
      role: 'Usuário SCIP',
      phone: '',
      location: '',
      avatarInitial: initials,
      avatarColor: '#00C48C',
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      memberSince: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      stats: { projects: 0, companies: 0, courses: 0 },
    });

    return { success: true };
  };

  const register = async (name: string, email: string, _password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 900));
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      return { success: false, error: 'validation_email' };
    }
    const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#FF7A00', '#2F6BFF', '#00C48C', '#7B61FF', '#FF4D4D', '#0AC4FF'];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];
    setUser({
      id: Math.random().toString(36).slice(2),
      name,
      firstName: name.split(' ')[0],
      email: normalizedEmail,
      role: role || 'Usuário SCIP',
      phone: '',
      location: '',
      avatarInitial: initials,
      avatarColor,
      coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      memberSince: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      stats: { projects: 0, companies: 0, courses: 0 },
    });
    return { success: true };
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...data } : prev);
  };

  const logout = () => { setUser(null); setMyCompany(null); setMyProjects([]); };

  return (
    <AuthContext.Provider value={{ user, myCompany, myProjects, login, register, updateUser, saveCompany, updateCompany, addProject, removeProject, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

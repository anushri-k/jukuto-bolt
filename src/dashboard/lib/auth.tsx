import { createContext, useContext, useState, ReactNode } from 'react';
import { Role, UserAccount } from '../data/types';

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  plant_admin: 'Plant Admin / Training Coordinator',
  trainer: 'Trainer / Assessor',
  quality_head: 'Quality Head / Approver',
  auditor: 'Auditor (read-only)',
};

export const DEMO_USERS: UserAccount[] = [
  { id: 'EMP-1001', name: 'Ashish Rao', employeeId: 'EMP-1001', role: 'super_admin', designation: 'Plant IT / Super Admin' },
  { id: 'EMP-1010', name: 'Priyanka Bose', employeeId: 'EMP-1010', role: 'plant_admin', designation: 'Training Coordinator, Plant 2' },
  { id: 'EMP-1090', name: 'S. Nair', employeeId: 'EMP-1090', role: 'trainer', designation: 'Trainer / Assessor' },
  { id: 'EMP-1055', name: 'A. Krishnan', employeeId: 'EMP-1055', role: 'quality_head', designation: 'Quality Head, Plant 2' },
  { id: 'EMP-9001', name: 'External Auditor', employeeId: 'AUD-GUEST', role: 'auditor', designation: 'Time-boxed audit access — expires end of window' },
];

interface AuthState {
  user: UserAccount | null;
  login: (u: UserAccount) => void;
  logout: () => void;
  reauth: () => boolean;
}

const AuthContext = createContext<AuthState>({ user: null, login: () => {}, logout: () => {}, reauth: () => true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const login = (u: UserAccount) => setUser(u);
  const logout = () => setUser(null);
  const reauth = () => true; // demo: represents the forced re-authentication step (G-10) before signing
  return <AuthContext.Provider value={{ user, login, logout, reauth }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function can(role: Role, action:
  | 'enrol' | 'schedule' | 'assign' | 'record_observation' | 'recommend' | 'authorise'
  | 'edit_master' | 'view_all' | 'export' | 'print'): boolean {
  switch (action) {
    case 'enrol': case 'schedule': case 'assign': return role === 'plant_admin' || role === 'super_admin';
    case 'record_observation': case 'recommend': return role === 'trainer';
    case 'authorise': return role === 'quality_head';
    case 'edit_master': return role === 'super_admin';
    case 'view_all': return true;
    case 'export': case 'print': return role !== 'auditor' ? true : true;
    default: return false;
  }
}

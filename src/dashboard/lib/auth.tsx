import { createContext, useContext, useState, ReactNode } from 'react';
import { Role, UserAccount } from '../data/types';

// Demo build only — there is no server session to set an httpOnly cookie
// from, so the signed-in user's id is kept in localStorage instead. That's
// what makes a page reload keep you signed in rather than dropping you back
// to the login screen; a real deployment would issue a server session /
// short-lived token instead (Section 4).
const SESSION_KEY = 'jukuto_session_user_id';

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  plant_admin: 'Plant Admin / Training Coordinator',
  trainer: 'Trainer / Assessor',
  quality_head: 'Quality Head / Approver',
  auditor: 'Auditor (read-only)',
};

export const DEMO_USERS: (UserAccount & { email: string })[] = [
  { id: 'EMP-1001', name: 'Ashish Rao', employeeId: 'EMP-1001', role: 'super_admin', designation: 'Plant IT / Super Admin', email: 'ashish.rao@jukuto.in' },
  { id: 'EMP-1010', name: 'Priyanka Bose', employeeId: 'EMP-1010', role: 'plant_admin', designation: 'Training Coordinator, Plant 2', email: 'priyanka.bose@jukuto.in' },
  { id: 'EMP-1090', name: 'S. Nair', employeeId: 'EMP-1090', role: 'trainer', designation: 'Trainer / Assessor', email: 's.nair@jukuto.in' },
  { id: 'EMP-1055', name: 'A. Krishnan', employeeId: 'EMP-1055', role: 'quality_head', designation: 'Quality Head, Plant 2', email: 'a.krishnan@jukuto.in' },
  { id: 'EMP-9001', name: 'External Auditor', employeeId: 'AUD-GUEST', role: 'auditor', designation: 'Time-boxed audit access — expires end of window', email: 'auditor@jukuto.in' },
];

// Demo build only — a real deployment authenticates against the plant's
// identity provider (Section 4: username + password, RBAC enforced server-side).
export const DEMO_PASSWORD = 'Jukuto@2026';

interface AuthState {
  user: UserAccount | null;
  login: (u: UserAccount) => void;
  logout: () => void;
  reauth: () => boolean;
}

const AuthContext = createContext<AuthState>({ user: null, login: () => {}, logout: () => {}, reauth: () => true });

function restoreSession(): UserAccount | null {
  try {
    const id = localStorage.getItem(SESSION_KEY);
    return id ? DEMO_USERS.find(u => u.id === id) ?? null : null;
  } catch {
    return null; // localStorage unavailable (private browsing, etc.)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(restoreSession);
  const login = (u: UserAccount) => {
    setUser(u);
    try { localStorage.setItem(SESSION_KEY, u.id); } catch { /* ignore */ }
  };
  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  };
  const reauth = () => true; // demo: represents the forced re-authentication step (G-10) before signing
  return <AuthContext.Provider value={{ user, login, logout, reauth }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function can(role: Role, action:
  | 'enrol' | 'schedule' | 'assign' | 'record_observation' | 'recommend' | 'authorise'
  | 'edit_master' | 'view_all' | 'export' | 'print' | 'edit_trainee' | 'exit_trainee'): boolean {
  switch (action) {
    case 'enrol': case 'schedule': case 'assign': case 'edit_trainee': case 'exit_trainee':
      return role === 'plant_admin' || role === 'super_admin';
    case 'record_observation': case 'recommend': return role === 'trainer';
    case 'authorise': return role === 'quality_head';
    case 'edit_master': return role === 'super_admin';
    case 'view_all': return true;
    case 'export': case 'print': return role !== 'auditor' ? true : true;
    default: return false;
  }
}

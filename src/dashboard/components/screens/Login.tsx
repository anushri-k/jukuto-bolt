import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth, DEMO_USERS, ROLE_LABELS } from '../../lib/auth';
import { PLANT } from '../../data/config';

export function Login() {
  const { login } = useAuth();
  const [selected, setSelected] = useState(DEMO_USERS[1].id);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      setError('Enter your password to continue.');
      return;
    }
    const u = DEMO_USERS.find(d => d.id === selected)!;
    login(u);
  };

  return (
    <div className="min-h-screen bg-indigo-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <svg width="40" height="40" viewBox="0 0 120 120">
            <path d="M76.9 23.75 A 40 40 0 1 1 43.1 23.75" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
            <circle cx="76.9" cy="23.75" r="7.5" fill="#ED3123" />
          </svg>
          <span className="font-serif text-3xl font-semibold text-white">Jukuto</span>
        </div>

        <div className="bg-white rounded-xl border border-indigo-700 shadow-2xl p-8">
          <div className="mb-6">
            <div className="font-mono text-[11px] uppercase tracking-mono text-vermillion font-semibold mb-1">Competence & Audit-Evidence Dashboard</div>
            <div className="text-sm text-graphite">{PLANT.name} · {PLANT.location}</div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-graphite mb-1.5">Role (demo account)</label>
              <select
                value={selected}
                onChange={e => setSelected(e.target.value)}
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cobalt"
              >
                {DEMO_USERS.map(u => (
                  <option key={u.id} value={u.id}>{u.name} — {ROLE_LABELS[u.role]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-graphite mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••••"
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt"
              />
              {error && <div className="text-xs text-vermillion mt-1.5">{error}</div>}
            </div>
            <button type="submit" className="w-full bg-vermillion text-white font-semibold text-sm py-2.5 rounded-md hover:bg-vermillion-600 transition-colors">
              Sign in
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-line flex items-start gap-2 text-[11px] text-graphite leading-relaxed">
            <ShieldCheck size={14} className="text-cobalt shrink-0 mt-0.5" />
            <span>Role-based access is enforced server-side. Failed attempts are logged; accounts lock after {5} attempts. All access, view, export and print actions are written to an immutable audit trail.</span>
          </div>
        </div>

        <div className="text-center mt-5 text-[11px] text-indigo-200 font-mono uppercase tracking-mono">Demo build — mock data only</div>
      </div>
    </div>
  );
}

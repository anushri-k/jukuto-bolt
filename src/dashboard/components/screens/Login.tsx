import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth, DEMO_USERS, DEMO_PASSWORD } from '../../lib/auth';

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || password !== DEMO_PASSWORD) {
      setError('Invalid email or password.');
      return;
    }
    setError('');
    login(user);
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
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-graphite mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@jukuto.in"
                autoComplete="username"
                className="w-full border border-line rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-graphite mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••••"
                autoComplete="current-password"
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
            <span>Role-based access is enforced server-side. Failed attempts are logged; accounts lock after 5 attempts. All access, view, export and print actions are written to an immutable audit trail.</span>
          </div>
        </div>

        <div className="text-center mt-5 text-[11px] text-indigo-200 font-mono uppercase tracking-mono">Demo build — mock data only</div>
      </div>
    </div>
  );
}

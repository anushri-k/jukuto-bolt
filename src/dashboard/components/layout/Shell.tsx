import { ReactNode, useState } from 'react';
import {
  LayoutGrid, Users, Factory, Grid3x3, ClipboardCheck, Printer, History, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth, ROLE_LABELS } from '../../lib/auth';
import { Nav, ScreenId } from '../../DashboardApp';
import { PLANT } from '../../data/config';

const NAV_ITEMS: { id: ScreenId; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'trainees', label: 'Trainee Register', icon: Users },
  { id: 'stations', label: 'Station Master', icon: Factory },
  { id: 'matrix', label: 'Skill Matrix', icon: Grid3x3 },
  { id: 'approvals', label: 'Approval Queue', icon: ClipboardCheck },
  { id: 'reports', label: 'Reports & Print Centre', icon: Printer },
  { id: 'audit', label: 'Audit Trail', icon: History },
];

export function Shell({ nav, children }: { nav: Nav; children: ReactNode }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  if (!user) return null;

  const NavList = (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const active = nav.screen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => { nav.go(item.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              active ? 'bg-vermillion text-white' : 'text-indigo-100 hover:bg-indigo-700'
            }`}
          >
            <Icon size={17} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cloud flex">
      {/* Desktop sidebar */}
      <aside className="no-print hidden lg:flex flex-col w-64 bg-indigo-800 shrink-0">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-indigo-700">
          <svg width="26" height="26" viewBox="0 0 120 120">
            <path d="M76.9 23.75 A 40 40 0 1 1 43.1 23.75" fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
            <circle cx="76.9" cy="23.75" r="7.5" fill="#ED3123" />
          </svg>
          <span className="font-serif text-xl font-semibold text-white">Jukuto</span>
        </div>
        {NavList}
        <div className="px-5 py-4 border-t border-indigo-700">
          <div className="text-white text-sm font-semibold truncate">{user.name}</div>
          <div className="text-indigo-300 text-[11px] font-mono uppercase tracking-mono mt-0.5">{ROLE_LABELS[user.role]}</div>
          <button onClick={logout} className="mt-3 flex items-center gap-2 text-[12px] text-indigo-200 hover:text-white transition-colors">
            <LogOut size={13} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="no-print lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-indigo-800 flex flex-col">
            <div className="px-5 py-5 flex items-center justify-between border-b border-indigo-700">
              <span className="font-serif text-xl font-semibold text-white">Jukuto</span>
              <button onClick={() => setMobileOpen(false)} className="text-white"><X size={20} /></button>
            </div>
            {NavList}
            <div className="px-5 py-4 border-t border-indigo-700">
              <div className="text-white text-sm font-semibold truncate">{user.name}</div>
              <div className="text-indigo-300 text-[11px] font-mono uppercase tracking-mono mt-0.5">{ROLE_LABELS[user.role]}</div>
              <button onClick={logout} className="mt-3 flex items-center gap-2 text-[12px] text-indigo-200 hover:text-white transition-colors">
                <LogOut size={13} /> Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="no-print lg:hidden sticky top-0 z-40 bg-white border-b border-line px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)}><Menu size={22} className="text-indigo-800" /></button>
          <span className="font-serif text-lg font-semibold text-indigo-800">Jukuto</span>
          <div className="w-[22px]" />
        </header>
        <header className="no-print hidden lg:flex items-center justify-between border-b border-line bg-white px-8 py-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-mono text-graphite">{PLANT.name} · {PLANT.location}</div>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-mono text-graphite">Session active · re-authentication required to sign</div>
        </header>
        <main className="flex-1 min-w-0 px-4 py-6 lg:px-8 lg:py-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}

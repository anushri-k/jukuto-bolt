import { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Circle, Clock } from 'lucide-react';
import { TraineeStatus, CertificationStatus } from '../data/types';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white border border-line rounded-lg ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-indigo-800">{title}</h1>
        {subtitle && <p className="text-sm text-graphite mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function StatCard({ label, value, hint, tone = 'default' }: { label: string; value: string | number; hint?: string; tone?: 'default' | 'red' | 'amber' | 'green' }) {
  const toneClass = {
    default: 'text-indigo-800',
    red: 'text-vermillion',
    amber: 'text-amber-600',
    green: 'text-emerald-700',
  }[tone];
  return (
    <Card className="p-4">
      <div className="font-mono text-[10.5px] uppercase tracking-mono text-graphite mb-1.5">{label}</div>
      <div className={`font-serif text-3xl font-semibold ${toneClass}`}>{value}</div>
      {hint && <div className="text-[12px] text-graphite mt-1">{hint}</div>}
    </Card>
  );
}

const STATUS_STYLE: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  'Certified': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  'Active': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2 },
  'Expiring soon': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  'Recommended': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  'Pending approval': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  'Awaiting assessment': { bg: 'bg-cobalt-50', text: 'text-cobalt-700', icon: Clock },
  'In training': { bg: 'bg-slate-100', text: 'text-graphite', icon: Circle },
  'Enrolled': { bg: 'bg-slate-100', text: 'text-graphite', icon: Circle },
  'Re-qualification due': { bg: 'bg-vermillion-50', text: 'text-vermillion-700', icon: AlertTriangle },
  'Expired': { bg: 'bg-vermillion-50', text: 'text-vermillion-700', icon: AlertTriangle },
  'Suspended': { bg: 'bg-vermillion-50', text: 'text-vermillion-700', icon: XCircle },
  'Withdrawn': { bg: 'bg-vermillion-50', text: 'text-vermillion-700', icon: XCircle },
  'Failed': { bg: 'bg-vermillion-50', text: 'text-vermillion-700', icon: XCircle },
  'Exited': { bg: 'bg-slate-100', text: 'text-graphite', icon: Circle },
};

export function StatusBadge({ status }: { status: TraineeStatus | CertificationStatus | string }) {
  const style = STATUS_STYLE[status] ?? { bg: 'bg-slate-100', text: 'text-graphite', icon: Circle };
  const Icon = style.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${style.bg} ${style.text}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}

export function NotRecorded() {
  return <span className="text-graphite/60 italic text-sm">Not recorded</span>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-10 text-center">
      <div className="font-serif text-lg font-semibold text-indigo-800 mb-1.5">{title}</div>
      <div className="text-sm text-graphite max-w-md mx-auto">{body}</div>
    </Card>
  );
}

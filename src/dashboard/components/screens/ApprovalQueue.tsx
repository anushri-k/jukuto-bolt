import { useState } from 'react';
import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { Nav } from '../../DashboardApp';
import { DATA, traineeById, stationById } from '../../data';
import { Card, PageHeader, EmptyState } from '../ui';
import { useAuth } from '../../lib/auth';

export function ApprovalQueue({ nav }: { nav: Nav }) {
  const { user, reauth } = useAuth();
  const [decided, setDecided] = useState<Record<string, 'approved' | 'rejected'>>({});
  const pending = DATA.certifications.filter(c => c.status === 'Pending approval' && !decided[c.id]);

  const canAuthorise = user?.role === 'quality_head' || user?.role === 'super_admin';

  const decide = (certId: string, recommenderId: string, outcome: 'approved' | 'rejected') => {
    if (recommenderId === user?.id) {
      alert('Blocked (G-09): the trainer who recommended this record cannot also approve it. Separation of duties is enforced.');
      return;
    }
    if (!reauth()) return;
    setDecided(prev => ({ ...prev, [certId]: outcome }));
  };

  return (
    <div>
      <PageHeader title="Approval Queue" subtitle="Trainer-recommended certifications awaiting Quality Head authorisation." />

      {!canAuthorise && (
        <div className="mb-4 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          <ShieldAlert size={14} /> Signed in as {user?.role.replace('_', ' ')} — view only. Authorisation requires the Quality Head role and re-authentication.
        </div>
      )}

      {pending.length === 0 ? (
        <EmptyState title="Queue is clear" body="No certifications are currently awaiting Quality Head authorisation." />
      ) : (
        <div className="space-y-3">
          {pending.map(cert => {
            const trainee = traineeById(cert.traineeId);
            const station = stationById(cert.stationId);
            if (!trainee || !station) return null;
            return (
              <Card key={cert.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <button onClick={() => nav.go('trainee-detail', { id: trainee.id })} className="font-semibold text-indigo-800 hover:underline">
                    {trainee.name}
                  </button>
                  <span className="text-graphite text-xs ml-2 font-mono">{trainee.id}</span>
                  <div className="text-sm text-graphite mt-0.5">{station.name} ({station.id}) — Level {cert.levelAwarded} recommended</div>
                  <div className="text-xs text-graphite mt-1">
                    Recommended by <span className="font-medium text-indigo-800">{cert.recommendedBy?.name}</span> ({cert.recommendedBy?.id}) on {cert.recommendedBy?.timestamp.slice(0, 10)}
                  </div>
                </div>
                {canAuthorise && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => decide(cert.id, cert.recommendedBy?.id ?? '', 'rejected')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-vermillion border border-vermillion-200 px-3 py-2 rounded-md hover:bg-vermillion-50"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                    <button
                      onClick={() => decide(cert.id, cert.recommendedBy?.id ?? '', 'approved')}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 px-3 py-2 rounded-md hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={14} /> Authorise (re-auth required)
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {Object.keys(decided).length > 0 && (
        <div className="mt-4 text-xs text-graphite italic">
          Demo note: decisions above are session-only (no backend). In production these write a versioned, signed certification event to the immutable audit trail.
        </div>
      )}
    </div>
  );
}

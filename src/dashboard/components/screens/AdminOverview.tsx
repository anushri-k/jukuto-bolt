import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Nav } from '../../DashboardApp';
import { DATA, STATIONS, TODAY } from '../../data';
import { Card, PageHeader, StatCard, StatusBadge } from '../ui';
import { runChecks, auditReadinessScore } from '../../lib/checks';

const dayMs = 86400000;
const daysBetween = (a: string, b: string) => Math.round((new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / dayMs);

export function AdminOverview({ nav }: { nav: Nav }) {
  const { trainees, certifications } = DATA;
  const checks = runChecks();
  const score = auditReadinessScore(checks);
  const failingChecks = checks.filter(c => !c.pass);

  const statusCounts: Record<string, number> = {};
  trainees.forEach(t => { statusCounts[t.status] = (statusCounts[t.status] || 0) + 1; });

  const certifiedCount = trainees.filter(t => t.status === 'Certified').length;
  const expiring30 = certifications.filter(c => c.status === 'Expiring soon' && daysBetween(TODAY, c.validUntil) <= 30).length;
  const overdueRequal = certifications.filter(c => c.status === 'Re-qualification due').length;
  const stalled = checks.find(c => c.id === 'OPS-01')?.failingRecords.length ?? 0;
  const missingSig = checks.find(c => c.id === 'A-03')?.failingRecords.length ?? 0;
  const passResults = DATA.assessments.filter(a => a.attemptNumber === 1);
  const firstTimePassRate = passResults.length ? Math.round((passResults.filter(a => a.result === 'Pass').length / passResults.length) * 1000) / 10 : 0;

  return (
    <div>
      <PageHeader
        title="Plant Overview"
        subtitle={`Data as of ${TODAY} · IST — live status across every trainee, station and certification.`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total trainees" value={trainees.length} hint="All statuses" />
        <StatCard label="Certified & active" value={certifiedCount} tone="green" />
        <StatCard label="Expiring ≤ 30 days" value={expiring30} tone="amber" />
        <StatCard label="Overdue re-qualification" value={overdueRequal} tone="red" />
        <StatCard label="First-time pass rate" value={`${firstTimePassRate}%`} />
        <StatCard label="Trainees stalled" value={stalled} tone={stalled ? 'amber' : 'default'} />
        <StatCard label="Missing signatures" value={missingSig} tone={missingSig ? 'red' : 'green'} />
        <StatCard
          label="Audit-readiness score"
          value={`${score}%`}
          tone={score >= 95 ? 'green' : score >= 80 ? 'amber' : 'red'}
          hint={`${checks.length - failingChecks.length}/${checks.length} checks passing`}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-indigo-800">Trainees by status</h2>
            <button onClick={() => nav.go('trainees')} className="text-xs font-semibold text-cobalt flex items-center gap-1 hover:underline">
              View register <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-2.5">
            {Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => (
              <button
                key={status}
                onClick={() => nav.go('trainees', { status })}
                className="w-full flex items-center gap-3 group text-left"
              >
                <div className="w-40 shrink-0"><StatusBadge status={status} /></div>
                <div className="flex-1 h-6 bg-cloud rounded overflow-hidden">
                  <div
                    className="h-full bg-indigo-300 group-hover:bg-cobalt transition-colors"
                    style={{ width: `${(count / trainees.length) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-right text-sm font-semibold text-indigo-800">{count}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-indigo-800">Coverage by station</h2>
            <button onClick={() => nav.go('matrix')} className="text-xs font-semibold text-cobalt flex items-center gap-1 hover:underline">
              Skill matrix <ArrowRight size={13} />
            </button>
          </div>
          <div className="space-y-2">
            {STATIONS.map(station => {
              const shifts: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
              const gapShifts = shifts.filter(sh => trainees.filter(t => t.targetStation === station.id && t.shift === sh && t.status === 'Certified').length < station.minCertifiedPerShift);
              const isGap = gapShifts.length > 0;
              return (
                <div key={station.id} className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${isGap ? 'bg-vermillion-50' : 'bg-cloud'}`}>
                  <div className="min-w-0">
                    <div className="font-medium text-indigo-800 truncate">{station.name}</div>
                    <div className="text-[11px] text-graphite font-mono">{station.id} {station.specialCharacteristic !== 'None' && `· ${station.specialCharacteristic}`}</div>
                  </div>
                  {isGap ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-vermillion-700 shrink-0">
                      <AlertTriangle size={12} /> Gap: {gapShifts.join(', ')}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-700 shrink-0">Covered</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-indigo-800">Audit-readiness — failing checks</h2>
          <span className="text-xs font-mono text-graphite">{failingChecks.length} of {checks.length} checks need attention</span>
        </div>
        {failingChecks.length === 0 ? (
          <p className="text-sm text-emerald-700 font-medium">All checks passing.</p>
        ) : (
          <div className="space-y-4">
            {failingChecks.map(check => (
              <div key={check.id} className="border-l-4 border-vermillion pl-4 py-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-800">
                  <span className="font-mono text-[11px] text-vermillion">{check.id}</span>
                  {check.description}
                </div>
                <ul className="mt-1.5 space-y-0.5">
                  {check.failingRecords.slice(0, 6).map(r => (
                    <li key={r.recordId} className="text-[12.5px] text-graphite">
                      {r.recordType === 'Trainee' ? (
                        <button className="hover:underline text-cobalt" onClick={() => nav.go('trainee-detail', { id: r.recordId })}>{r.label}</button>
                      ) : r.label}
                    </li>
                  ))}
                  {check.failingRecords.length > 6 && (
                    <li className="text-[12.5px] text-graphite italic">+ {check.failingRecords.length - 6} more</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

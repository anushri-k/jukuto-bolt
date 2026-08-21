import { ArrowLeft, Printer } from 'lucide-react';
import { Nav } from '../../DashboardApp';
import { traineeById, stationById, sessionsFor, assessmentsFor, certificationsFor } from '../../data';
import { Card, PageHeader, StatusBadge, NotRecorded } from '../ui';
import { levelLabel } from '../../lib/i18n';

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] font-mono uppercase tracking-mono text-graphite">{label}</div>
      <div className="text-sm text-indigo-800 font-medium mt-0.5">{value ?? <NotRecorded />}</div>
    </div>
  );
}

export function TraineeDetail({ nav, traineeId }: { nav: Nav; traineeId?: string }) {
  if (!traineeId) return <div className="text-sm text-graphite">No trainee selected.</div>;
  const trainee = traineeById(traineeId);
  if (!trainee) return <div className="text-sm text-graphite">Trainee not found.</div>;

  const station = stationById(trainee.targetStation);
  const sessions = sessionsFor(traineeId);
  const assessments = assessmentsFor(traineeId);
  const certs = certificationsFor(traineeId);
  const activeCert = certs.find(c => c.stationId === trainee.targetStation);
  const level = activeCert ? levelLabel(activeCert.levelAwarded) : levelLabel(0);

  const practiceRuns = sessions.filter(s => s.sessionType === 'Practice');
  const scores = assessments.map(a => a.weightedOverallPct);
  const best = scores.length ? Math.max(...scores) : undefined;
  const latest = scores.length ? scores[scores.length - 1] : undefined;
  const avg = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : undefined;

  return (
    <div>
      <button onClick={() => nav.go('trainees')} className="flex items-center gap-1.5 text-sm text-cobalt font-medium mb-4 hover:underline">
        <ArrowLeft size={15} /> Back to register
      </button>

      <PageHeader
        title={trainee.name}
        subtitle={`${trainee.id} · ${trainee.designation} · ${trainee.department}`}
        right={
          <button
            onClick={() => nav.go('reports', { report: 'competence-record', traineeId: trainee.id, stationId: trainee.targetStation })}
            className="flex items-center gap-2 bg-vermillion text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-vermillion-600 transition-colors"
          >
            <Printer size={15} /> Print Competence Record
          </button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h2 className="font-serif text-lg font-semibold text-indigo-800 mb-4">Profile</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Employment type" value={`${trainee.employmentType}${trainee.contractorName ? ` — ${trainee.contractorName}` : ''}`} />
              <Field label="Date of joining" value={trainee.dateOfJoining} />
              <Field label="Shift" value={trainee.shift} />
              <Field label="Supervisor" value={`${trainee.supervisor} (${trainee.supervisorId})`} />
              <Field label="Prior experience" value={`${trainee.priorExperienceYears} yr(s)${trainee.priorExperienceOn ? ` — ${trainee.priorExperienceOn}` : ''}`} />
              <Field label="Education" value={trainee.education} />
              <Field label="Languages" value={trainee.languages.join(', ')} />
              <Field label="Induction / safety training" value={trainee.inductionStatus.done ? `Valid until ${trainee.inductionStatus.validUntil}` : undefined} />
              <Field label="Medical fitness" value={trainee.medicalFitness.done ? `Valid until ${trainee.medicalFitness.validUntil}` : undefined} />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-lg font-semibold text-indigo-800 mb-4">Current certification — {station?.name}</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{level.symbol}</span>
              <div>
                <div className="font-semibold text-indigo-800">Level {activeCert?.levelAwarded ?? 0} — {level.text}</div>
                {activeCert && <StatusBadge status={activeCert.status} />}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Field label="Certificate ID" value={activeCert?.id} />
              <Field label="Valid from" value={activeCert?.validFrom} />
              <Field label="Valid until" value={activeCert?.validUntil} />
              <Field label="Recommended by" value={activeCert?.recommendedBy ? `${activeCert.recommendedBy.name} (${activeCert.recommendedBy.id})` : undefined} />
              <Field label="Authorised by" value={activeCert?.authorisedBy ? `${activeCert.authorisedBy.name} (${activeCert.authorisedBy.id})` : undefined} />
              <Field label="Re-qualification trigger" value={activeCert?.requalificationTriggerReason} />
            </div>
            {activeCert?.status === 'Suspended' && (
              <div className="mt-4 p-3 bg-vermillion-50 border border-vermillion-200 rounded-md text-xs text-vermillion-700">
                <strong>Suspended:</strong> {activeCert.withdrawalReason}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-lg font-semibold text-indigo-800 mb-4">Assessment attempts</h2>
            {assessments.length === 0 ? <NotRecorded /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-line text-left text-graphite">
                      <th className="py-2 pr-3">Attempt</th><th className="py-2 pr-3">Date</th><th className="py-2 pr-3">Overall %</th>
                      <th className="py-2 pr-3">Critical step</th><th className="py-2 pr-3">Safety</th><th className="py-2 pr-3">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map(a => (
                      <tr key={a.id} className="border-b border-line last:border-0">
                        <td className="py-2 pr-3 font-medium">#{a.attemptNumber}</td>
                        <td className="py-2 pr-3">{a.date}</td>
                        <td className="py-2 pr-3 font-semibold">{a.weightedOverallPct}%</td>
                        <td className="py-2 pr-3">{a.criticalStepResult === 'Fail' ? <span className="text-vermillion font-semibold">Fail</span> : 'Pass'}</td>
                        <td className="py-2 pr-3">{a.safetyPass ? 'Pass' : <span className="text-vermillion font-semibold">Violation</span>}</td>
                        <td className="py-2 pr-3"><StatusBadge status={a.result} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-lg font-semibold text-indigo-800 mb-4">Practice run trend — cycle time vs standard ({station?.standardCycleTimeSec}s)</h2>
            {practiceRuns.length === 0 ? <NotRecorded /> : (
              <div className="flex items-end gap-2 h-32">
                {practiceRuns.map((s, i) => {
                  const pct = station ? (s.cycleTimeAchievedSec / station.standardCycleTimeSec) * 100 : 100;
                  const height = Math.min(100, Math.max(15, 100 - (pct - 100)));
                  return (
                    <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-[9px] text-graphite font-mono">{Math.round(pct)}%</div>
                      <div className="w-full bg-cobalt-200 rounded-t" style={{ height: `${height}%` }} />
                      <div className="text-[9px] text-graphite">Run {i + 1}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-serif text-base font-semibold text-indigo-800 mb-3">Status</h2>
            <StatusBadge status={trainee.status} />
            <div className="mt-3 space-y-2 text-xs text-graphite">
              <div>Last activity: <span className="font-medium text-indigo-800">{trainee.modifiedAt.slice(0, 10)}</span></div>
              <div>Enrolment date: <span className="font-medium text-indigo-800">{trainee.enrolmentDate}</span></div>
              <div>Target certification: <span className="font-medium text-indigo-800">{trainee.targetCertificationDate}</span></div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-base font-semibold text-indigo-800 mb-3">Score summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-graphite">Best</span><span className="font-semibold text-indigo-800">{best !== undefined ? `${best}%` : '—'}</span></div>
              <div className="flex justify-between"><span className="text-graphite">Latest</span><span className="font-semibold text-indigo-800">{latest !== undefined ? `${latest}%` : '—'}</span></div>
              <div className="flex justify-between"><span className="text-graphite">Average</span><span className="font-semibold text-indigo-800">{avg !== undefined ? `${avg}%` : '—'}</span></div>
              <div className="flex justify-between"><span className="text-graphite">Practice runs</span><span className="font-semibold text-indigo-800">{practiceRuns.length}</span></div>
              <div className="flex justify-between"><span className="text-graphite">Total sessions</span><span className="font-semibold text-indigo-800">{sessions.length}</span></div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-serif text-base font-semibold text-indigo-800 mb-3">All sessions</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sessions.map(s => (
                <div key={s.id} className="text-xs border-b border-line pb-2 last:border-0">
                  <div className="flex justify-between font-medium text-indigo-800">
                    <span>{s.sessionType}</span><span>{s.date}</span>
                  </div>
                  <div className="text-graphite font-mono text-[10px]">{s.id} · {s.headsetId}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

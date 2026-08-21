import { PrintPage, PrintHeader, PrintFooter, PrintSection, PrintField, PrintLineChart } from './PrintChrome';
import { traineeById, stationById, sessionsFor, assessmentsFor, TODAY } from '../../data';
import { MODULES } from '../../data/stations';
import { DOCUMENT_CONTROL } from '../../data/config';

const dayMs = 86400000;
const daysBetween = (a: string, b: string) => Math.round((new Date(b + 'T00:00:00Z').getTime() - new Date(a + 'T00:00:00Z').getTime()) / dayMs);

const STAGE_BY_STATUS: Record<string, string> = {
  'Enrolled': 'Enrolled',
  'In training': 'Practice',
  'Awaiting assessment': 'Practice complete — awaiting assessment',
  'Recommended': 'Recommended — awaiting Quality Head authorisation',
  'Certified': 'Certified',
  'Re-qualification due': 'Re-qualification due',
  'Failed': 'Failed — development plan in progress',
  'Suspended': 'Suspended',
  'Exited': 'Exited',
};

export function TraineeProgressPrint({ traineeId }: { traineeId: string }) {
  const trainee = traineeById(traineeId);
  if (!trainee) return null;
  const station = stationById(trainee.targetStation);
  const mod = MODULES.filter(m => m.linkedStationId === trainee.targetStation).slice(-1)[0];

  const allSessions = sessionsFor(traineeId);
  const practiceRuns = allSessions.filter(s => s.sessionType === 'Practice' && s.stationId === trainee.targetStation);
  const assessments = assessmentsFor(traineeId).filter(a => a.stationId === trainee.targetStation);

  const scores = assessments.map(a => a.weightedOverallPct);
  const best = scores.length ? Math.max(...scores) : undefined;
  const latest = scores.length ? scores[scores.length - 1] : undefined;
  const avg = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : undefined;

  const requiredRuns = mod?.practiceRunsRequired ?? 0;
  const progressPct = trainee.status === 'Certified' || trainee.status === 'Re-qualification due'
    ? 100
    : Math.min(95, requiredRuns ? Math.round((practiceRuns.length / requiredRuns) * 100) : 0);

  const daysInStage = daysBetween(trainee.modifiedAt.slice(0, 10), TODAY);
  const totalVrHours = Math.round((allSessions.reduce((s, r) => s + r.durationSec, 0) / 3600) * 10) / 10;
  const daysRemaining = daysBetween(TODAY, trainee.targetCertificationDate);
  const atRisk = trainee.status === 'Failed' || trainee.status === 'Suspended'
    || ((trainee.status === 'In training' || trainee.status === 'Awaiting assessment') && daysInStage > 14);

  const scoreTrend = assessments.map(a => ({ x: `#${a.attemptNumber}`, y: a.weightedOverallPct }));
  const cycleTimeTrend = practiceRuns.map((s, i) => ({
    x: `R${i + 1}`,
    y: station ? Math.round((s.cycleTimeAchievedSec / station.standardCycleTimeSec) * 100) : 0,
  }));
  const errorTrend = practiceRuns.map((s, i) => ({
    x: `R${i + 1}`,
    y: Object.values(s.errorCountByCategory).reduce((a, b) => a + b, 0),
  }));

  return (
    <PrintPage>
      <PrintHeader
        title="Trainee Progress Report"
        formatNumber={DOCUMENT_CONTROL.formatNumbers.progressReport}
        scopeLine={`${trainee.name} (${trainee.id}) — ${station?.name ?? 'Not recorded'}`}
        pageLabel="Page 1 of 1"
      />

      <PrintSection title="Trainee">
        <div className="print-field-grid">
          <PrintField label="Full name" value={trainee.name} />
          <PrintField label="Employee ID" value={trainee.id} />
          <PrintField label="Employment type" value={trainee.employmentType} />
          <PrintField label="Target station" value={station?.name} />
          <PrintField label="Enrolment date" value={trainee.enrolmentDate} />
          <PrintField label="Target certification date" value={trainee.targetCertificationDate} />
        </div>
      </PrintSection>

      <PrintSection title="Progress summary">
        <div className="print-field-grid">
          <PrintField label="Overall progress" value={`${progressPct}%`} />
          <PrintField label="Current stage" value={STAGE_BY_STATUS[trainee.status] ?? trainee.status} />
          <PrintField label="Days in current stage" value={`${daysInStage} day(s)`} />
          <PrintField label="Blocked / at-risk" value={atRisk ? 'YES — flagged' : 'No'} />
          <PrintField label="Practice runs completed vs required" value={`${practiceRuns.length} / ${requiredRuns || 'Not recorded'}`} />
          <PrintField label="Total VR hours logged" value={`${totalVrHours} hr`} />
          <PrintField label="Last activity date" value={trainee.modifiedAt.slice(0, 10)} />
          <PrintField label={trainee.status === 'Certified' ? 'Certified on' : 'Days to target certification'} value={trainee.status === 'Certified' ? trainee.enrolmentDate : (daysRemaining >= 0 ? `${daysRemaining} day(s) remaining` : `Overdue by ${-daysRemaining} day(s)`)} />
          <PrintField label="Assigned trainer" value={undefined} />
          <PrintField label="Next scheduled session" value={undefined} />
          <PrintField label="Attendance / no-shows" value={undefined} />
        </div>
      </PrintSection>

      <PrintSection title="Score summary">
        <div className="print-field-grid">
          <PrintField label="Best score" value={best !== undefined ? `${best}%` : undefined} />
          <PrintField label="Latest score" value={latest !== undefined ? `${latest}%` : undefined} />
          <PrintField label="Average score" value={avg !== undefined ? `${avg}%` : undefined} />
          <PrintField label="Attempts to date" value={assessments.length || undefined} />
        </div>
      </PrintSection>

      <PrintSection title="Trend charts">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <PrintLineChart label="Score per attempt (weighted overall %)" values={scoreTrend} unit="%" targetLine={80} />
          <PrintLineChart label={`Cycle time trend (% of standard ${station?.standardCycleTimeSec ?? '—'}s)`} values={cycleTimeTrend} unit="%" targetLine={100} />
          <PrintLineChart label="Error count per practice run" values={errorTrend} />
        </div>
      </PrintSection>

      <PrintSection title="All assessment attempts">
        <table className="print-table">
          <thead><tr><th>Attempt</th><th>Date</th><th>Weighted overall %</th><th>Critical step</th><th>Safety</th><th>Result</th></tr></thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a.id}>
                <td>{a.attemptNumber}</td><td>{a.date}</td><td>{a.weightedOverallPct}</td>
                <td>{a.criticalStepResult}</td><td>{a.safetyPass ? 'Pass' : 'FAIL'}</td><td>{a.result}</td>
              </tr>
            ))}
            {assessments.length === 0 && <tr><td colSpan={6} style={{ fontStyle: 'italic', color: '#8890A0' }}>Not recorded</td></tr>}
          </tbody>
        </table>
      </PrintSection>

      <PrintSection title="All sessions (this station)">
        <table className="print-table">
          <thead><tr><th>Session ID</th><th>Type</th><th>Date</th><th>Duration</th><th>Sequence %</th><th>Errors</th><th>Retries</th><th>Hints</th></tr></thead>
          <tbody>
            {allSessions.filter(s => s.stationId === trainee.targetStation).map(s => (
              <tr key={s.id}>
                <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9 }}>{s.id}</td>
                <td>{s.sessionType}</td><td>{s.date}</td>
                <td>{Math.round(s.durationSec / 60)} min</td>
                <td>{s.sequenceAdherencePct}</td>
                <td>{Object.values(s.errorCountByCategory).reduce((a, b) => a + b, 0)}</td>
                <td>{s.retries}</td><td>{s.hintsUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PrintSection>

      <PrintFooter recordId={`${trainee.id}-PROGRESS`} />
    </PrintPage>
  );
}

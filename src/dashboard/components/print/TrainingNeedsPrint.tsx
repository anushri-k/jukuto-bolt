import { PrintPage, PrintHeader, PrintFooter, PrintSection } from './PrintChrome';
import { STATIONS, TODAY } from '../../data';
import { MODULES } from '../../data/stations';
import { DOCUMENT_CONTROL } from '../../data/config';
import { getTrainees } from '../../lib/store';
import { sessionsFor } from '../../data';

const dayMs = 86400000;
const daysBetween = (a: string, b: string) => Math.round((new Date(b + 'T00:00:00Z').getTime() - new Date(a + 'T00:00:00Z').getTime()) / dayMs);

function gapFor(status: string, runsDone: number, runsRequired: number, inductionDone: boolean, medicalDone: boolean): string {
  if (!inductionDone) return 'Blocked — safety induction not on file (G-01)';
  if (!medicalDone) return 'Blocked — medical fitness not on file (G-02)';
  if (status === 'Enrolled') return 'Needs practice runs to begin';
  if (status === 'In training') return `Needs ${Math.max(0, runsRequired - runsDone)} more practice run(s) before assessment eligible (G-03)`;
  if (status === 'Awaiting assessment') return 'Practice complete — needs assessment scheduled';
  if (status === 'Recommended') return 'Awaiting Quality Head authorisation';
  if (status === 'Failed') return 'Needs development plan completion + re-assessment';
  if (status === 'Suspended') return 'Suspended — needs re-qualification trigger resolved before re-entry';
  return 'Not recorded';
}

export function TrainingNeedsPrint() {
  const trainees = getTrainees().filter(t => t.status !== 'Exited' && t.status !== 'Certified' && t.status !== 'Re-qualification due');

  const rows = trainees.map(t => {
    const station = STATIONS.find(s => s.id === t.targetStation);
    const mod = MODULES.filter(m => m.linkedStationId === t.targetStation).slice(-1)[0];
    const runsDone = sessionsFor(t.id).filter(s => s.sessionType === 'Practice' && s.stationId === t.targetStation).length;
    const runsRequired = mod?.practiceRunsRequired ?? 0;
    const daysRemaining = daysBetween(TODAY, t.targetCertificationDate);
    return {
      trainee: t, station, runsDone, runsRequired, daysRemaining,
      gap: gapFor(t.status, runsDone, runsRequired, t.inductionStatus.done, t.medicalFitness.done),
    };
  }).sort((a, b) => a.daysRemaining - b.daysRemaining);

  const stationGaps = STATIONS.map(s => {
    const shifts: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
    const gapShifts = shifts.filter(sh => getTrainees().filter(t => t.targetStation === s.id && t.shift === sh && t.status === 'Certified').length < s.minCertifiedPerShift);
    const pipeline = getTrainees().filter(t => t.targetStation === s.id && t.status !== 'Exited' && t.status !== 'Certified' && t.status !== 'Failed' && t.status !== 'Suspended').length;
    return { station: s, gapShifts, pipeline };
  }).filter(r => r.gapShifts.length > 0);

  return (
    <PrintPage landscape>
      <PrintHeader title="Training Needs / Gap Report" formatNumber={DOCUMENT_CONTROL.formatNumbers.trainingNeeds} pageLabel="Page 1 of 1" />

      <PrintSection title={`${rows.length} trainee(s) not yet certified — who needs what, by when`}>
        <table className="print-table">
          <thead><tr><th>Trainee</th><th>Station</th><th>Status</th><th>Practice runs</th><th>Target cert. date</th><th>Days remaining</th><th>Gap / next step</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.trainee.id}>
                <td>{r.trainee.name} ({r.trainee.id})</td>
                <td>{r.station?.name}</td>
                <td>{r.trainee.status}</td>
                <td>{r.runsDone} / {r.runsRequired || 'Not recorded'}</td>
                <td>{r.trainee.targetCertificationDate}</td>
                <td style={{ fontWeight: 700, color: r.daysRemaining < 0 ? '#9E1A14' : r.daysRemaining < 7 ? '#92400e' : undefined }}>
                  {r.daysRemaining < 0 ? `Overdue ${-r.daysRemaining}d` : `${r.daysRemaining}d`}
                </td>
                <td>{r.gap}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} style={{ fontStyle: 'italic' }}>None — every trainee is either certified or in re-qualification.</td></tr>}
          </tbody>
        </table>
      </PrintSection>

      <PrintSection title="Station-level coverage gaps needing new intake">
        <table className="print-table">
          <thead><tr><th>Station</th><th>Shift gap</th><th>Trainees currently in pipeline</th></tr></thead>
          <tbody>
            {stationGaps.map(g => (
              <tr key={g.station.id}>
                <td>{g.station.name} ({g.station.id})</td>
                <td style={{ fontWeight: 700, color: '#9E1A14' }}>{g.gapShifts.join(', ')}</td>
                <td>{g.pipeline}{g.pipeline === 0 ? ' — no one in the pipeline for this station' : ''}</td>
              </tr>
            ))}
            {stationGaps.length === 0 && <tr><td colSpan={3} style={{ fontStyle: 'italic' }}>None — all shifts meet minimum certified coverage.</td></tr>}
          </tbody>
        </table>
      </PrintSection>

      <PrintFooter recordId="TRAINING-NEEDS" />
    </PrintPage>
  );
}

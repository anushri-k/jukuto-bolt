import { PrintPage, PrintHeader, PrintFooter, PrintSection } from './PrintChrome';
import { STATIONS, sessionsFor, assessmentsFor } from '../../data';
import { DOCUMENT_CONTROL } from '../../data/config';
import { getTrainees } from '../../lib/store';

const dayMs = 86400000;
const daysBetween = (a: string, b: string) => Math.round((new Date(b + 'T00:00:00Z').getTime() - new Date(a + 'T00:00:00Z').getTime()) / dayMs);

export function TrainingEffectivenessPrint() {
  const trainees = getTrainees();

  const rows = STATIONS.map(station => {
    const certified = trainees.filter(t => t.targetStation === station.id && (t.status === 'Certified' || t.status === 'Re-qualification due'));
    if (certified.length === 0) return { station, n: 0 };

    let rampDaysSum = 0, rampN = 0;
    let firstPassCount = 0, firstAttemptN = 0;
    let beforePct = 0, afterPct = 0, convergeN = 0;
    let vrHoursSum = 0;

    certified.forEach(t => {
      const sessions = sessionsFor(t.id).filter(s => s.stationId === station.id);
      const practice = sessions.filter(s => s.sessionType === 'Practice');
      const assessments = assessmentsFor(t.id).filter(a => a.stationId === station.id);
      const firstAssessment = assessments[0];

      if (firstAssessment) {
        firstAttemptN++;
        if (firstAssessment.result === 'Pass') firstPassCount++;
        rampDaysSum += daysBetween(t.enrolmentDate, firstAssessment.date);
        rampN++;
      }
      if (practice.length >= 2) {
        beforePct += (practice[0].cycleTimeAchievedSec / station.standardCycleTimeSec) * 100;
        afterPct += (practice[practice.length - 1].cycleTimeAchievedSec / station.standardCycleTimeSec) * 100;
        convergeN++;
      }
      vrHoursSum += sessions.reduce((s, r) => s + r.durationSec, 0) / 3600;
    });

    return {
      station, n: certified.length,
      avgRampDays: rampN ? Math.round(rampDaysSum / rampN) : undefined,
      firstTimePassPct: firstAttemptN ? Math.round((firstPassCount / firstAttemptN) * 1000) / 10 : undefined,
      avgBeforePct: convergeN ? Math.round(beforePct / convergeN) : undefined,
      avgAfterPct: convergeN ? Math.round(afterPct / convergeN) : undefined,
      avgVrHours: certified.length ? Math.round((vrHoursSum / certified.length) * 10) / 10 : undefined,
    };
  }).filter(r => r.n > 0);

  return (
    <PrintPage landscape>
      <PrintHeader title="Training Effectiveness Report" formatNumber={DOCUMENT_CONTROL.formatNumbers.effectiveness} pageLabel="Page 1 of 1" />

      <PrintSection title="Effectiveness by station (IATF 16949 §7.2 — evaluation of training effectiveness)">
        <table className="print-table">
          <thead>
            <tr><th>Station</th><th>Certified operators</th><th>First-time pass rate</th><th>Avg. ramp-to-competence (days)</th><th>Cycle time — first run</th><th>Cycle time — last run before cert.</th><th>Avg. VR hours per certified operator</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.station.id}>
                <td>{r.station.name} ({r.station.id})</td>
                <td>{r.n}</td>
                <td>{r.firstTimePassPct !== undefined ? `${r.firstTimePassPct}%` : 'Not recorded'}</td>
                <td>{r.avgRampDays ?? 'Not recorded'}</td>
                <td>{r.avgBeforePct !== undefined ? `${r.avgBeforePct}% of standard` : 'Not recorded'}</td>
                <td>{r.avgAfterPct !== undefined ? `${r.avgAfterPct}% of standard` : 'Not recorded'}</td>
                <td>{r.avgVrHours ?? 'Not recorded'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PrintSection>

      <PrintSection title="Post-certification quality linkage (IATF 16949 §7.2 — A-08)">
        <div style={{ fontSize: 10.5, lineHeight: 1.6 }}>
          <p style={{ marginBottom: 6 }}>
            IATF 16949 §7.2 requires evaluating the <em>effectiveness</em> of training, not just recording that it happened. The cycle-time
            convergence and first-time pass rate above are evaluated directly from VR telemetry and are complete.
          </p>
          <p style={{ fontStyle: 'italic', color: '#9E1A14' }}>
            Post-certification defect / scrap / rework data linked to individual certified operators is not available in this demo dataset —
            this requires an integration with the plant's quality or MES system (linking part serial / batch to operator and station). Not
            recorded here rather than estimated. Wiring this link closes the loop the physical Dojo has never been able to provide.
          </p>
        </div>
      </PrintSection>

      <PrintFooter recordId="TRAINING-EFFECTIVENESS" />
    </PrintPage>
  );
}

import { PrintPage, PrintHeader, PrintFooter, PrintSection, PrintField } from './PrintChrome';
import { DATA, traineeById, stationById } from '../../data';
import { MODULES } from '../../data/stations';
import { DOCUMENT_CONTROL, THRESHOLDS } from '../../data/config';

export function AssessmentDetailPrint({ assessmentId }: { assessmentId: string }) {
  const assessment = DATA.assessments.find(a => a.id === assessmentId);
  if (!assessment) return null;
  const trainee = traineeById(assessment.traineeId);
  const station = stationById(assessment.stationId);
  const session = DATA.sessions.find(s => s.id === assessment.sessionId);
  if (!trainee || !station || !session) return null;
  const mod = MODULES.find(m => m.id === session.moduleId);
  const w = assessment.weights;

  return (
    <PrintPage>
      <PrintHeader
        title="Assessment Detail Report"
        formatNumber={DOCUMENT_CONTROL.formatNumbers.assessmentDetail}
        scopeLine={`${trainee.name} (${trainee.id}) — ${station.name} — Attempt #${assessment.attemptNumber}`}
        pageLabel="Page 1 of 1"
      />

      <PrintSection title="Session">
        <div className="print-field-grid">
          <PrintField label="Session ID" value={session.id} />
          <PrintField label="Module" value={`${mod?.title ?? 'Not recorded'} · ${session.moduleVersion}`} />
          <PrintField label="Station" value={`${station.name} (${station.id})`} />
          <PrintField label="Session type" value={session.sessionType} />
          <PrintField label="Date" value={session.date} />
          <PrintField label="Start / end time" value={`${session.startTime} – ${session.endTime} IST`} />
          <PrintField label="Total duration" value={`${Math.round(session.durationSec / 60)} min ${session.durationSec % 60}s`} />
          <PrintField label="Headset / device ID" value={session.headsetId} />
          <PrintField label="Software / content build" value={session.buildVersion} />
          <PrintField label="Location" value={session.location} />
          <PrintField label="Supervising trainer present" value={session.trainerPresent ? `${session.trainerPresent.name} (${session.trainerPresent.id})` : undefined} />
          <PrintField label="Completion status" value={session.completionStatus} />
          <PrintField label="Telemetry file reference" value={session.telemetryFileRef} />
          <PrintField label="Telemetry checksum" value={session.telemetryChecksum} />
        </div>
      </PrintSection>

      <PrintSection title="Step-level telemetry">
        <table className="print-table">
          <thead>
            <tr><th>Seq</th><th>Step</th><th>Critical</th><th>Sequence OK</th><th>Time taken (s)</th><th>Target ± tol (s)</th><th>Correct</th><th>Error type</th><th>Retries</th><th>Hint</th><th>Help</th></tr>
          </thead>
          <tbody>
            {session.steps.map((s, i) => {
              const stepDef = mod?.steps[i];
              return (
                <tr key={s.stepId}>
                  <td>{stepDef?.seq ?? i + 1}</td>
                  <td>{stepDef?.description ?? s.stepId}</td>
                  <td>{stepDef?.critical ? 'Yes' : 'No'}</td>
                  <td style={{ color: s.sequenceOk ? '#065f46' : '#9E1A14', fontWeight: 700 }}>{s.sequenceOk ? 'Yes' : 'No'}</td>
                  <td>{s.timeTakenSec}</td>
                  <td>{stepDef ? `${stepDef.targetTimeSec} ± ${stepDef.toleranceSec}` : 'Not recorded'}</td>
                  <td style={{ color: s.correct ? '#065f46' : '#9E1A14', fontWeight: 700 }}>{s.correct ? 'Yes' : 'NO'}</td>
                  <td>{s.errorType ?? '—'}</td>
                  <td>{s.retryCount}</td>
                  <td>{s.hintUsed ? 'Yes' : 'No'}</td>
                  <td>{s.helpRequested ? 'Yes' : 'No'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </PrintSection>

      <PrintSection title="Session-level metrics">
        <div className="print-field-grid">
          <PrintField label="Sequence adherence" value={`${session.sequenceAdherencePct}%`} />
          <PrintField label="Cycle time achieved" value={`${session.cycleTimeAchievedSec}s vs standard ${station.standardCycleTimeSec}s (${Math.round((session.cycleTimeAchievedSec / station.standardCycleTimeSec) * 100)}%)`} />
          <PrintField label="Error count by category" value={Object.entries(session.errorCountByCategory).map(([k, v]) => `${k}: ${v}`).join(', ') || 'None'} />
          <PrintField label="Critical error count" value={session.criticalErrorCount} />
          <PrintField label="Safety violations" value={session.safetyViolations} />
          <PrintField label="Retries" value={session.retries} />
          <PrintField label="Hints used" value={session.hintsUsed} />
          <PrintField label="Idle / hesitation time" value={`${session.idleTimeSec}s`} />
        </div>
      </PrintSection>

      <PrintSection title="Assessment scoring">
        <table className="print-table">
          <thead><tr><th>Knowledge %</th><th>Practical %</th><th>Sequence %</th><th>Cycle time %</th><th>Quality %</th><th>Safety</th><th>Critical step</th><th>Weighted overall %</th><th>Result</th></tr></thead>
          <tbody>
            <tr>
              <td>{assessment.knowledgeScorePct ?? 'Not recorded'}</td>
              <td>{assessment.practicalScorePct}</td>
              <td>{assessment.sequenceAdherenceScorePct}</td>
              <td>{assessment.cycleTimeScorePct}</td>
              <td>{assessment.qualityScorePct}</td>
              <td style={{ fontWeight: 700, color: assessment.safetyPass ? '#065f46' : '#9E1A14' }}>{assessment.safetyPass ? 'Pass' : 'FAIL'}</td>
              <td style={{ fontWeight: 700, color: assessment.criticalStepResult === 'Pass' ? '#065f46' : '#9E1A14' }}>{assessment.criticalStepResult}</td>
              <td style={{ fontWeight: 700 }}>{assessment.weightedOverallPct}</td>
              <td style={{ fontWeight: 700 }}>{assessment.result}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ fontSize: 8.5, color: '#363C4E', marginTop: 4 }}>
          Weights: Knowledge {w.knowledge * 100}% · Practical {w.practical * 100}% · Sequence {w.sequence * 100}% · Cycle time {w.cycleTime * 100}% · Quality {w.quality * 100}%.
          Pass threshold {THRESHOLDS.passOverallPct}% · Marginal {THRESHOLDS.marginalOverallPct}%. Safety and critical-step are independent pass/fail gates — a fail on either overrides the weighted score (G-04/G-05).
        </div>
      </PrintSection>

      <PrintSection title="Assessor checklist and observation">
        <table className="print-table" style={{ marginBottom: 6 }}>
          <thead><tr><th>Checklist item</th><th>Result</th></tr></thead>
          <tbody>
            {assessment.checklist.map((c, i) => (
              <tr key={i}><td>{c.item}</td><td style={{ fontWeight: 700 }}>{c.result}</td></tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 10 }}>
          <strong>Assessor observation ({assessment.assessorName}, {assessment.assessorId}):</strong> {assessment.assessorObservation}
        </div>
        {assessment.trainerRemarks && <div style={{ fontSize: 10, marginTop: 4 }}><strong>Trainer remarks:</strong> {assessment.trainerRemarks}</div>}
        {assessment.developmentPlan && <div style={{ fontSize: 10, marginTop: 4 }}><strong>Development plan:</strong> {assessment.developmentPlan}</div>}
      </PrintSection>

      <PrintFooter recordId={assessment.id} />
    </PrintPage>
  );
}

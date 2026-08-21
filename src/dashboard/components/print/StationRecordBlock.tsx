import { PrintSection, PrintField, SignatureBlock } from './PrintChrome';
import { traineeById, stationById, certificationsFor, assessmentsFor, sessionsFor } from '../../data';
import { DOCUMENT_CONTROL, THRESHOLDS } from '../../data/config';
import { levelLabel } from '../../lib/i18n';

/**
 * Everything between the print header and footer for one trainee × one
 * station — identity, scope, level/status, full evidence chain, practice run
 * summary, checklist, awareness attestation, signature block. Shared by the
 * single-station Individual Competence Record and the multi-station
 * Complete Employee Competence Record so both stay byte-for-byte consistent.
 */
export function StationRecordBlock({ traineeId, stationId, showIdentity = true }: { traineeId: string; stationId: string; showIdentity?: boolean }) {
  const trainee = traineeById(traineeId);
  const station = stationById(stationId);
  if (!trainee || !station) return null;

  const cert = certificationsFor(traineeId).filter(c => c.stationId === stationId).sort((a, b) => b.dateOfCertification.localeCompare(a.dateOfCertification))[0];
  const assessments = assessmentsFor(traineeId).filter(a => a.stationId === stationId);
  const latestAssessment = assessments[assessments.length - 1];
  const sessions = sessionsFor(traineeId).filter(s => s.stationId === stationId);
  const practiceSessions = sessions.filter(s => s.sessionType === 'Practice');

  const level = cert ? levelLabel(cert.levelAwarded) : levelLabel(0);
  const w = latestAssessment?.weights;

  return (
    <>
      {showIdentity && (
        <PrintSection title="Trainee identity">
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              width: 56, height: 56, border: '1.5px solid #1B1F35', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 18, color: '#1B1F35', flexShrink: 0,
            }}>
              {trainee.photoInitials}
            </div>
            <div className="print-field-grid" style={{ flex: 1 }}>
              <PrintField label="Full name" value={trainee.name} />
              <PrintField label="Employee / Trainee ID" value={trainee.id} />
              <PrintField label="Employment type" value={`${trainee.employmentType}${trainee.contractorName ? ` — ${trainee.contractorName}` : ''}`} />
              <PrintField label="Date of birth" value={trainee.dob} />
              <PrintField label="Department / Shift" value={`${trainee.department} · Shift ${trainee.shift}`} />
              <PrintField label="Designation" value={trainee.designation} />
              <PrintField label="Reporting supervisor" value={`${trainee.supervisor} (${trainee.supervisorId})`} />
              <PrintField label="Date of joining" value={trainee.dateOfJoining} />
              <PrintField label="Education / qualification" value={trainee.education} />
            </div>
          </div>
        </PrintSection>
      )}

      <PrintSection title="Scope of certification">
        <div className="print-field-grid">
          <PrintField label="Station" value={`${station.name} (${station.id})`} />
          <PrintField label="Line / area" value={station.line} />
          <PrintField label="Part number(s)" value={station.partNumbers.join(', ')} />
          <PrintField label="Work instruction" value={`${station.workInstructionRef} · Rev ${station.workInstructionRevision} (${station.workInstructionRevisionDate})`} />
          <PrintField label="Control plan" value={station.controlPlanRef} />
          <PrintField label="Special characteristic" value={station.specialCharacteristic} />
        </div>
      </PrintSection>

      <PrintSection title="Competence level and status">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="print-status-pill">
            <span className="symbol">{level.symbol}</span>Level {cert?.levelAwarded ?? 0} — {level.text}
          </div>
          <div className="print-status-pill">{cert?.status ?? 'Not recorded'}</div>
        </div>
        <div className="print-field-grid" style={{ marginTop: 8 }}>
          <PrintField label="Certificate ID" value={cert?.id} />
          <PrintField label="Date of certification" value={cert?.dateOfCertification} />
          <PrintField label="Valid from" value={cert?.validFrom} />
          <PrintField label="Valid until" value={cert?.validUntil} />
          <PrintField label="Re-qualification due" value={cert?.requalificationDueDate} />
          <PrintField label="Re-qualification trigger" value={cert?.requalificationTriggerReason ?? (cert ? '—' : undefined)} />
          <PrintField label="Restrictions / conditions" value={cert?.restrictions ?? 'None'} />
          <PrintField label="Basis of competence" value={cert?.basisOfCompetence.join('; ')} />
        </div>
        {cert?.status === 'Suspended' && (
          <div style={{ marginTop: 6, padding: '6px 8px', background: '#FFEEEB', border: '1px solid #ED3123', fontSize: 10 }}>
            <strong>Withdrawal / suspension reason:</strong> {cert.withdrawalReason} — authorised by {cert.withdrawalAuthoriser}
          </div>
        )}
      </PrintSection>

      <PrintSection title="Evidence of competence — training and assessment">
        <table className="print-table">
          <thead>
            <tr><th>Attempt</th><th>Session ID</th><th>Type</th><th>Date</th><th>Knowledge %</th><th>Practical %</th><th>Sequence %</th><th>Cycle time %</th><th>Quality %</th><th>Safety</th><th>Critical step</th><th>Weighted overall %</th><th>Result</th></tr>
          </thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a.id}>
                <td>{a.attemptNumber}</td>
                <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9 }}>{a.sessionId}</td>
                <td>Assessment</td>
                <td>{a.date}</td>
                <td>{a.knowledgeScorePct ?? 'Not recorded'}</td>
                <td>{a.practicalScorePct}</td>
                <td>{a.sequenceAdherenceScorePct}</td>
                <td>{a.cycleTimeScorePct}</td>
                <td>{a.qualityScorePct}</td>
                <td style={{ color: a.safetyPass ? '#065f46' : '#9E1A14', fontWeight: 700 }}>{a.safetyPass ? 'Pass' : 'FAIL'}</td>
                <td style={{ color: a.criticalStepResult === 'Pass' ? '#065f46' : '#9E1A14', fontWeight: 700 }}>{a.criticalStepResult}</td>
                <td style={{ fontWeight: 700 }}>{a.weightedOverallPct}</td>
                <td style={{ fontWeight: 700, color: a.result === 'Pass' ? '#065f46' : a.result === 'Marginal' ? '#92400e' : '#9E1A14' }}>{a.result}</td>
              </tr>
            ))}
            {assessments.length === 0 && <tr><td colSpan={13} style={{ fontStyle: 'italic', color: '#8890A0' }}>Not recorded — no assessment attempt on file for this station.</td></tr>}
          </tbody>
        </table>
        {w && (
          <div style={{ fontSize: 8.5, color: '#363C4E', marginTop: 4 }}>
            Scoring weights (configurable, Admin Settings): Knowledge {w.knowledge * 100}% · Practical {w.practical * 100}% · Sequence adherence {w.sequence * 100}% ·
            Cycle time {w.cycleTime * 100}% · Quality {w.quality * 100}%. Safety is a pass/fail gate, not part of the weighted score.
            Pass threshold {THRESHOLDS.passOverallPct}% · Marginal threshold {THRESHOLDS.marginalOverallPct}%. A critical-step failure or safety violation fails the attempt regardless of the weighted score.
          </div>
        )}
      </PrintSection>

      <PrintSection title="Practice run summary">
        <table className="print-table">
          <thead><tr><th>Run</th><th>Date</th><th>Sequence adherence %</th><th>Cycle time (s) vs standard {station.standardCycleTimeSec}s</th><th>Errors</th><th>Retries</th><th>Hints used</th></tr></thead>
          <tbody>
            {practiceSessions.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.date}</td>
                <td>{s.sequenceAdherencePct}</td>
                <td>{s.cycleTimeAchievedSec} ({Math.round((s.cycleTimeAchievedSec / station.standardCycleTimeSec) * 100)}%)</td>
                <td>{Object.values(s.errorCountByCategory).reduce((a, b) => a + b, 0)}</td>
                <td>{s.retries}</td>
                <td>{s.hintsUsed}</td>
              </tr>
            ))}
            {practiceSessions.length === 0 && <tr><td colSpan={7} style={{ fontStyle: 'italic', color: '#8890A0' }}>Not recorded</td></tr>}
          </tbody>
        </table>
        {practiceSessions.length > 0 && (
          <div style={{ fontSize: 8.5, color: '#363C4E', marginTop: 4 }}>
            {practiceSessions.length} practice run(s) logged · average cycle time {Math.round(practiceSessions.reduce((s, r) => s + r.cycleTimeAchievedSec, 0) / practiceSessions.length)}s
            ({Math.round((practiceSessions.reduce((s, r) => s + r.cycleTimeAchievedSec, 0) / practiceSessions.length / station.standardCycleTimeSec) * 100)}% of standard) ·
            total retries {practiceSessions.reduce((s, r) => s + r.retries, 0)} · total hints used {practiceSessions.reduce((s, r) => s + r.hintsUsed, 0)}
          </div>
        )}
      </PrintSection>

      {latestAssessment && (
        <PrintSection title="Assessor checklist and observation">
          <table className="print-table" style={{ marginBottom: 6 }}>
            <thead><tr><th>Checklist item</th><th>Result</th></tr></thead>
            <tbody>
              {latestAssessment.checklist.map((c, i) => (
                <tr key={i}><td>{c.item}</td><td style={{ fontWeight: 700 }}>{c.result}</td></tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 10 }}>
            <strong>Assessor observation ({latestAssessment.assessorName}, {latestAssessment.assessorId}):</strong> {latestAssessment.assessorObservation}
          </div>
          {latestAssessment.trainerRemarks && (
            <div style={{ fontSize: 10, marginTop: 4 }}><strong>Trainer remarks:</strong> {latestAssessment.trainerRemarks}</div>
          )}
          {latestAssessment.developmentPlan && (
            <div style={{ fontSize: 10, marginTop: 4 }}><strong>Development plan:</strong> {latestAssessment.developmentPlan}</div>
          )}
        </PrintSection>
      )}

      <PrintSection title="Evidence references (traceability)">
        <div className="print-field-grid">
          <PrintField label="Session ID(s)" value={cert?.evidenceRefs.sessionIds.join(', ') ?? sessions.map(s => s.id).join(', ')} />
          <PrintField label="Assessment ID(s)" value={cert?.evidenceRefs.assessmentIds.join(', ') ?? assessments.map(a => a.id).join(', ')} />
          <PrintField label="Telemetry checksum" value={cert?.evidenceRefs.checksums[0]} />
        </div>
      </PrintSection>

      <PrintSection title="Awareness attestation (IATF 16949 §7.3.1)">
        <table className="print-table">
          <tbody>
            <tr><td>Operator can state their contribution to product quality</td><td style={{ width: 90, fontWeight: 700 }}>{cert?.awarenessAttestation?.productQuality ? 'Confirmed' : 'Not recorded'}</td></tr>
            <tr><td>Operator can state their contribution to product safety</td><td style={{ fontWeight: 700 }}>{cert?.awarenessAttestation?.productSafety ? 'Confirmed' : 'Not recorded'}</td></tr>
            <tr><td>Operator can state the consequence of nonconformity at this station</td><td style={{ fontWeight: 700 }}>{cert?.awarenessAttestation?.nonconformityConsequence ? 'Confirmed' : 'Not recorded'}</td></tr>
          </tbody>
        </table>
      </PrintSection>

      <PrintSection title="Certification sign-off">
        <SignatureBlock
          recommended={cert?.recommendedBy}
          verified={{ name: DOCUMENT_CONTROL.preparedBy, id: '—', role: 'Training Coordinator' }}
          authorised={cert?.authorisedBy}
          acknowledged={{ name: trainee.name, id: trainee.id }}
          auditTrailRef={cert?.id ?? 'N/A'}
        />
      </PrintSection>
    </>
  );
}

export function stationRecordId(traineeId: string, stationId: string): string {
  const cert = certificationsFor(traineeId).filter(c => c.stationId === stationId)[0];
  return cert?.id ?? `${traineeId}-${stationId}`;
}

/** Every station a trainee has any recorded history on — assigned, certified, assessed, or trained. */
export function stationIdsForTrainee(traineeId: string): string[] {
  const trainee = traineeById(traineeId);
  const ids = new Set<string>(trainee?.assignedStations ?? []);
  certificationsFor(traineeId).forEach(c => ids.add(c.stationId));
  assessmentsFor(traineeId).forEach(a => ids.add(a.stationId));
  sessionsFor(traineeId).forEach(s => ids.add(s.stationId));
  return Array.from(ids);
}

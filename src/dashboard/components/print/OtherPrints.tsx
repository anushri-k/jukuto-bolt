import { PrintPage, PrintHeader, PrintFooter, PrintSection } from './PrintChrome';
import { DATA, STATIONS, latestCertificationFor } from '../../data';
import { DOCUMENT_CONTROL, CLAUSE_MAP, STANDARD_EDITION } from '../../data/config';
import { levelLabel } from '../../lib/i18n';
import { runChecks, auditReadinessScore } from '../../lib/checks';

export function SkillMatrixPrint() {
  const trainees = DATA.trainees.filter(t => t.status !== 'Exited');
  return (
    <PrintPage landscape>
      <PrintHeader title="Skill Matrix" formatNumber={DOCUMENT_CONTROL.formatNumbers.skillMatrix} pageLabel="Page 1 of 1" />
      <PrintSection title="Operator × Station — competence level">
        <table className="print-table">
          <thead>
            <tr>
              <th>Operator</th>
              {STATIONS.map(s => <th key={s.id}>{s.name}{s.specialCharacteristic !== 'None' ? ` (${s.specialCharacteristic})` : ''}</th>)}
            </tr>
          </thead>
          <tbody>
            {trainees.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 600 }}>{t.name}<br /><span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8.5, fontWeight: 400 }}>{t.id}</span></td>
                {STATIONS.map(s => {
                  if (t.targetStation !== s.id) return <td key={s.id} style={{ textAlign: 'center', color: '#C9CFDD' }}>—</td>;
                  const cert = latestCertificationFor(t.id, s.id);
                  const lv = levelLabel(cert?.levelAwarded ?? 0);
                  return <td key={s.id} style={{ textAlign: 'center' }}>{lv.symbol}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 8.5, marginTop: 6, color: '#363C4E' }}>
          Legend: ○ Not trained · ◔ Under training · ◑ Can perform under supervision · ◕ Competent — independent · ● Can train / assess others
        </div>
      </PrintSection>
      <PrintFooter recordId="SKILL-MATRIX" />
    </PrintPage>
  );
}

export function RequalDuePrint() {
  const rows = DATA.certifications.filter(c => c.status === 'Re-qualification due');
  return (
    <PrintPage>
      <PrintHeader title="Re-qualification Due Report" formatNumber={DOCUMENT_CONTROL.formatNumbers.requalDue} pageLabel="Page 1 of 1" />
      <PrintSection title={`${rows.length} certification(s) requiring re-qualification`}>
        <table className="print-table">
          <thead><tr><th>Operator</th><th>Station</th><th>Level</th><th>Valid until</th><th>Trigger reason</th></tr></thead>
          <tbody>
            {rows.map(c => {
              const t = DATA.trainees.find(tt => tt.id === c.traineeId)!;
              const s = STATIONS.find(ss => ss.id === c.stationId)!;
              return (
                <tr key={c.id}>
                  <td>{t.name} ({t.id})</td>
                  <td>{s.name}</td>
                  <td>L{c.levelAwarded}</td>
                  <td>{c.validUntil}</td>
                  <td>{c.requalificationTriggerReason}</td>
                </tr>
              );
            })}
            {rows.length === 0 && <tr><td colSpan={5} style={{ fontStyle: 'italic' }}>None — no overdue re-qualifications on record.</td></tr>}
          </tbody>
        </table>
      </PrintSection>
      <PrintFooter recordId="REQUAL-DUE" />
    </PrintPage>
  );
}

export function StationCoveragePrint() {
  return (
    <PrintPage landscape>
      <PrintHeader title="Station Competence Coverage Report" formatNumber={DOCUMENT_CONTROL.formatNumbers.stationCoverage} pageLabel="Page 1 of 1" />
      <PrintSection title="Certified operators by station and shift">
        <table className="print-table">
          <thead><tr><th>Station</th><th>Special char.</th><th>Min/shift</th><th>Shift A</th><th>Shift B</th><th>Shift C</th><th>Gap?</th></tr></thead>
          <tbody>
            {STATIONS.map(s => {
              const shifts: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
              const counts = shifts.map(sh => DATA.trainees.filter(t => t.targetStation === s.id && t.shift === sh && t.status === 'Certified').length);
              const gap = counts.some(c => c < s.minCertifiedPerShift);
              return (
                <tr key={s.id}>
                  <td>{s.name} ({s.id})</td>
                  <td>{s.specialCharacteristic}</td>
                  <td>{s.minCertifiedPerShift}</td>
                  {counts.map((c, i) => <td key={i} style={{ color: c < s.minCertifiedPerShift ? '#9E1A14' : undefined, fontWeight: c < s.minCertifiedPerShift ? 700 : 400 }}>{c}</td>)}
                  <td style={{ fontWeight: 700, color: gap ? '#9E1A14' : '#065f46' }}>{gap ? 'YES' : 'No'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </PrintSection>
      <PrintFooter recordId="STATION-COVERAGE" />
    </PrintPage>
  );
}

export function AuditTrailPrint() {
  const rows = DATA.auditLog.slice().reverse().slice(0, 60);
  return (
    <PrintPage>
      <PrintHeader title="Audit Trail Report" formatNumber={DOCUMENT_CONTROL.formatNumbers.auditTrail} pageLabel="Page 1 of 1" />
      <PrintSection title={`Most recent ${rows.length} of ${DATA.auditLog.length} logged events`}>
        <table className="print-table">
          <thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Record</th></tr></thead>
          <tbody>
            {rows.map(e => (
              <tr key={e.id}>
                <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8.5 }}>{e.timestamp.replace('T', ' ').slice(0, 19)}</td>
                <td>{e.userName}</td>
                <td>{e.role.replace('_', ' ')}</td>
                <td>{e.action}</td>
                <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 8.5 }}>{e.recordType} · {e.recordId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PrintSection>
      <PrintFooter recordId="AUDIT-TRAIL" />
    </PrintPage>
  );
}

export function AuditReadinessPrint() {
  const checks = runChecks();
  const score = auditReadinessScore(checks);
  return (
    <PrintPage>
      <PrintHeader title="Audit-Readiness Summary" formatNumber={DOCUMENT_CONTROL.formatNumbers.auditPack} pageLabel="Page 1 of 1" />
      <PrintSection title={`Composite score: ${score}% (${checks.filter(c => c.pass).length}/${checks.length} checks passing)`}>
        <table className="print-table">
          <thead><tr><th>Check</th><th>Description</th><th>Result</th><th>Failing records</th></tr></thead>
          <tbody>
            {checks.map(c => (
              <tr key={c.id}>
                <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9 }}>{c.id}</td>
                <td>{c.description}</td>
                <td style={{ fontWeight: 700, color: c.pass ? '#065f46' : '#9E1A14' }}>{c.pass ? 'PASS' : 'FAIL'}</td>
                <td style={{ fontSize: 9 }}>{c.pass ? '—' : c.failingRecords.slice(0, 3).map(r => r.label).join('; ') + (c.failingRecords.length > 3 ? ` +${c.failingRecords.length - 3} more` : '')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PrintSection>
      <PrintSection title={`IATF 16949 clause map — ${STANDARD_EDITION} (configurable)`}>
        <table className="print-table">
          <thead><tr><th>Clause</th><th>Requirement</th><th>Answered by</th></tr></thead>
          <tbody>
            {CLAUSE_MAP.map(c => (
              <tr key={c.clause}><td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9 }}>{c.clause}</td><td>{c.requirement}</td><td>{c.answeredBy}</td></tr>
            ))}
          </tbody>
        </table>
      </PrintSection>
      <PrintFooter recordId="AUDIT-READINESS" />
    </PrintPage>
  );
}

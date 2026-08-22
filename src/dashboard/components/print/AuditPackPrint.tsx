import { PrintPage, PrintHeader, PrintFooter, PrintSection, PrintField } from './PrintChrome';
import { PLANT, DOCUMENT_CONTROL, TODAY, STANDARD_EDITION } from '../../data/config';
import { runChecks, auditReadinessScore } from '../../lib/checks';
import { getTrainees } from '../../lib/store';
import { SkillMatrixPrint, StationCoveragePrint, RequalDuePrint, AuditTrailPrint, AuditReadinessPrint } from './OtherPrints';

const CONTENTS = [
  { page: 3, title: 'Audit-Readiness Summary + IATF 16949 Clause Map' },
  { page: 4, title: 'Skill Matrix' },
  { page: 5, title: 'Station Competence Coverage Report' },
  { page: 6, title: 'Re-qualification Due Report' },
  { page: 7, title: 'Audit Trail Report' },
];
const TOTAL_PAGES = 7;

/**
 * A single continuously-paginated PDF: cover sheet, index, clause-map
 * appendix, then the selected records — exactly what gets handed across
 * the table in an audit (Section 9, report type 10).
 */
export function AuditPackPrint() {
  const checks = runChecks();
  const score = auditReadinessScore(checks);
  const trainees = getTrainees();
  const certifiedCount = trainees.filter(t => t.status === 'Certified').length;

  return (
    <>
      <PrintPage>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100%' }}>
          <div>
            <div className="flex items-center gap-2 mb-8">
              <svg width="28" height="28" viewBox="0 0 120 120">
                <path d="M76.9 23.75 A 40 40 0 1 1 43.1 23.75" fill="none" stroke="#1B1F35" strokeWidth="10" strokeLinecap="round" />
                <circle cx="76.9" cy="23.75" r="8.5" fill="#ED3123" />
              </svg>
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 600, fontSize: 20, color: '#1B1F35' }}>Jukuto</span>
            </div>
            <div className="print-eyebrow" style={{ marginBottom: 8 }}>Complete Audit Pack</div>
            <div className="print-h1" style={{ fontSize: 28, marginBottom: 10 }}>Competence Evidence — Audit Submission</div>
            <div style={{ fontSize: 12, color: '#363C4E', lineHeight: 1.8 }}>
              {PLANT.name}<br />{PLANT.location}<br />Customer: {PLANT.customer}
            </div>

            <div className="print-field-grid" style={{ marginTop: 32, gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <PrintField label="Scope" value="Plant-wide — all trainees, all stations" />
              <PrintField label="Standard" value={`${STANDARD_EDITION} (clause map configurable)`} />
              <PrintField label="Data as-of" value={TODAY} />
              <PrintField label="Document number" value={DOCUMENT_CONTROL.formatNumbers.auditPack} />
              <PrintField label="Total trainees on record" value={trainees.length} />
              <PrintField label="Certified & active" value={certifiedCount} />
              <PrintField label="Audit-readiness score" value={`${score}% (${checks.filter(c => c.pass).length}/${checks.length} checks passing)`} />
              <PrintField label="Total pages" value={TOTAL_PAGES} />
            </div>
          </div>
          <div style={{ fontSize: 9, color: '#363C4E' }}>
            {DOCUMENT_CONTROL.confidentiality} · Prepared by {DOCUMENT_CONTROL.preparedBy} · Reviewed by {DOCUMENT_CONTROL.reviewedBy} · Approved by {DOCUMENT_CONTROL.approvedBy}
          </div>
        </div>
      </PrintPage>

      <PrintPage>
        <PrintHeader title="Complete Audit Pack — Index" formatNumber={DOCUMENT_CONTROL.formatNumbers.auditPack} pageLabel={`Page 2 of ${TOTAL_PAGES}`} />
        <PrintSection title="Contents">
          <table className="print-table">
            <thead><tr><th>Page</th><th>Section</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Cover sheet</td></tr>
              <tr><td>2</td><td>Index (this page)</td></tr>
              {CONTENTS.map(c => <tr key={c.page}><td>{c.page}</td><td>{c.title}</td></tr>)}
            </tbody>
          </table>
        </PrintSection>
        <PrintSection title="How to read this pack">
          <p style={{ fontSize: 10.5, lineHeight: 1.6 }}>
            Every record in this pack is traceable to a timestamped source event and an identified person (Section 3). Individual
            operator competence certificates are issued separately as the Individual Competence Record or Complete Employee
            Competence Record and are not duplicated here — this pack is the plant-level evidence set: readiness, coverage, and
            the audit trail behind it.
          </p>
        </PrintSection>
        <PrintFooter recordId="AUDIT-PACK-INDEX" />
      </PrintPage>

      <AuditReadinessPrint pageLabel={`Page 3 of ${TOTAL_PAGES}`} />
      <SkillMatrixPrint pageLabel={`Page 4 of ${TOTAL_PAGES}`} />
      <StationCoveragePrint pageLabel={`Page 5 of ${TOTAL_PAGES}`} />
      <RequalDuePrint pageLabel={`Page 6 of ${TOTAL_PAGES}`} />
      <AuditTrailPrint pageLabel={`Page 7 of ${TOTAL_PAGES}`} />
    </>
  );
}


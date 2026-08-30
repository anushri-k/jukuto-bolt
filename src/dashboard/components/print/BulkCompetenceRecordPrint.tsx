import { PrintPage, PrintHeader, PrintFooter, PrintSection } from './PrintChrome';
import { traineeById, stationById, latestCertificationFor } from '../../data';
import { DOCUMENT_CONTROL, PLANT, TODAY } from '../../data/config';
import { levelLabel } from '../../lib/i18n';
import { StationRecordBlock, stationRecordId } from './StationRecordBlock';

export interface RecordPair { traineeId: string; stationId: string }

/**
 * Bulk export of the Individual Competence Record — one full record per
 * trainee × station pair, each on its own sheet, behind a cover/index page so
 * the batch is traceable as a single controlled issue. Each record is the same
 * StationRecordBlock the single-record export prints, so a page pulled out of
 * this batch is identical to one exported on its own.
 */
export function BulkCompetenceRecordPrint({ pairs }: { pairs: RecordPair[] }) {
  const valid = pairs.filter(p => traineeById(p.traineeId) && stationById(p.stationId));
  const totalPages = 1 + valid.length;
  const batchId = `BULK-ICR-${TODAY.replace(/-/g, '')}-${valid.length}`;

  return (
    <>
      <PrintPage>
        <PrintHeader
          title="Individual Competence Records — Bulk Export"
          formatNumber={DOCUMENT_CONTROL.formatNumbers.competenceRecord}
          scopeLine={`${valid.length} record(s) · ${new Set(valid.map(p => p.traineeId)).size} operator(s) · ${new Set(valid.map(p => p.stationId)).size} station(s)`}
          pageLabel={`Page 1 of ${totalPages}`}
        />

        <PrintSection title="Batch summary">
          <div style={{ fontSize: 10.5, lineHeight: 1.6 }}>
            <div>Plant: {PLANT.name} · {PLANT.location}</div>
            <div>Batch reference: {batchId}</div>
            <div>Data as-of: {TODAY}</div>
            <div>Each following sheet is one complete Individual Competence Record ({DOCUMENT_CONTROL.formatNumbers.competenceRecord}), identical in content to the single-record export.</div>
          </div>
        </PrintSection>

        <PrintSection title={`Index — ${valid.length} record(s)`}>
          <table className="print-table">
            <thead>
              <tr><th>Page</th><th>Operator</th><th>Emp ID</th><th>Station</th><th>Level</th><th>Status</th><th>Valid until</th></tr>
            </thead>
            <tbody>
              {valid.map((p, i) => {
                const trainee = traineeById(p.traineeId);
                const station = stationById(p.stationId);
                const cert = latestCertificationFor(p.traineeId, p.stationId);
                const level = levelLabel(cert?.levelAwarded ?? 0);
                return (
                  <tr key={`${p.traineeId}-${p.stationId}`}>
                    <td>{i + 2}</td>
                    <td>{trainee?.name}</td>
                    <td>{trainee?.id}</td>
                    <td>{station?.name} ({station?.id})</td>
                    <td>{level.symbol} L{cert?.levelAwarded ?? 0}</td>
                    <td style={{ fontWeight: 700 }}>{cert?.status ?? 'Not recorded'}</td>
                    <td>{cert?.validUntil ?? 'Not recorded'}</td>
                  </tr>
                );
              })}
              {valid.length === 0 && (
                <tr><td colSpan={7} style={{ fontStyle: 'italic', color: '#8890A0' }}>No records selected.</td></tr>
              )}
            </tbody>
          </table>
        </PrintSection>

        <PrintFooter recordId={batchId} />
      </PrintPage>

      {valid.map((p, i) => {
        const trainee = traineeById(p.traineeId);
        const station = stationById(p.stationId);
        return (
          <PrintPage key={`${p.traineeId}-${p.stationId}`}>
            <PrintHeader
              title="Individual Competence Record"
              formatNumber={DOCUMENT_CONTROL.formatNumbers.competenceRecord}
              scopeLine={`${trainee?.name} (${trainee?.id}) — ${station?.name} (${station?.id})`}
              pageLabel={`Page ${i + 2} of ${totalPages}`}
            />
            <StationRecordBlock traineeId={p.traineeId} stationId={p.stationId} />
            <PrintFooter recordId={stationRecordId(p.traineeId, p.stationId)} />
          </PrintPage>
        );
      })}
    </>
  );
}

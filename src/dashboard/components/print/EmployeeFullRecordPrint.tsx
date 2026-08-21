import { PrintPage, PrintHeader, PrintFooter, PrintSection, PrintField } from './PrintChrome';
import { traineeById, stationById, latestCertificationFor } from '../../data';
import { DOCUMENT_CONTROL } from '../../data/config';
import { levelLabel } from '../../lib/i18n';
import { StationRecordBlock, stationIdsForTrainee } from './StationRecordBlock';

/**
 * The complete, station-by-station competence record for one employee —
 * every station they have any recorded history on, each rendered with the
 * same depth as the single-station Individual Competence Record, behind one
 * cover/summary page. This is the "download everything on this person" export.
 */
export function EmployeeFullRecordPrint({ traineeId }: { traineeId: string }) {
  const trainee = traineeById(traineeId);
  if (!trainee) return null;

  const stationIds = stationIdsForTrainee(traineeId);
  const totalPages = 1 + stationIds.length;

  return (
    <>
      <PrintPage>
        <PrintHeader
          title="Complete Employee Competence Record"
          formatNumber={DOCUMENT_CONTROL.formatNumbers.competenceRecord}
          scopeLine={`${trainee.name} (${trainee.id}) — all stations`}
          pageLabel={`Page 1 of ${totalPages}`}
        />

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
              <PrintField label="Overall status" value={trainee.status} />
            </div>
          </div>
        </PrintSection>

        <PrintSection title={`Station summary — ${stationIds.length} station(s) on record`}>
          <table className="print-table">
            <thead><tr><th>Station</th><th>Special char.</th><th>Level</th><th>Status</th><th>Valid until</th></tr></thead>
            <tbody>
              {stationIds.map(sid => {
                const station = stationById(sid);
                const cert = latestCertificationFor(traineeId, sid);
                const level = levelLabel(cert?.levelAwarded ?? 0);
                if (!station) return null;
                return (
                  <tr key={sid}>
                    <td>{station.name} ({station.id})</td>
                    <td>{station.specialCharacteristic}</td>
                    <td>{level.symbol} L{cert?.levelAwarded ?? 0}</td>
                    <td style={{ fontWeight: 700 }}>{cert?.status ?? 'Not recorded'}</td>
                    <td>{cert?.validUntil ?? 'Not recorded'}</td>
                  </tr>
                );
              })}
              {stationIds.length === 0 && <tr><td colSpan={5} style={{ fontStyle: 'italic', color: '#8890A0' }}>Not recorded — no station history on file.</td></tr>}
            </tbody>
          </table>
        </PrintSection>

        <PrintSection title="Contents">
          <div style={{ fontSize: 10.5 }}>
            {stationIds.map((sid, i) => {
              const station = stationById(sid);
              return <div key={sid}>Page {i + 2} — {station?.name} ({station?.id})</div>;
            })}
          </div>
        </PrintSection>

        <PrintFooter recordId={`${trainee.id}-FULL`} />
      </PrintPage>

      {stationIds.map((sid, i) => {
        const station = stationById(sid);
        return (
          <PrintPage key={sid}>
            <PrintHeader
              title="Complete Employee Competence Record"
              formatNumber={DOCUMENT_CONTROL.formatNumbers.competenceRecord}
              scopeLine={`${trainee.name} (${trainee.id}) — ${station?.name} (${sid})`}
              pageLabel={`Page ${i + 2} of ${totalPages}`}
            />
            <StationRecordBlock traineeId={traineeId} stationId={sid} showIdentity={false} />
            <PrintFooter recordId={`${trainee.id}-${sid}`} />
          </PrintPage>
        );
      })}
    </>
  );
}

import { PrintPage, PrintHeader, PrintFooter } from './PrintChrome';
import { traineeById, stationById } from '../../data';
import { DOCUMENT_CONTROL } from '../../data/config';
import { StationRecordBlock, stationRecordId } from './StationRecordBlock';

export function CompetenceRecordPrint({ traineeId, stationId }: { traineeId: string; stationId: string }) {
  const trainee = traineeById(traineeId);
  const station = stationById(stationId);
  if (!trainee || !station) return null;

  return (
    <PrintPage>
      <PrintHeader
        title="Individual Competence Record"
        formatNumber={DOCUMENT_CONTROL.formatNumbers.competenceRecord}
        scopeLine={`${trainee.name} (${trainee.id}) — ${station.name} (${station.id})`}
        pageLabel="Page 1 of 1"
      />
      <StationRecordBlock traineeId={traineeId} stationId={stationId} />
      <PrintFooter recordId={stationRecordId(traineeId, stationId)} />
    </PrintPage>
  );
}

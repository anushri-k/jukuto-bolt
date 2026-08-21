import { useState, useMemo } from 'react';
import { Printer, FileText } from 'lucide-react';
import { Nav } from '../../DashboardApp';
import { STATIONS, assessmentsFor } from '../../data';
import { Card, PageHeader } from '../ui';
import { CompetenceRecordPrint } from '../print/CompetenceRecordPrint';
import { EmployeeFullRecordPrint } from '../print/EmployeeFullRecordPrint';
import { TraineeProgressPrint } from '../print/TraineeProgressPrint';
import { AssessmentDetailPrint } from '../print/AssessmentDetailPrint';
import { TrainingNeedsPrint } from '../print/TrainingNeedsPrint';
import { TrainingEffectivenessPrint } from '../print/TrainingEffectivenessPrint';
import { AuditPackPrint } from '../print/AuditPackPrint';
import { SkillMatrixPrint, RequalDuePrint, StationCoveragePrint, AuditTrailPrint, AuditReadinessPrint } from '../print/OtherPrints';
import { useTrainees } from '../../lib/store';

type ReportId =
  | 'competence-record' | 'employee-full-record' | 'progress-report' | 'assessment-detail'
  | 'skill-matrix' | 'station-coverage' | 'requal-due' | 'training-needs' | 'training-effectiveness'
  | 'audit-readiness' | 'audit-trail' | 'audit-pack';

const REPORTS: { id: ReportId; title: string; desc: string }[] = [
  { id: 'competence-record', title: 'Individual Competence Record', desc: 'The certificate — one operator, one station, full evidence chain, signature block.' },
  { id: 'employee-full-record', title: 'Complete Employee Competence Record', desc: 'Everything on one employee — every station they have history on, cover page + station-by-station breakdown.' },
  { id: 'progress-report', title: 'Trainee Progress Report', desc: 'Full history, all attempts, all sessions, trend charts for one trainee.' },
  { id: 'assessment-detail', title: 'Assessment Detail Report', desc: 'One session drilled down to step level, with full telemetry.' },
  { id: 'skill-matrix', title: 'Skill Matrix', desc: 'Operator × station grid, one landscape sheet.' },
  { id: 'station-coverage', title: 'Station Competence Coverage Report', desc: 'Per station, per shift — who is certified, where the gaps are.' },
  { id: 'requal-due', title: 'Re-qualification Due Report', desc: 'The list that prevents a finding.' },
  { id: 'training-needs', title: 'Training Needs / Gap Report', desc: 'Who needs what, by when — plus station coverage gaps needing new intake.' },
  { id: 'training-effectiveness', title: 'Training Effectiveness Report', desc: 'Ramp-to-competence, first-time pass rate and cycle-time convergence by station.' },
  { id: 'audit-readiness', title: 'Audit-Readiness Summary + Clause Map', desc: 'Every Section 7 check, named failing records, IATF clause appendix.' },
  { id: 'audit-trail', title: 'Audit Trail Report', desc: 'Filtered, immutable event log.' },
  { id: 'audit-pack', title: 'Complete Audit Pack', desc: 'Cover sheet, index, clause map and the full plant-level evidence set, continuously paginated — what gets handed across the table.' },
];

const NEEDS_TRAINEE: ReportId[] = ['competence-record', 'employee-full-record', 'progress-report', 'assessment-detail'];
const NEEDS_STATION: ReportId[] = ['competence-record'];
const NEEDS_ASSESSMENT: ReportId[] = ['assessment-detail'];

export function ReportsCentre({ nav }: { nav: Nav }) {
  const trainees = useTrainees();
  const [report, setReport] = useState<ReportId>((nav.params?.report as ReportId) ?? 'competence-record');
  const [traineeId, setTraineeId] = useState(nav.params?.traineeId ?? trainees[0].id);
  const [stationId, setStationId] = useState(nav.params?.stationId ?? trainees[0].targetStation);

  const trainee = trainees.find(t => t.id === traineeId);
  const traineeAssessments = useMemo(() => assessmentsFor(traineeId), [traineeId]);
  const [assessmentId, setAssessmentId] = useState(nav.params?.assessmentId ?? traineeAssessments[0]?.id ?? '');

  const effectiveAssessmentId = traineeAssessments.some(a => a.id === assessmentId) ? assessmentId : (traineeAssessments[0]?.id ?? '');

  const doPrint = () => window.print();

  return (
    <div>
      <div className="no-print">
        <PageHeader title="Reports & Print Centre" subtitle="Select a report, preview exactly as it prints, then generate." />

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-4 lg:col-span-1">
            <h2 className="font-serif text-base font-semibold text-indigo-800 mb-3">Report type</h2>
            <div className="space-y-1.5">
              {REPORTS.map(r => (
                <button
                  key={r.id}
                  onClick={() => setReport(r.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${report === r.id ? 'bg-indigo-800 text-white' : 'hover:bg-cloud text-indigo-800'}`}
                >
                  <div className="font-medium flex items-center gap-2"><FileText size={14} />{r.title}</div>
                  <div className={`text-[11px] mt-0.5 ${report === r.id ? 'text-indigo-200' : 'text-graphite'}`}>{r.desc}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 lg:col-span-2">
            <h2 className="font-serif text-base font-semibold text-indigo-800 mb-3">Scope</h2>
            {NEEDS_TRAINEE.includes(report) ? (
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs text-graphite mb-1">Trainee</label>
                  <select
                    value={traineeId}
                    onChange={e => {
                      setTraineeId(e.target.value);
                      const t = trainees.find(tt => tt.id === e.target.value);
                      if (t) setStationId(t.targetStation);
                      setAssessmentId('');
                    }}
                    className="border border-line rounded-md px-3 py-2 text-sm min-w-[240px]"
                  >
                    {trainees.map(t => <option key={t.id} value={t.id}>{t.name} ({t.id})</option>)}
                  </select>
                </div>
                {NEEDS_STATION.includes(report) && (
                  <div>
                    <label className="block text-xs text-graphite mb-1">Station</label>
                    <select value={stationId} onChange={e => setStationId(e.target.value)} className="border border-line rounded-md px-3 py-2 text-sm min-w-[220px]">
                      {STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}
                {NEEDS_ASSESSMENT.includes(report) && (
                  <div>
                    <label className="block text-xs text-graphite mb-1">Attempt</label>
                    <select value={effectiveAssessmentId} onChange={e => setAssessmentId(e.target.value)} className="border border-line rounded-md px-3 py-2 text-sm min-w-[260px]">
                      {traineeAssessments.map(a => {
                        const station = STATIONS.find(s => s.id === a.stationId);
                        return <option key={a.id} value={a.id}>{station?.name} — Attempt #{a.attemptNumber} ({a.date}) — {a.result}</option>;
                      })}
                      {traineeAssessments.length === 0 && <option value="">No assessment attempts on file</option>}
                    </select>
                  </div>
                )}
                {report === 'employee-full-record' && (
                  <div className="text-[11px] text-graphite max-w-xs">Covers every station this employee has any recorded session, assessment or certification history on.</div>
                )}
              </div>
            ) : (
              <p className="text-sm text-graphite">This report covers the full current dataset — no additional scope needed for the demo.</p>
            )}
            <button onClick={doPrint} className="mt-4 flex items-center gap-2 bg-vermillion text-white text-sm font-semibold px-4 py-2.5 rounded-md hover:bg-vermillion-600 transition-colors">
              <Printer size={15} /> Print / Save as PDF
            </button>
            <div className="text-[11px] text-graphite mt-2">Uses the browser print dialog — choose "Save as PDF" for a file. Layout below is exactly what will print.</div>
          </Card>
        </div>
      </div>

      <div className="print-only-root">
        {report === 'competence-record' && trainee && <CompetenceRecordPrint traineeId={trainee.id} stationId={stationId} />}
        {report === 'employee-full-record' && trainee && <EmployeeFullRecordPrint traineeId={trainee.id} />}
        {report === 'progress-report' && trainee && <TraineeProgressPrint traineeId={trainee.id} />}
        {report === 'assessment-detail' && effectiveAssessmentId && <AssessmentDetailPrint assessmentId={effectiveAssessmentId} />}
        {report === 'skill-matrix' && <SkillMatrixPrint />}
        {report === 'station-coverage' && <StationCoveragePrint />}
        {report === 'requal-due' && <RequalDuePrint />}
        {report === 'training-needs' && <TrainingNeedsPrint />}
        {report === 'training-effectiveness' && <TrainingEffectivenessPrint />}
        {report === 'audit-readiness' && <AuditReadinessPrint />}
        {report === 'audit-trail' && <AuditTrailPrint />}
        {report === 'audit-pack' && <AuditPackPrint />}
      </div>
    </div>
  );
}

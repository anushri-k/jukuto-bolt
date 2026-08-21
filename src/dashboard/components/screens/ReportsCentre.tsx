import { useState } from 'react';
import { Printer, FileText } from 'lucide-react';
import { Nav } from '../../DashboardApp';
import { DATA, STATIONS } from '../../data';
import { Card, PageHeader } from '../ui';
import { CompetenceRecordPrint } from '../print/CompetenceRecordPrint';
import { SkillMatrixPrint, RequalDuePrint, StationCoveragePrint, AuditTrailPrint, AuditReadinessPrint } from '../print/OtherPrints';

type ReportId = 'competence-record' | 'skill-matrix' | 'requal-due' | 'station-coverage' | 'audit-trail' | 'audit-readiness';

const REPORTS: { id: ReportId; title: string; desc: string; built: boolean }[] = [
  { id: 'competence-record', title: 'Individual Competence Record', desc: 'The certificate — one operator, one station, full evidence chain, signature block.', built: true },
  { id: 'skill-matrix', title: 'Skill Matrix', desc: 'Operator × station grid, one landscape sheet.', built: true },
  { id: 'station-coverage', title: 'Station Competence Coverage Report', desc: 'Per station, per shift — who is certified, where the gaps are.', built: true },
  { id: 'requal-due', title: 'Re-qualification Due Report', desc: 'The list that prevents a finding.', built: true },
  { id: 'audit-readiness', title: 'Audit-Readiness Summary + Clause Map', desc: 'Every Section 7 check, named failing records, IATF clause appendix.', built: true },
  { id: 'audit-trail', title: 'Audit Trail Report', desc: 'Filtered, immutable event log.', built: true },
];

const NOT_YET_BUILT = [
  'Trainee Progress Report', 'Assessment Detail Report', 'Training Needs / Gap Report',
  'Training Effectiveness Report', 'Complete Audit Pack (bundled PDF)',
];

export function ReportsCentre({ nav }: { nav: Nav }) {
  const [report, setReport] = useState<ReportId>((nav.params?.report as ReportId) ?? 'competence-record');
  const [traineeId, setTraineeId] = useState(nav.params?.traineeId ?? DATA.trainees[0].id);
  const [stationId, setStationId] = useState(nav.params?.stationId ?? DATA.trainees[0].targetStation);

  const trainee = DATA.trainees.find(t => t.id === traineeId);

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
            <div className="mt-4 pt-4 border-t border-line">
              <div className="text-[10.5px] font-mono uppercase tracking-mono text-graphite mb-1.5">Not yet built in this demo</div>
              <ul className="text-[11.5px] text-graphite space-y-0.5">
                {NOT_YET_BUILT.map(n => <li key={n}>· {n}</li>)}
              </ul>
            </div>
          </Card>

          <Card className="p-4 lg:col-span-2">
            <h2 className="font-serif text-base font-semibold text-indigo-800 mb-3">Scope</h2>
            {report === 'competence-record' ? (
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs text-graphite mb-1">Trainee</label>
                  <select value={traineeId} onChange={e => { setTraineeId(e.target.value); const t = DATA.trainees.find(tt => tt.id === e.target.value); if (t) setStationId(t.targetStation); }} className="border border-line rounded-md px-3 py-2 text-sm min-w-[240px]">
                    {DATA.trainees.map(t => <option key={t.id} value={t.id}>{t.name} ({t.id})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-graphite mb-1">Station</label>
                  <select value={stationId} onChange={e => setStationId(e.target.value)} className="border border-line rounded-md px-3 py-2 text-sm min-w-[220px]">
                    {STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
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
        {report === 'skill-matrix' && <SkillMatrixPrint />}
        {report === 'station-coverage' && <StationCoveragePrint />}
        {report === 'requal-due' && <RequalDuePrint />}
        {report === 'audit-readiness' && <AuditReadinessPrint />}
        {report === 'audit-trail' && <AuditTrailPrint />}
      </div>
    </div>
  );
}

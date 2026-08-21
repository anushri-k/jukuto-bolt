import { Printer } from 'lucide-react';
import { Nav } from '../../DashboardApp';
import { DATA, STATIONS } from '../../data';
import { latestCertificationFor } from '../../data';
import { Card, PageHeader } from '../ui';
import { levelLabel } from '../../lib/i18n';

export function SkillMatrix({ nav }: { nav: Nav }) {
  const trainees = DATA.trainees.filter(t => t.status !== 'Exited');

  return (
    <div>
      <PageHeader
        title="Skill Matrix"
        subtitle="Operator × Station — prints on one A4/A3 landscape sheet."
        right={
          <button
            onClick={() => nav.go('reports', { report: 'skill-matrix' })}
            className="flex items-center gap-2 bg-vermillion text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-vermillion-600 transition-colors"
          >
            <Printer size={15} /> Print matrix
          </button>
        }
      />

      <Card className="p-3 mb-4 flex flex-wrap gap-4 text-xs text-graphite">
        {[0, 1, 2, 3, 4].map(l => {
          const lv = levelLabel(l);
          return <span key={l} className="flex items-center gap-1.5"><span className="text-base">{lv.symbol}</span>{lv.text}</span>;
        })}
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line bg-cloud">
              <th className="px-3 py-2.5 text-left font-semibold text-graphite sticky left-0 bg-cloud">Operator</th>
              {STATIONS.map(s => (
                <th key={s.id} className="px-2 py-2.5 text-center font-semibold text-graphite min-w-[92px]">
                  {s.name}
                  {s.specialCharacteristic !== 'None' && <div className="text-vermillion text-[9px] font-normal">{s.specialCharacteristic}</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trainees.map(t => (
              <tr key={t.id} className="border-b border-line last:border-0 hover:bg-cloud/50">
                <td className="px-3 py-2 font-medium text-indigo-800 sticky left-0 bg-white whitespace-nowrap">
                  {t.name}
                  <div className="text-[10px] text-graphite font-mono font-normal">{t.id}</div>
                </td>
                {STATIONS.map(s => {
                  const cert = latestCertificationFor(t.id, s.id);
                  const isTarget = t.targetStation === s.id;
                  if (!isTarget) return <td key={s.id} className="text-center text-graphite/30">—</td>;
                  const level = levelLabel(cert?.levelAwarded ?? 0);
                  const stale = cert?.status === 'Re-qualification due' || cert?.status === 'Expired';
                  return (
                    <td key={s.id} className={`text-center py-2 ${stale ? 'bg-vermillion-50' : ''}`}>
                      <span className="text-lg" title={level.text}>{level.symbol}</span>
                      {stale && <div className="text-[8.5px] text-vermillion-700 font-semibold">Requal due</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

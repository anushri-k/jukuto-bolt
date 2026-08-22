import { AlertTriangle } from 'lucide-react';
import { Nav } from '../../DashboardApp';
import { STATIONS } from '../../data';
import { Card, PageHeader } from '../ui';
import { useTrainees } from '../../lib/store';

export function StationMaster({ nav }: { nav: Nav }) {
  const trainees = useTrainees();
  return (
    <div>
      <PageHeader title="Station / Operation Master" subtitle={`${STATIONS.length} stations across 3 lines.`} />
      <div className="grid md:grid-cols-2 gap-4">
        {STATIONS.map(station => {
          const shifts: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];
          const certifiedTotal = trainees.filter(t => t.targetStation === station.id && t.status === 'Certified').length;
          return (
            <Card key={station.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-serif text-lg font-semibold text-indigo-800">{station.name}</div>
                  <div className="text-xs text-graphite font-mono">{station.id} · {station.line}</div>
                </div>
                {station.specialCharacteristic !== 'None' && (
                  <span className="text-[10.5px] font-semibold text-vermillion-700 bg-vermillion-50 px-2 py-1 rounded-full shrink-0">{station.specialCharacteristic}</span>
                )}
              </div>
              <p className="text-sm text-graphite mt-3">{station.operationDescription}</p>
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div><span className="text-graphite">WI</span><div className="font-medium text-indigo-800">{station.workInstructionRef} Rev {station.workInstructionRevision} ({station.workInstructionRevisionDate})</div></div>
                <div><span className="text-graphite">Standard cycle time</span><div className="font-medium text-indigo-800">{station.standardCycleTimeSec}s</div></div>
                <div><span className="text-graphite">Required level (unsupervised)</span><div className="font-medium text-indigo-800">Level {station.requiredLevelForUnsupervised}</div></div>
                <div><span className="text-graphite">Re-qualification interval</span><div className="font-medium text-indigo-800">{station.requalificationIntervalMonths} months</div></div>
              </div>
              <div className="mt-4 pt-3 border-t border-line">
                <div className="text-xs text-graphite mb-1.5">Certified operators per shift (min {station.minCertifiedPerShift} required)</div>
                <div className="flex gap-2">
                  {shifts.map(sh => {
                    const count = trainees.filter(t => t.targetStation === station.id && t.shift === sh && t.status === 'Certified').length;
                    const gap = count < station.minCertifiedPerShift;
                    return (
                      <span key={sh} className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${gap ? 'bg-vermillion-50 text-vermillion-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {gap && <AlertTriangle size={11} />} {sh}: {count}
                      </span>
                    );
                  })}
                  <span className="text-xs text-graphite self-center ml-1">· {certifiedTotal} total certified</span>
                </div>
              </div>
              <button onClick={() => nav.go('trainees', { status: 'All' })} className="mt-3 text-xs font-semibold text-cobalt hover:underline">
                View operators →
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

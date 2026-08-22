import { useMemo, useState } from 'react';
import { Search, Plus, Pencil, LogOut } from 'lucide-react';
import { Nav } from '../../DashboardApp';
import { STATIONS } from '../../data';
import { Card, PageHeader, StatusBadge } from '../ui';
import { latestCertificationFor } from '../../data';
import { useTrainees, addTrainee, updateTrainee, exitTrainee, traineeToFormFields, TraineeFormFields } from '../../lib/store';
import { useAuth, can } from '../../lib/auth';
import { TraineeForm } from '../TraineeForm';
import { ExitTraineeModal } from '../ExitTraineeModal';
import { Trainee } from '../../data/types';

export function TraineeRegister({ nav }: { nav: Nav }) {
  const trainees = useTrainees();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(nav.params?.status ?? 'All');
  const [stationFilter, setStationFilter] = useState('All');
  const [employmentFilter, setEmploymentFilter] = useState('All');

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Trainee | null>(null);
  const [exiting, setExiting] = useState<Trainee | null>(null);

  const statuses = useMemo(() => Array.from(new Set(trainees.map(t => t.status))), [trainees]);

  const filtered = trainees.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (stationFilter !== 'All' && t.targetStation !== stationFilter) return false;
    if (employmentFilter !== 'All' && t.employmentType !== employmentFilter) return false;
    if (query && !(`${t.name} ${t.id}`.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  const canManage = user ? can(user.role, 'enrol') : false;
  const actor = user ? { name: user.name, id: user.employeeId, role: user.role } : null;

  const submitCreate = (fields: TraineeFormFields) => {
    if (!actor) return;
    addTrainee(fields, actor);
    setCreating(false);
  };
  const submitEdit = (fields: TraineeFormFields) => {
    if (!actor || !editing) return;
    updateTrainee(editing.id, fields, actor);
    setEditing(null);
  };
  const confirmExit = (reason: string) => {
    if (!actor || !exiting) return;
    exitTrainee(exiting.id, reason, actor);
    setExiting(null);
  };

  return (
    <div>
      <PageHeader
        title="Trainee Register"
        subtitle={`${filtered.length} of ${trainees.length} trainees`}
        right={canManage ? (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-vermillion text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-vermillion-600 transition-colors"
          >
            <Plus size={15} /> Enrol trainee
          </button>
        ) : undefined}
      />

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name or employee ID…"
              className="w-full pl-9 pr-3 py-2 border border-line rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cobalt"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-line rounded-md px-3 py-2 text-sm">
            <option value="All">All statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={stationFilter} onChange={e => setStationFilter(e.target.value)} className="border border-line rounded-md px-3 py-2 text-sm">
            <option value="All">All stations</option>
            {STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={employmentFilter} onChange={e => setEmploymentFilter(e.target.value)} className="border border-line rounded-md px-3 py-2 text-sm">
            <option value="All">All employment types</option>
            {['Permanent', 'Contract', 'Apprentice', 'Trainee', 'Agency'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-cloud text-left">
              <th className="px-4 py-3 font-semibold text-graphite text-xs uppercase tracking-wide">Trainee</th>
              <th className="px-4 py-3 font-semibold text-graphite text-xs uppercase tracking-wide">Employment</th>
              <th className="px-4 py-3 font-semibold text-graphite text-xs uppercase tracking-wide">Station</th>
              <th className="px-4 py-3 font-semibold text-graphite text-xs uppercase tracking-wide">Shift</th>
              <th className="px-4 py-3 font-semibold text-graphite text-xs uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 font-semibold text-graphite text-xs uppercase tracking-wide">Level</th>
              <th className="px-4 py-3 font-semibold text-graphite text-xs uppercase tracking-wide">Last activity</th>
              {canManage && <th className="px-4 py-3 font-semibold text-graphite text-xs uppercase tracking-wide text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => {
              const station = STATIONS.find(s => s.id === t.targetStation);
              const cert = latestCertificationFor(t.id, t.targetStation);
              return (
                <tr
                  key={t.id}
                  className="border-b border-line last:border-0 hover:bg-cloud transition-colors"
                >
                  <td className="px-4 py-3 cursor-pointer" onClick={() => nav.go('trainee-detail', { id: t.id })}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-semibold text-[11px] flex items-center justify-center shrink-0">
                        {t.photoInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-indigo-800">{t.name}</div>
                        <div className="text-[11px] text-graphite font-mono">{t.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-graphite cursor-pointer" onClick={() => nav.go('trainee-detail', { id: t.id })}>{t.employmentType}{t.contractorName ? ` · ${t.contractorName}` : ''}</td>
                  <td className="px-4 py-3 text-graphite cursor-pointer" onClick={() => nav.go('trainee-detail', { id: t.id })}>{station?.name ?? 'Not recorded'}</td>
                  <td className="px-4 py-3 text-graphite cursor-pointer" onClick={() => nav.go('trainee-detail', { id: t.id })}>{t.shift}</td>
                  <td className="px-4 py-3 cursor-pointer" onClick={() => nav.go('trainee-detail', { id: t.id })}><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-graphite cursor-pointer" onClick={() => nav.go('trainee-detail', { id: t.id })}>{cert ? `L${cert.levelAwarded}` : '—'}</td>
                  <td className="px-4 py-3 text-graphite cursor-pointer" onClick={() => nav.go('trainee-detail', { id: t.id })}>{t.modifiedAt.slice(0, 10)}</td>
                  {canManage && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(t)} title="Edit" className="text-graphite hover:text-cobalt"><Pencil size={15} /></button>
                        {t.status !== 'Exited' && (
                          <button onClick={() => setExiting(t)} title="Exit trainee" className="text-graphite hover:text-vermillion"><LogOut size={15} /></button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={canManage ? 8 : 7} className="px-4 py-10 text-center text-graphite text-sm">No trainees match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {creating && (
        <TraineeForm title="Enrol trainee" onCancel={() => setCreating(false)} onSubmit={submitCreate} />
      )}
      {editing && (
        <TraineeForm title={`Edit — ${editing.name}`} initial={traineeToFormFields(editing)} onCancel={() => setEditing(null)} onSubmit={submitEdit} />
      )}
      {exiting && (
        <ExitTraineeModal traineeName={exiting.name} onCancel={() => setExiting(null)} onConfirm={confirmExit} />
      )}
    </div>
  );
}

import { useState } from 'react';
import { Printer } from 'lucide-react';
import { Nav } from '../../DashboardApp';
import { DATA } from '../../data';
import { Card, PageHeader } from '../ui';

export function AuditTrail({ nav }: { nav: Nav }) {
  const [actionFilter, setActionFilter] = useState('All');
  const actions = Array.from(new Set(DATA.auditLog.map(a => a.action)));
  const filtered = DATA.auditLog.filter(e => actionFilter === 'All' || e.action === actionFilter).slice().reverse().slice(0, 250);

  return (
    <div>
      <PageHeader
        title="Audit Trail"
        subtitle={`${DATA.auditLog.length} events logged — immutable, filterable, printable.`}
        right={
          <button
            onClick={() => nav.go('reports', { report: 'audit-trail' })}
            className="flex items-center gap-2 bg-vermillion text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-vermillion-600 transition-colors"
          >
            <Printer size={15} /> Print audit trail
          </button>
        }
      />

      <Card className="p-4 mb-4">
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="border border-line rounded-md px-3 py-2 text-sm">
          <option value="All">All actions</option>
          {actions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line bg-cloud text-left">
              <th className="px-3 py-2.5 font-semibold text-graphite">Timestamp</th>
              <th className="px-3 py-2.5 font-semibold text-graphite">User</th>
              <th className="px-3 py-2.5 font-semibold text-graphite">Role</th>
              <th className="px-3 py-2.5 font-semibold text-graphite">Action</th>
              <th className="px-3 py-2.5 font-semibold text-graphite">Record</th>
              <th className="px-3 py-2.5 font-semibold text-graphite">IP / Device</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="border-b border-line last:border-0">
                <td className="px-3 py-2 font-mono">{e.timestamp.replace('T', ' ').slice(0, 19)}</td>
                <td className="px-3 py-2">{e.userName}</td>
                <td className="px-3 py-2 text-graphite">{e.role.replace('_', ' ')}</td>
                <td className="px-3 py-2 font-medium">{e.action}</td>
                <td className="px-3 py-2 font-mono">{e.recordType} · {e.recordId}</td>
                <td className="px-3 py-2 text-graphite">{e.ip} · {e.device}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {DATA.auditLog.length > 250 && <div className="text-xs text-graphite mt-2">Showing the 250 most recent of {DATA.auditLog.length} events. Use Print for the full filtered set.</div>}
    </div>
  );
}

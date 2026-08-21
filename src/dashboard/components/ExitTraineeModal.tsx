import { useState } from 'react';

export function ExitTraineeModal({
  traineeName, onCancel, onConfirm,
}: { traineeName: string; onCancel: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const confirm = () => {
    if (!reason.trim()) { setError('A reason is required — records are never deleted, only superseded with a stated reason (Section 3).'); return; }
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-line">
          <h2 className="font-serif text-lg font-semibold text-indigo-800">Exit trainee</h2>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-sm text-graphite">
            This marks <span className="font-semibold text-indigo-800">{traineeName}</span> as <span className="font-medium">Exited</span>.
            No record is deleted — history, sessions and certifications remain fully intact and traceable (C-08).
          </p>
          <label className="block">
            <span className="block text-xs font-semibold text-graphite mb-1">Reason (required)</span>
            <textarea
              value={reason}
              onChange={e => { setReason(e.target.value); setError(''); }}
              rows={3}
              className="w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt"
              placeholder="e.g. Resigned, contract ended, transferred to another plant…"
            />
            {error && <div className="text-xs text-vermillion mt-1">{error}</div>}
          </label>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-line">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-graphite border border-line rounded-md hover:bg-cloud">Cancel</button>
          <button onClick={confirm} className="px-4 py-2 text-sm font-semibold text-white bg-vermillion rounded-md hover:bg-vermillion-600">Confirm exit</button>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { STATIONS } from '../data';
import { TraineeFormFields } from '../lib/store';
import { IMPORT_COLUMNS, ImportResult, parseTraineeCsv, traineeCsvTemplate } from '../lib/csvImport';

const MAX_PREVIEW = 8;

export function TraineeImportModal({
  onCancel, onImport,
}: {
  onCancel: () => void;
  onImport: (rows: TraineeFormFields[]) => void;
}) {
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [readError, setReadError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const readFile = async (file: File) => {
    setFileName(file.name);
    setReadError('');
    setResult(null);
    try {
      setResult(parseTraineeCsv(await file.text()));
    } catch {
      setReadError('That file could not be read. Save it as CSV (UTF-8) and try again.');
    }
  };

  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob([traineeCsvTemplate()], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trainee-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const valid = result?.rows.filter(r => r.fields) ?? [];
  const invalid = result?.rows.filter(r => !r.fields) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line sticky top-0 bg-white z-10">
          <h2 className="font-serif text-lg font-semibold text-indigo-800">Bulk import trainees (CSV)</h2>
          <button onClick={onCancel} className="text-graphite hover:text-indigo-800"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-graphite">
              Upload a CSV with one row per trainee. Every row is validated against the same required fields as the
              enrolment form — only valid rows are enrolled, and each one is written to the audit log.
            </p>
            <button
              onClick={downloadTemplate}
              className="shrink-0 flex items-center gap-2 text-sm font-semibold text-cobalt border border-line rounded-md px-3 py-2 hover:bg-cloud"
            >
              <Download size={15} /> Template
            </button>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) void readFile(file);
            }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg px-6 py-8 text-center cursor-pointer transition-colors ${dragging ? 'border-cobalt bg-cloud' : 'border-line hover:bg-cloud'}`}
          >
            <FileSpreadsheet size={26} className="mx-auto text-graphite mb-2" />
            <div className="text-sm font-semibold text-indigo-800">{fileName || 'Drop a CSV here, or click to choose a file'}</div>
            <div className="text-xs text-graphite mt-1">Comma-separated, UTF-8, first row is the header</div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) void readFile(file);
                e.target.value = '';
              }}
            />
          </div>

          {readError && (
            <div className="bg-vermillion-50 border border-vermillion-200 text-vermillion-700 text-xs rounded-md px-3 py-2">{readError}</div>
          )}

          {result && result.fileErrors.length > 0 && (
            <div className="bg-vermillion-50 border border-vermillion-200 text-vermillion-700 text-xs rounded-md px-3 py-2 space-y-1">
              {result.fileErrors.map(e => <div key={e}>{e}</div>)}
            </div>
          )}

          {result && result.fileErrors.length === 0 && (
            <>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 size={15} /> {valid.length} row{valid.length === 1 ? '' : 's'} ready to enrol
                </span>
                {invalid.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-vermillion-700 font-semibold">
                    <AlertTriangle size={15} /> {invalid.length} row{invalid.length === 1 ? '' : 's'} skipped
                  </span>
                )}
              </div>

              {result.unknownHeaders.length > 0 && (
                <div className="text-xs text-graphite">
                  Ignored unrecognised column(s): {result.unknownHeaders.join(', ')}
                </div>
              )}

              {invalid.length > 0 && (
                <div className="border border-vermillion-200 rounded-md overflow-hidden">
                  <div className="bg-vermillion-50 px-3 py-2 text-xs font-semibold text-vermillion-700">Rows that will be skipped</div>
                  <ul className="divide-y divide-line max-h-40 overflow-y-auto">
                    {invalid.map(r => (
                      <li key={r.line} className="px-3 py-2 text-xs text-graphite">
                        <span className="font-mono text-indigo-800">Line {r.line}</span> — {r.errors.join('; ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {valid.length > 0 && (
                <div className="border border-line rounded-md overflow-hidden">
                  <div className="bg-cloud px-3 py-2 text-xs font-semibold text-graphite">
                    Preview{valid.length > MAX_PREVIEW ? ` — first ${MAX_PREVIEW} of ${valid.length}` : ''}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-line text-left text-graphite">
                          <th className="px-3 py-2 font-semibold">Name</th>
                          <th className="px-3 py-2 font-semibold">Employment</th>
                          <th className="px-3 py-2 font-semibold">Department</th>
                          <th className="px-3 py-2 font-semibold">Shift</th>
                          <th className="px-3 py-2 font-semibold">Target station</th>
                        </tr>
                      </thead>
                      <tbody>
                        {valid.slice(0, MAX_PREVIEW).map(r => {
                          const f = r.fields as TraineeFormFields;
                          return (
                            <tr key={r.line} className="border-b border-line last:border-0">
                              <td className="px-3 py-2 font-semibold text-indigo-800">{f.name}</td>
                              <td className="px-3 py-2 text-graphite">{f.employmentType}{f.contractorName ? ` · ${f.contractorName}` : ''}</td>
                              <td className="px-3 py-2 text-graphite">{f.department}</td>
                              <td className="px-3 py-2 text-graphite">{f.shift}</td>
                              <td className="px-3 py-2 text-graphite">{STATIONS.find(s => s.id === f.targetStation)?.name ?? f.targetStation}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          <details className="text-xs text-graphite">
            <summary className="cursor-pointer font-semibold text-indigo-800">Expected columns</summary>
            <table className="w-full mt-2">
              <tbody>
                {IMPORT_COLUMNS.map(c => (
                  <tr key={c.header} className="border-b border-line last:border-0">
                    <td className="py-1.5 pr-3 font-mono text-indigo-800 whitespace-nowrap align-top">{c.header}</td>
                    <td className="py-1.5 pr-3 align-top">{c.required ? <span className="text-vermillion font-semibold">required</span> : 'optional'}</td>
                    <td className="py-1.5 align-top">{c.hint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          <div className="flex justify-end gap-3 pt-2 border-t border-line">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-graphite border border-line rounded-md hover:bg-cloud">
              Cancel
            </button>
            <button
              type="button"
              disabled={valid.length === 0}
              onClick={() => onImport(valid.map(r => r.fields as TraineeFormFields))}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-vermillion rounded-md hover:bg-vermillion-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Upload size={15} /> Enrol {valid.length || ''} trainee{valid.length === 1 ? '' : 's'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

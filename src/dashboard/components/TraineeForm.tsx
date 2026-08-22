import { useState } from 'react';
import { X } from 'lucide-react';
import { STATIONS } from '../data';
import { EmploymentType } from '../data/types';
import { TraineeFormFields } from '../lib/store';

const EMPTY: TraineeFormFields = {
  name: '',
  employmentType: 'Contract',
  contractorName: '',
  dob: '',
  gender: '',
  dateOfJoining: '',
  department: '',
  shift: 'A',
  supervisor: '',
  supervisorId: '',
  designation: '',
  priorExperienceYears: 0,
  priorExperienceOn: '',
  education: '',
  languages: ['hi'],
  targetStation: STATIONS[0].id,
  inductionDone: false,
  medicalDone: false,
};

const REQUIRED_LABELS: { key: keyof TraineeFormFields; label: string }[] = [
  { key: 'name', label: 'Full name' },
  { key: 'dob', label: 'Date of birth' },
  { key: 'dateOfJoining', label: 'Date of joining' },
  { key: 'department', label: 'Department' },
  { key: 'shift', label: 'Shift' },
  { key: 'supervisor', label: 'Reporting supervisor' },
  { key: 'supervisorId', label: 'Supervisor employee ID' },
  { key: 'designation', label: 'Designation' },
  { key: 'education', label: 'Education / qualification' },
  { key: 'targetStation', label: 'Target station' },
];

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-graphite mb-1">{label}{required && <span className="text-vermillion"> *</span>}</span>
      {children}
    </label>
  );
}

const inputCls = 'w-full border border-line rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt';

export function TraineeForm({
  title, initial, onCancel, onSubmit,
}: {
  title: string;
  initial?: TraineeFormFields;
  onCancel: () => void;
  onSubmit: (fields: TraineeFormFields) => void;
}) {
  const [fields, setFields] = useState<TraineeFormFields>(initial ?? EMPTY);
  const [errors, setErrors] = useState<string[]>([]);

  const set = <K extends keyof TraineeFormFields>(key: K, value: TraineeFormFields[K]) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = REQUIRED_LABELS.filter(r => !String(fields[r.key] ?? '').trim());
    if (missing.length > 0) {
      setErrors(missing.map(m => m.label));
      return;
    }
    setErrors([]);
    onSubmit(fields);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line sticky top-0 bg-white z-10">
          <h2 className="font-serif text-lg font-semibold text-indigo-800">{title}</h2>
          <button onClick={onCancel} className="text-graphite hover:text-indigo-800"><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          {errors.length > 0 && (
            <div className="bg-vermillion-50 border border-vermillion-200 text-vermillion-700 text-xs rounded-md px-3 py-2">
              Required: {errors.join(', ')}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full name" required>
              <input className={inputCls} value={fields.name} onChange={e => set('name', e.target.value)} placeholder="As per plant HR record" />
            </Field>
            <Field label="Employment type" required>
              <select className={inputCls} value={fields.employmentType} onChange={e => set('employmentType', e.target.value as EmploymentType)}>
                {(['Permanent', 'Contract', 'Apprentice', 'Trainee', 'Agency'] as EmploymentType[]).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
            {(fields.employmentType === 'Contract' || fields.employmentType === 'Agency') && (
              <Field label="Contractor / agency name" required>
                <input className={inputCls} value={fields.contractorName ?? ''} onChange={e => set('contractorName', e.target.value)} />
              </Field>
            )}
            <Field label="Date of birth" required>
              <input type="date" className={inputCls} value={fields.dob} onChange={e => set('dob', e.target.value)} />
            </Field>
            <Field label="Gender">
              <input className={inputCls} value={fields.gender ?? ''} onChange={e => set('gender', e.target.value)} />
            </Field>
            <Field label="Date of joining" required>
              <input type="date" className={inputCls} value={fields.dateOfJoining} onChange={e => set('dateOfJoining', e.target.value)} />
            </Field>
            <Field label="Department" required>
              <input className={inputCls} value={fields.department} onChange={e => set('department', e.target.value)} />
            </Field>
            <Field label="Shift" required>
              <select className={inputCls} value={fields.shift} onChange={e => set('shift', e.target.value as TraineeFormFields['shift'])}>
                {['A', 'B', 'C', 'General'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
            <Field label="Designation" required>
              <input className={inputCls} value={fields.designation} onChange={e => set('designation', e.target.value)} />
            </Field>
            <Field label="Reporting supervisor" required>
              <input className={inputCls} value={fields.supervisor} onChange={e => set('supervisor', e.target.value)} />
            </Field>
            <Field label="Supervisor employee ID" required>
              <input className={inputCls} value={fields.supervisorId} onChange={e => set('supervisorId', e.target.value)} />
            </Field>
            <Field label="Prior experience (years)">
              <input type="number" min={0} className={inputCls} value={fields.priorExperienceYears} onChange={e => set('priorExperienceYears', Number(e.target.value))} />
            </Field>
            <Field label="Prior experience on">
              <input className={inputCls} value={fields.priorExperienceOn ?? ''} onChange={e => set('priorExperienceOn', e.target.value)} />
            </Field>
            <Field label="Education / qualification" required>
              <input className={inputCls} value={fields.education} onChange={e => set('education', e.target.value)} />
            </Field>
            <Field label="Languages (comma-separated)">
              <input className={inputCls} value={fields.languages.join(', ')} onChange={e => set('languages', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
            </Field>
            <Field label="Target station" required>
              <select className={inputCls} value={fields.targetStation} onChange={e => set('targetStation', e.target.value)}>
                {STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
          </div>

          <div className="flex gap-6 pt-2 border-t border-line">
            <label className="flex items-center gap-2 text-sm text-graphite pt-3">
              <input type="checkbox" checked={fields.inductionDone} onChange={e => set('inductionDone', e.target.checked)} />
              Safety induction complete (gates VR enrolment — G-01)
            </label>
            <label className="flex items-center gap-2 text-sm text-graphite pt-3">
              <input type="checkbox" checked={fields.medicalDone} onChange={e => set('medicalDone', e.target.checked)} />
              Medical fitness confirmed (G-02)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-graphite border border-line rounded-md hover:bg-cloud">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-vermillion rounded-md hover:bg-vermillion-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

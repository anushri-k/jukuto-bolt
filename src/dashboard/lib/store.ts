import { useSyncExternalStore } from 'react';
import { DATA } from '../data/generator';
import { TODAY } from '../data/config';
import { Trainee, AuditLogEntry, Role, EmploymentType } from '../data/types';

// A minimal external store so trainee CRUD (Section 4 / 4-role table: Plant
// Admin can enrol trainees) is reflected everywhere the dataset is read,
// without re-plumbing every screen through React context. Session records,
// assessments and certifications stay on the generated (deterministic)
// dataset — per Section 3, evidence is never hand-edited, only trainee
// profile fields (and the exit/status lifecycle) are mutable here. Those two
// mutable pieces — trainees and the audit log — are the ones persisted to
// src/dashboard/data/db.json via the dev-server /api/db endpoint (see
// vite.config.ts), so edits survive a reload instead of resetting.

type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach(l => l()); }
function subscribe(l: Listener) { listeners.add(l); return () => listeners.delete(l); }

let trainees: Trainee[] = [...DATA.trainees];
let auditLog: AuditLogEntry[] = [...DATA.auditLog];
let auditSeq = auditLog.length + 1;

export function getTrainees(): Trainee[] { return trainees; }
export function getAuditLog(): AuditLogEntry[] { return auditLog; }

export function useTrainees(): Trainee[] {
  return useSyncExternalStore(subscribe, getTrainees);
}
export function useAuditLog(): AuditLogEntry[] {
  return useSyncExternalStore(subscribe, getAuditLog);
}

// --- Persistence to db.json (dev server only — see vite.config.ts) ---

let persistEnabled = true;

async function saveToServer() {
  if (!persistEnabled) return;
  try {
    await fetch('/api/db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trainees,
        sessions: DATA.sessions,
        assessments: DATA.assessments,
        certifications: DATA.certifications,
        auditLog,
      }),
    });
  } catch {
    // No dev server (e.g. production build/preview) — edits stay in-memory
    // for this session only. Not an error the user needs to see.
    persistEnabled = false;
  }
}

/** Loads any previously-saved trainees/audit log from db.json. Call once on app start. */
export async function initStore(): Promise<void> {
  try {
    const res = await fetch('/api/db');
    if (!res.ok) return;
    const saved = await res.json();
    if (Array.isArray(saved.trainees) && saved.trainees.length > 0) {
      trainees = saved.trainees;
    }
    if (Array.isArray(saved.auditLog)) {
      auditLog = saved.auditLog;
      auditSeq = auditLog.length + 1;
    }
    emit();
  } catch {
    // No dev server available — fall back to the freshly generated dataset.
    persistEnabled = false;
  }
}

export interface AuditActor { name: string; id: string; role: Role }

export function logAudit(actor: AuditActor, action: AuditLogEntry['action'], recordType: string, recordId: string) {
  const entry: AuditLogEntry = {
    id: `AUD-NEW-${auditSeq++}`,
    timestamp: new Date().toISOString(),
    userId: actor.id,
    userName: actor.name,
    role: actor.role,
    action,
    recordType,
    recordId,
    ip: '10.20.4.201',
    device: 'Plant workstation (session)',
  };
  auditLog = [...auditLog, entry];
  emit();
}

const dayMs = 86400000;
const addDays = (iso: string, days: number) => new Date(new Date(iso + 'T00:00:00Z').getTime() + days * dayMs).toISOString().slice(0, 10);

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function nextTraineeId(): string {
  let max = 2000;
  trainees.forEach(t => {
    const m = /EMP-(\d+)/.exec(t.id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return `EMP-${max + 1}`;
}

export interface TraineeFormFields {
  name: string;
  employmentType: EmploymentType;
  contractorName?: string;
  dob: string;
  gender?: string;
  dateOfJoining: string;
  department: string;
  shift: 'A' | 'B' | 'C' | 'General';
  supervisor: string;
  supervisorId: string;
  designation: string;
  priorExperienceYears: number;
  priorExperienceOn?: string;
  education: string;
  languages: string[];
  targetStation: string;
  inductionDone: boolean;
  medicalDone: boolean;
}

export function addTrainee(fields: TraineeFormFields, actor: AuditActor): Trainee {
  const id = nextTraineeId();
  const now = new Date().toISOString();
  const trainee: Trainee = {
    id,
    name: fields.name,
    photoInitials: initials(fields.name),
    dob: fields.dob,
    gender: fields.gender,
    employmentType: fields.employmentType,
    contractorName: fields.employmentType === 'Contract' || fields.employmentType === 'Agency' ? fields.contractorName : undefined,
    dateOfJoining: fields.dateOfJoining,
    department: fields.department,
    shift: fields.shift,
    supervisor: fields.supervisor,
    supervisorId: fields.supervisorId,
    designation: fields.designation,
    priorExperienceYears: fields.priorExperienceYears,
    priorExperienceOn: fields.priorExperienceOn,
    education: fields.education,
    languages: fields.languages,
    inductionStatus: fields.inductionDone ? { done: true, date: TODAY, validUntil: addDays(TODAY, 730) } : { done: false },
    medicalFitness: fields.medicalDone ? { done: true, date: TODAY, validUntil: addDays(TODAY, 365) } : { done: false },
    assignedStations: [fields.targetStation],
    targetStation: fields.targetStation,
    status: 'Enrolled',
    enrolmentDate: TODAY,
    targetCertificationDate: addDays(TODAY, 60),
    createdBy: actor.name,
    createdAt: now,
    modifiedBy: actor.name,
    modifiedAt: now,
  };
  trainees = [...trainees, trainee];
  logAudit(actor, 'Edit', 'Trainee', id);
  emit();
  void saveToServer();
  return trainee;
}

export function updateTrainee(id: string, fields: TraineeFormFields, actor: AuditActor) {
  const now = new Date().toISOString();
  trainees = trainees.map(t => {
    if (t.id !== id) return t;
    return {
      ...t,
      name: fields.name,
      photoInitials: initials(fields.name),
      dob: fields.dob,
      gender: fields.gender,
      employmentType: fields.employmentType,
      contractorName: fields.employmentType === 'Contract' || fields.employmentType === 'Agency' ? fields.contractorName : undefined,
      dateOfJoining: fields.dateOfJoining,
      department: fields.department,
      shift: fields.shift,
      supervisor: fields.supervisor,
      supervisorId: fields.supervisorId,
      designation: fields.designation,
      priorExperienceYears: fields.priorExperienceYears,
      priorExperienceOn: fields.priorExperienceOn,
      education: fields.education,
      languages: fields.languages,
      inductionStatus: fields.inductionDone
        ? (t.inductionStatus.done ? t.inductionStatus : { done: true, date: TODAY, validUntil: addDays(TODAY, 730) })
        : { done: false },
      medicalFitness: fields.medicalDone
        ? (t.medicalFitness.done ? t.medicalFitness : { done: true, date: TODAY, validUntil: addDays(TODAY, 365) })
        : { done: false },
      assignedStations: Array.from(new Set([...t.assignedStations, fields.targetStation])),
      targetStation: fields.targetStation,
      modifiedBy: actor.name,
      modifiedAt: now,
    };
  });
  logAudit(actor, 'Edit', 'Trainee', id);
  emit();
  void saveToServer();
}

export function exitTrainee(id: string, reason: string, actor: AuditActor) {
  const now = new Date().toISOString();
  trainees = trainees.map(t => t.id === id
    ? { ...t, status: 'Exited', modifiedBy: `${actor.name} — ${reason}`, modifiedAt: now }
    : t);
  logAudit(actor, 'Edit', 'Trainee', id);
  emit();
  void saveToServer();
}

export function traineeToFormFields(t: Trainee): TraineeFormFields {
  return {
    name: t.name,
    employmentType: t.employmentType,
    contractorName: t.contractorName,
    dob: t.dob,
    gender: t.gender,
    dateOfJoining: t.dateOfJoining,
    department: t.department,
    shift: t.shift,
    supervisor: t.supervisor,
    supervisorId: t.supervisorId,
    designation: t.designation,
    priorExperienceYears: t.priorExperienceYears,
    priorExperienceOn: t.priorExperienceOn,
    education: t.education,
    languages: t.languages,
    targetStation: t.targetStation,
    inductionDone: t.inductionStatus.done,
    medicalDone: t.medicalFitness.done,
  };
}

import { STATIONS } from '../data';
import { EmploymentType } from '../data/types';
import { TraineeFormFields } from './store';

// CSV bulk enrolment for the Trainee Register. Parsing is intentionally
// self-contained (RFC 4180 quoting, CRLF/LF, BOM) so the dashboard stays
// dependency-free; every row is validated against the same required fields the
// enrolment form enforces before anything is written to the store.

export interface ImportColumn {
  key: keyof TraineeFormFields;
  header: string;
  required: boolean;
  hint: string;
  example: string;
}

export const IMPORT_COLUMNS: ImportColumn[] = [
  { key: 'name', header: 'name', required: true, hint: 'Full name as per plant HR record', example: 'Ramesh Patil' },
  { key: 'employmentType', header: 'employment_type', required: true, hint: 'Permanent | Contract | Apprentice | Trainee | Agency', example: 'Contract' },
  { key: 'contractorName', header: 'contractor_name', required: false, hint: 'Required when employment type is Contract or Agency', example: 'Shakti Manpower' },
  { key: 'dob', header: 'dob', required: true, hint: 'Date of birth, YYYY-MM-DD', example: '1998-04-12' },
  { key: 'gender', header: 'gender', required: false, hint: 'Free text', example: 'M' },
  { key: 'dateOfJoining', header: 'date_of_joining', required: true, hint: 'YYYY-MM-DD', example: '2025-11-01' },
  { key: 'department', header: 'department', required: true, hint: 'Plant department', example: 'Body Shop' },
  { key: 'shift', header: 'shift', required: true, hint: 'A | B | C | General', example: 'A' },
  { key: 'designation', header: 'designation', required: true, hint: 'Role title', example: 'Line Operator' },
  { key: 'supervisor', header: 'supervisor', required: true, hint: 'Reporting supervisor name', example: 'S. Kulkarni' },
  { key: 'supervisorId', header: 'supervisor_id', required: true, hint: 'Supervisor employee ID', example: 'EMP-1042' },
  { key: 'priorExperienceYears', header: 'prior_experience_years', required: false, hint: 'Whole number, defaults to 0', example: '2' },
  { key: 'priorExperienceOn', header: 'prior_experience_on', required: false, hint: 'What the experience was on', example: 'Spot welding' },
  { key: 'education', header: 'education', required: true, hint: 'Highest qualification', example: 'ITI — Fitter' },
  { key: 'languages', header: 'languages', required: false, hint: 'Separated by ; or | — defaults to hi', example: 'hi;mr' },
  { key: 'targetStation', header: 'target_station', required: true, hint: `Station ID or name (e.g. ${STATIONS[0].id} or ${STATIONS[0].name})`, example: STATIONS[0].id },
  { key: 'inductionDone', header: 'induction_done', required: false, hint: 'yes/no — safety induction complete (G-01)', example: 'yes' },
  { key: 'medicalDone', header: 'medical_done', required: false, hint: 'yes/no — medical fitness confirmed (G-02)', example: 'yes' },
];

const EMPLOYMENT_TYPES: EmploymentType[] = ['Permanent', 'Contract', 'Apprentice', 'Trainee', 'Agency'];
const SHIFTS: TraineeFormFields['shift'][] = ['A', 'B', 'C', 'General'];

/** Parses CSV text into a matrix of raw cell strings. Handles quoted fields, embedded commas/newlines and escaped quotes. */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') { inQuotes = true; continue; }
    if (ch === ',') { row.push(cell); cell = ''; continue; }
    if (ch === '\r') continue;
    if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; continue; }
    cell += ch;
  }
  row.push(cell);
  rows.push(row);

  return rows.filter(r => r.some(c => c.trim() !== ''));
}

const normaliseHeader = (h: string) => h.trim().toLowerCase().replace(/[\s-]+/g, '_');

function parseBool(raw: string): boolean | null {
  const v = raw.trim().toLowerCase();
  if (v === '') return false;
  if (['yes', 'y', 'true', '1', 'done'].includes(v)) return true;
  if (['no', 'n', 'false', '0', ''].includes(v)) return false;
  return null;
}

const isIsoDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

export interface ParsedRow {
  /** 1-based line number in the source file, header included — used in error messages. */
  line: number;
  fields: TraineeFormFields | null;
  errors: string[];
}

export interface ImportResult {
  rows: ParsedRow[];
  /** Fatal problems with the file itself (no header, unknown/missing columns). */
  fileErrors: string[];
  missingHeaders: string[];
  unknownHeaders: string[];
}

/** Validates CSV text against IMPORT_COLUMNS and returns one ParsedRow per data row. */
export function parseTraineeCsv(text: string): ImportResult {
  const matrix = parseCsv(text);
  if (matrix.length === 0) {
    return { rows: [], fileErrors: ['The file is empty.'], missingHeaders: [], unknownHeaders: [] };
  }

  const headers = matrix[0].map(normaliseHeader);
  const index = new Map<string, number>();
  headers.forEach((h, i) => { if (h && !index.has(h)) index.set(h, i); });

  const missingHeaders = IMPORT_COLUMNS.filter(c => c.required && !index.has(c.header)).map(c => c.header);
  const known = new Set(IMPORT_COLUMNS.map(c => c.header));
  const unknownHeaders = headers.filter(h => h && !known.has(h));

  const fileErrors: string[] = [];
  if (missingHeaders.length > 0) fileErrors.push(`Missing required column(s): ${missingHeaders.join(', ')}.`);
  if (matrix.length === 1) fileErrors.push('The file has a header row but no trainee rows.');
  if (fileErrors.length > 0) return { rows: [], fileErrors, missingHeaders, unknownHeaders };

  const cellAt = (r: string[], header: string) => {
    const i = index.get(header);
    return i === undefined ? '' : (r[i] ?? '').trim();
  };

  const rows: ParsedRow[] = matrix.slice(1).map((raw, n) => {
    const line = n + 2;
    const errors: string[] = [];
    const get = (header: string) => cellAt(raw, header);

    IMPORT_COLUMNS.filter(c => c.required).forEach(c => {
      if (!get(c.header)) errors.push(`${c.header} is required`);
    });

    const employmentTypeRaw = get('employment_type');
    const employmentType = EMPLOYMENT_TYPES.find(t => t.toLowerCase() === employmentTypeRaw.toLowerCase());
    if (employmentTypeRaw && !employmentType) errors.push(`employment_type "${employmentTypeRaw}" is not one of ${EMPLOYMENT_TYPES.join(', ')}`);

    const contractorName = get('contractor_name');
    if ((employmentType === 'Contract' || employmentType === 'Agency') && !contractorName) {
      errors.push('contractor_name is required for Contract/Agency employment');
    }

    const shiftRaw = get('shift');
    const shift = SHIFTS.find(s => s.toLowerCase() === shiftRaw.toLowerCase());
    if (shiftRaw && !shift) errors.push(`shift "${shiftRaw}" is not one of ${SHIFTS.join(', ')}`);

    const stationRaw = get('target_station');
    const station = STATIONS.find(s => s.id.toLowerCase() === stationRaw.toLowerCase() || s.name.toLowerCase() === stationRaw.toLowerCase());
    if (stationRaw && !station) errors.push(`target_station "${stationRaw}" is not a known station`);

    const dob = get('dob');
    if (dob && !isIsoDate(dob)) errors.push(`dob "${dob}" is not a valid YYYY-MM-DD date`);
    const dateOfJoining = get('date_of_joining');
    if (dateOfJoining && !isIsoDate(dateOfJoining)) errors.push(`date_of_joining "${dateOfJoining}" is not a valid YYYY-MM-DD date`);

    const expRaw = get('prior_experience_years');
    const priorExperienceYears = expRaw === '' ? 0 : Number(expRaw);
    if (!Number.isFinite(priorExperienceYears) || priorExperienceYears < 0) {
      errors.push(`prior_experience_years "${expRaw}" is not a non-negative number`);
    }

    const inductionDone = parseBool(get('induction_done'));
    if (inductionDone === null) errors.push(`induction_done "${get('induction_done')}" is not yes/no`);
    const medicalDone = parseBool(get('medical_done'));
    if (medicalDone === null) errors.push(`medical_done "${get('medical_done')}" is not yes/no`);

    const languages = get('languages').split(/[;|]/).map(s => s.trim()).filter(Boolean);

    if (errors.length > 0) return { line, fields: null, errors };

    return {
      line,
      errors,
      fields: {
        name: get('name'),
        employmentType: employmentType as EmploymentType,
        contractorName: contractorName || undefined,
        dob,
        gender: get('gender') || undefined,
        dateOfJoining,
        department: get('department'),
        shift: shift as TraineeFormFields['shift'],
        supervisor: get('supervisor'),
        supervisorId: get('supervisor_id'),
        designation: get('designation'),
        priorExperienceYears,
        priorExperienceOn: get('prior_experience_on') || undefined,
        education: get('education'),
        languages: languages.length > 0 ? languages : ['hi'],
        targetStation: (station as typeof STATIONS[number]).id,
        inductionDone: inductionDone as boolean,
        medicalDone: medicalDone as boolean,
      },
    };
  });

  return { rows, fileErrors: [], missingHeaders, unknownHeaders };
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** Header row plus one worked example, for the "Download template" link. */
export function traineeCsvTemplate(): string {
  const header = IMPORT_COLUMNS.map(c => c.header).join(',');
  const example = IMPORT_COLUMNS.map(c => csvCell(c.example)).join(',');
  return `${header}\n${example}\n`;
}

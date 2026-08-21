// Editable configuration — nothing in this file should ever be hardcoded into
// page text. Section 3 / Section 8 of the spec: clause references, retention
// periods, thresholds and scoring weights all live here.

export const TODAY = '2026-08-21';

export const PLANT = {
  name: 'Anveshan Auto Components Ltd.',
  plantCode: 'AAC-P2',
  location: 'Plant 2, Manesar, Haryana, India',
  customer: 'Multiple OEM / Tier-1 programmes',
  timezone: 'Asia/Kolkata (IST, UTC+5:30)',
};

export const PILOT_STATION_ID = 'ST-03';

export const RETENTION = {
  periodLabel: '3 years + current calendar year',
  policyRef: 'JKT/QP/07 Control of Records',
};

export const SCORING_WEIGHTS = {
  knowledge: 0.10,
  practical: 0.35,
  sequence: 0.15,
  cycleTime: 0.15,
  quality: 0.25,
};

export const THRESHOLDS = {
  passOverallPct: 80,
  marginalOverallPct: 70,
  cycleTimeCeilingPctOfStandard: 130, // above this, level capped at 2 (G-06)
  sessionMinDurationSec: 60,
  sessionMaxDurationSec: 5400,
  maxAttemptsBeforeEscalation: 4,
  requalAbsenceDays: 90,
  certExpiringWindowDays: 30,
  idleLockoutMinutes: 15,
  passwordExpiryDays: 90,
  loginLockoutAttempts: 5,
};

export const DOCUMENT_CONTROL = {
  formatNumbers: {
    competenceRecord: 'JKT/QF/TRN/01',
    progressReport: 'JKT/QF/TRN/02',
    assessmentDetail: 'JKT/QF/TRN/03',
    skillMatrix: 'JKT/QF/TRN/04',
    stationCoverage: 'JKT/QF/TRN/05',
    trainingNeeds: 'JKT/QF/TRN/06',
    requalDue: 'JKT/QF/TRN/07',
    effectiveness: 'JKT/QF/TRN/08',
    auditTrail: 'JKT/QF/TRN/09',
    auditPack: 'JKT/QF/TRN/00',
  },
  revision: 'B',
  revisionDate: '2026-06-01',
  issueDate: '2026-01-15',
  confidentiality: 'Confidential — Internal / Customer Audit Use Only',
  preparedBy: 'Training Coordinator, Plant 2',
  reviewedBy: 'Quality Head, Plant 2',
  approvedBy: 'Plant Head, Manesar',
};

export const STANDARD_EDITION = 'IATF 16949:2016';

export const CLAUSE_MAP: { clause: string; requirement: string; answeredBy: string }[] = [
  { clause: '7.1.6', requirement: 'Organisational knowledge', answeredBy: 'Module library and work-instruction revision linkage (Station / Operation Master)' },
  { clause: '7.2', requirement: 'Competence — determine, ensure, evaluate effectiveness, retain evidence', answeredBy: 'Whole system — Trainee Detail, Assessment Detail, Certification record' },
  { clause: '7.2.1', requirement: 'Documented process for identifying training needs, including awareness', answeredBy: 'Station Master required-competence table; Training Needs / Gap Report' },
  { clause: '7.2.2', requirement: 'On-the-job training', answeredBy: 'Session records, trainer observation, assessor sign-off' },
  { clause: '7.3', requirement: 'Awareness', answeredBy: 'Individual Competence Record — awareness attestation block' },
  { clause: '7.3.1', requirement: 'Awareness (supplemental) — contribution to product quality/safety, consequence of nonconformity', answeredBy: 'Awareness attestation block on the certificate (checks A-09)' },
  { clause: '7.3.2', requirement: 'Employee motivation and empowerment', answeredBy: 'Trainee progress visibility, self-assessment' },
  { clause: '7.5.3', requirement: 'Control of documented information', answeredBy: 'Document-control block on every printed page' },
  { clause: '7.5.3.2.1', requirement: 'Record retention', answeredBy: 'Retention and disposal fields; Audit Trail Report' },
  { clause: '8.3.3.3 / 8.5.1.1', requirement: 'Special characteristics, control plan', answeredBy: 'Station Master special-characteristic flag; stricter certification gates' },
  { clause: '8.5.1', requirement: 'Control of production', answeredBy: 'Skill Matrix, per-shift coverage report' },
  { clause: '9.2', requirement: 'Internal audit', answeredBy: 'Audit Trail viewer, Audit-Readiness panel' },
  { clause: '10.2', requirement: 'Corrective action', answeredBy: 'Re-qualification triggers R-05 (quality incident), R-09 (audit finding)' },
];

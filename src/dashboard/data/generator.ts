import { TRAINEE_SEEDS, TraineeSeed, Recipe } from './traineeSeeds';
import { STATIONS, MODULES } from './stations';
import { PILOT_STATION_ID, SCORING_WEIGHTS, THRESHOLDS, TODAY } from './config';
import {
  Trainee, Station, TrainingModule, Session, StepRecord, Assessment,
  Certification, AuditLogEntry, TraineeStatus, Role,
} from './types';

// Deterministic seeded RNG so the dataset is stable across reloads/print.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

const dayMs = 86400000;
// Calendar-date arithmetic anchored to UTC midnight — avoids the off-by-one
// that comes from parsing at IST midnight and reading the date back in UTC.
const d = (iso: string) => new Date(iso + 'T00:00:00Z');
const addDays = (iso: string, days: number) => new Date(d(iso).getTime() + days * dayMs).toISOString().slice(0, 10);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function stationOf(id: string): Station { return STATIONS.find(s => s.id === id)!; }
function moduleOf(id: string): TrainingModule { return MODULES.find(m => m.id === id)!; }
function currentModuleFor(stationId: string): TrainingModule {
  const mods = MODULES.filter(m => m.linkedStationId === stationId);
  return mods[mods.length - 1];
}

let sessionSeq = 1, assessmentSeq = 1, certSeq = 1, auditSeq = 1;
const pad = (n: number, w: number) => String(n).padStart(w, '0');

interface AttemptSpec {
  type: Session['sessionType'];
  quality: number; // 0..1, higher = fewer errors, closer to target time
  forceSafetyViolation?: boolean;
  forceCriticalFail?: boolean;
  date: string;
}

function buildSession(
  trainee: TraineeSeed, mod: TrainingModule, station: Station, spec: AttemptSpec, rng: () => number,
): Session {
  const steps: StepRecord[] = mod.steps.map((step) => {
    const errRoll = rng();
    const errorChance = clamp(0.35 - spec.quality * 0.32, 0.02, 0.4);
    let correct = errRoll > errorChance;
    let errorType: StepRecord['errorType'] | undefined;
    if (spec.forceCriticalFail && step.critical && !correct === false) {
      // ensure at least one critical step fails when forced
    }
    if (!correct) {
      const pool: StepRecord['errorType'][] = step.critical
        ? ['Torque', 'Orientation', 'Sequence', 'Quality-check skipped']
        : ['Sequence', 'Omission', 'Tooling', 'Gauge'];
      errorType = pool[Math.floor(rng() * pool.length)];
    }
    const timeNoise = (rng() - 0.5) * 2 * step.toleranceSec * (1.6 - spec.quality);
    const timeTakenSec = Math.max(3, Math.round(step.targetTimeSec + timeNoise + (1 - spec.quality) * step.toleranceSec * 1.2));
    const retryCount = !correct && rng() > 0.5 ? 1 + Math.floor(rng() * 2) : 0;
    const hintUsed = spec.quality < 0.55 && rng() > 0.7;
    return {
      stepId: step.id,
      sequenceOk: !(errorType === 'Sequence'),
      timeTakenSec,
      correct,
      errorType,
      retryCount,
      hintUsed,
      helpRequested: hintUsed && rng() > 0.6,
    };
  });

  if (spec.forceCriticalFail) {
    const criticalSteps = steps.filter((_s, i) => mod.steps[i].critical);
    if (criticalSteps.every(s => s.correct)) {
      const idx = steps.findIndex((_s, i) => mod.steps[i].critical);
      steps[idx].correct = false;
      steps[idx].errorType = 'Torque';
    }
  }

  const errorCountByCategory: Record<string, number> = {};
  steps.forEach(s => { if (s.errorType) errorCountByCategory[s.errorType] = (errorCountByCategory[s.errorType] || 0) + 1; });
  const criticalStepIds = new Set(mod.steps.filter(s => s.critical).map(s => s.id));
  const criticalErrorCount = steps.filter(s => criticalStepIds.has(s.stepId) && !s.correct).length;
  const safetyViolations = spec.forceSafetyViolation ? 1 : (spec.quality < 0.3 && rng() > 0.85 ? 1 : 0);
  const sequenceOkCount = steps.filter(s => s.sequenceOk).length;
  const cycleTimeAchievedSec = steps.reduce((sum, s) => sum + s.timeTakenSec, 0);
  const idleTimeSec = Math.round((1 - spec.quality) * 25 * rng());
  const durationSec = cycleTimeAchievedSec + idleTimeSec + 20;

  const startHour = 9 + Math.floor(rng() * 7);
  const startMin = Math.floor(rng() * 60);
  const start = new Date(d(spec.date).getTime());
  start.setHours(startHour, startMin, 0, 0);
  const end = new Date(start.getTime() + durationSec * 1000);

  const id = `SES-${pad(sessionSeq++, 5)}`;
  return {
    id,
    traineeId: trainee.id,
    moduleId: mod.id,
    moduleVersion: mod.version,
    stationId: station.id,
    sessionType: spec.type,
    date: spec.date,
    startTime: start.toTimeString().slice(0, 5),
    endTime: end.toTimeString().slice(0, 5),
    durationSec,
    headsetId: `JKT-HS-${pad(1 + (seedFromId(trainee.id) % 6), 2)}`,
    buildVersion: mod.version === 'v2.0' ? '2026.08.1' : '2026.03.2',
    location: `${station.line} Training Bay`,
    trainerPresent: spec.type !== 'Practice' ? { name: 'S. Nair', id: 'EMP-1090' } : null,
    completionStatus: 'Completed',
    steps,
    sequenceAdherencePct: Math.round((sequenceOkCount / steps.length) * 1000) / 10,
    cycleTimeAchievedSec,
    errorCountByCategory,
    criticalErrorCount,
    safetyViolations,
    retries: steps.reduce((s, st) => s + st.retryCount, 0),
    hintsUsed: steps.filter(s => s.hintUsed).length,
    idleTimeSec,
    telemetryFileRef: `telemetry/${id}.json`,
    telemetryChecksum: `sha256:${id.toLowerCase()}${seedFromId(id + trainee.id).toString(16).padStart(8, '0')}`,
  };
}

function scoreAssessment(session: Session, mod: TrainingModule): {
  practicalScorePct: number; sequenceAdherenceScorePct: number; cycleTimeScorePct: number; qualityScorePct: number;
} {
  const totalSteps = session.steps.length;
  const correctSteps = session.steps.filter(s => s.correct).length;
  const practicalScorePct = Math.round((correctSteps / totalSteps) * 1000) / 10;
  const sequenceAdherenceScorePct = session.sequenceAdherencePct;
  const standard = mod.steps.reduce((s, st) => s + st.targetTimeSec, 0);
  const pctOfStandard = (session.cycleTimeAchievedSec / standard) * 100;
  const cycleTimeScorePct = clamp(Math.round((200 - pctOfStandard) * 10) / 10, 0, 100);
  const defectErrors = Object.entries(session.errorCountByCategory)
    .filter(([k]) => k !== 'Sequence')
    .reduce((s, [, v]) => s + v, 0);
  const qualityScorePct = clamp(100 - defectErrors * 18, 0, 100);
  return { practicalScorePct, sequenceAdherenceScorePct, cycleTimeScorePct, qualityScorePct };
}

function buildAssessment(
  trainee: TraineeSeed, mod: TrainingModule, station: Station, session: Session, attemptNumber: number,
  overrideResult?: 'Pass' | 'Marginal' | 'Fail',
): Assessment {
  const s = scoreAssessment(session, mod);
  const knowledgeScorePct = 70 + Math.round((seedFromId(session.id) % 26));
  const w = SCORING_WEIGHTS;
  const weightedOverallPct = Math.round(
    (knowledgeScorePct * w.knowledge + s.practicalScorePct * w.practical + s.sequenceAdherenceScorePct * w.sequence +
      s.cycleTimeScorePct * w.cycleTime + s.qualityScorePct * w.quality) * 10,
  ) / 10;
  const safetyPass = session.safetyViolations === 0;
  const criticalStepIds = new Set(mod.steps.filter(st => st.critical).map(st => st.id));
  const criticalStepResult: 'Pass' | 'Fail' = session.steps.some(st => criticalStepIds.has(st.stepId) && !st.correct) ? 'Fail' : 'Pass';

  let result: 'Pass' | 'Marginal' | 'Fail';
  if (overrideResult) result = overrideResult;
  else if (!safetyPass || criticalStepResult === 'Fail') result = 'Fail';
  else if (weightedOverallPct >= THRESHOLDS.passOverallPct) result = 'Pass';
  else if (weightedOverallPct >= THRESHOLDS.marginalOverallPct) result = 'Marginal';
  else result = 'Fail';

  const checklist = [
    { item: 'PPE worn correctly for full duration', result: 'Yes' as const },
    { item: 'Correct tool selected for operation', result: 'Yes' as const },
    { item: `Station-specific hazard controls observed (${station.hazardClassification})`, result: (safetyPass ? 'Yes' : 'No') as 'Yes' | 'No' },
    { item: 'Operator can state torque / quality spec from memory', result: (result === 'Fail' ? 'No' : 'Yes') as 'Yes' | 'No' },
    { item: 'Housekeeping / 5S at station on completion', result: 'Yes' as const },
  ];

  return {
    id: `AST-${pad(assessmentSeq++, 5)}`,
    traineeId: trainee.id,
    stationId: station.id,
    attemptNumber,
    date: session.date,
    assessorName: 'S. Nair',
    assessorId: 'EMP-1090',
    sessionId: session.id,
    knowledgeScorePct,
    practicalScorePct: s.practicalScorePct,
    sequenceAdherenceScorePct: s.sequenceAdherenceScorePct,
    cycleTimeScorePct: s.cycleTimeScorePct,
    qualityScorePct: s.qualityScorePct,
    safetyPass,
    weights: w,
    weightedOverallPct,
    criticalStepResult,
    result,
    checklist,
    assessorObservation: result === 'Pass'
      ? 'Confirmed on live mock station. Sequence, torque values and gauge check consistent with VR run. Cleared to proceed.'
      : result === 'Marginal'
        ? 'Sequence correct but hesitant on torque confirmation step. Recommend one further supervised run before re-assessment.'
        : (criticalStepResult === 'Fail'
          ? 'Critical step failed on live mock station — torque value not confirmed before release. Does not meet gate for certification regardless of overall score.'
          : 'Multiple quality-relevant errors observed on live mock station. Not yet ready for unsupervised work.'),
    trainerRemarks: result !== 'Pass' ? 'Additional coaching scheduled on torque sequence and gauge-check discipline before next attempt.' : undefined,
    developmentPlan: result !== 'Pass' ? '2 supervised practice runs + 1 refresher module on critical-step discipline, then re-assessment within 10 working days.' : undefined,
  };
}

function buildCertification(
  trainee: TraineeSeed, station: Station, mod: TrainingModule, assessment: Assessment, session: Session,
  opts: { certDate: string; validUntil?: string; skipApproval?: boolean; skipRecommend?: boolean },
): Certification {
  const level = assessment.cycleTimeScorePct < 40 ? 2 : 3;
  const validFrom = opts.certDate;
  const validUntil = opts.validUntil ?? addDays(validFrom, station.requalificationIntervalMonths * 30);
  return {
    id: `CERT-${pad(certSeq++, 5)}`,
    traineeId: trainee.id,
    stationId: station.id,
    levelAwarded: level,
    scope: `${station.name} (${station.id}) — ${station.operationDescription.split(',')[0]} — WI ${station.workInstructionRef} Rev ${mod.linkedWiRevision}`,
    dateOfCertification: validFrom,
    validFrom,
    validUntil,
    recommendedBy: opts.skipRecommend ? null : { name: 'S. Nair', id: 'EMP-1090', role: 'Trainer / Assessor', timestamp: `${validFrom}T16:20:00+05:30` },
    authorisedBy: opts.skipApproval ? null : { name: 'A. Krishnan', id: 'EMP-1055', role: 'Quality Head', timestamp: `${addDays(validFrom, 1)}T10:05:00+05:30` },
    basisOfCompetence: ['Training (VR simulation)', 'Practical assessment on live/mock station', `Experience: ${trainee.priorExperienceYears} yr(s) prior`],
    evidenceRefs: { sessionIds: [session.id], assessmentIds: [assessment.id], checksums: [session.telemetryChecksum] },
    status: 'Active',
    requalificationDueDate: validUntil,
    awarenessAttestation: { productQuality: true, productSafety: true, nonconformityConsequence: true },
  };
}

export interface GeneratedData {
  trainees: Trainee[];
  sessions: Session[];
  assessments: Assessment[];
  certifications: Certification[];
  auditLog: AuditLogEntry[];
}

export function generate(): GeneratedData {
  const trainees: Trainee[] = [];
  const sessions: Session[] = [];
  const assessments: Assessment[] = [];
  const certifications: Certification[] = [];
  const auditLog: AuditLogEntry[] = [];

  const pushAudit = (ts: string, userName: string, role: Role, action: AuditLogEntry['action'], recordType: string, recordId: string) => {
    auditLog.push({ id: `AUD-${pad(auditSeq++, 5)}`, timestamp: ts, userId: 'SYS', userName, role, action, recordType, recordId, ip: '10.20.4.' + (10 + (auditSeq % 40)), device: 'Plant workstation' });
  };

  for (const seed of TRAINEE_SEEDS) {
    const rng = mulberry32(seedFromId(seed.id));
    const station = stationOf(seed.stationId);
    const mod = currentModuleFor(seed.stationId);
    const oldMod = seed.stationId === 'ST-03' ? moduleOf('MOD-ST03-V1') : mod;

    let status: TraineeStatus = 'Enrolled';
    let lastActivity = seed.dateOfJoining;
    let sessionsForTrainee: Session[] = [];
    let assessmentsForTrainee: Assessment[] = [];
    let cert: Certification | undefined;
    let enrolmentDate = addDays(seed.dateOfJoining, 3);

    const practiceAttempts = (count: number, useMod: TrainingModule, startDate: string, qualityStart: number, qualityEnd: number) => {
      const out: Session[] = [];
      for (let i = 0; i < count; i++) {
        const q = qualityStart + ((qualityEnd - qualityStart) * i) / Math.max(1, count - 1);
        const rawDate = addDays(startDate, i * 2 + Math.floor(rng() * 2));
        const date = rawDate > TODAY ? TODAY : rawDate;
        out.push(buildSession(seed, useMod, station, { type: 'Practice', quality: clamp(q, 0.15, 0.97), date }, rng));
      }
      return out;
    };

    switch (seed.recipe as Recipe) {
      case 'certified-current': {
        const practice = practiceAttempts(mod.practiceRunsRequired, mod, enrolmentDate, 0.35, 0.82);
        const assessDate = addDays(practice[practice.length - 1].date, 3);
        const assessSession = buildSession(seed, mod, station, { type: 'Assessment', quality: 0.88, date: assessDate }, rng);
        const assess = buildAssessment(seed, mod, station, assessSession, 1);
        cert = buildCertification(seed, station, mod, assess, assessSession, {
          certDate: addDays(assessDate, 1),
          validUntil: addDays(assessDate, 365 - (seedFromId(seed.id) % 200)),
        });
        sessionsForTrainee = [...practice, assessSession];
        assessmentsForTrainee = [assess];
        status = 'Certified';
        lastActivity = assessDate;
        break;
      }
      case 'certified-missing-signature': {
        const practice = practiceAttempts(mod.practiceRunsRequired, mod, enrolmentDate, 0.4, 0.85);
        const assessDate = addDays(practice[practice.length - 1].date, 2);
        const assessSession = buildSession(seed, mod, station, { type: 'Assessment', quality: 0.86, date: assessDate }, rng);
        const assess = buildAssessment(seed, mod, station, assessSession, 1);
        cert = buildCertification(seed, station, mod, assess, assessSession, {
          certDate: addDays(assessDate, 1),
          validUntil: addDays(assessDate, 300),
          skipApproval: true,
        });
        sessionsForTrainee = [...practice, assessSession];
        assessmentsForTrainee = [assess];
        status = 'Certified';
        lastActivity = assessDate;
        break;
      }
      case 'certified-expiring': {
        const practice = practiceAttempts(mod.practiceRunsRequired, mod, enrolmentDate, 0.3, 0.8);
        const assessDate = addDays(practice[practice.length - 1].date, 3);
        const assessSession = buildSession(seed, mod, station, { type: 'Assessment', quality: 0.85, date: assessDate }, rng);
        const assess = buildAssessment(seed, mod, station, assessSession, 1);
        const daysToExpiry = 6 + (seedFromId(seed.id) % 25);
        cert = buildCertification(seed, station, mod, assess, assessSession, {
          certDate: addDays(TODAY, -(365 - daysToExpiry)),
          validUntil: addDays(TODAY, daysToExpiry),
        });
        cert.status = 'Expiring soon';
        sessionsForTrainee = [...practice, assessSession];
        assessmentsForTrainee = [assess];
        status = 'Certified';
        lastActivity = assessDate;
        break;
      }
      case 'requal-overdue': {
        const practice = practiceAttempts(mod.practiceRunsRequired, mod, addDays(TODAY, -430), 0.3, 0.82);
        const assessDate = addDays(practice[practice.length - 1].date, 3);
        const assessSession = buildSession(seed, mod, station, { type: 'Assessment', quality: 0.86, date: assessDate }, rng);
        const assess = buildAssessment(seed, mod, station, assessSession, 1);
        cert = buildCertification(seed, station, mod, assess, assessSession, {
          certDate: assessDate,
          validUntil: addDays(assessDate, 365),
        });
        cert.status = 'Re-qualification due';
        cert.requalificationTriggerReason = `Certification interval elapsed (${station.requalificationIntervalMonths} months) — R-01`;
        sessionsForTrainee = [...practice, assessSession];
        assessmentsForTrainee = [assess];
        status = 'Re-qualification due';
        lastActivity = assessDate;
        break;
      }
      case 'requal-wi-revision': {
        const practice = practiceAttempts(oldMod.practiceRunsRequired, oldMod, addDays('2026-08-01', -180), 0.32, 0.83);
        const assessDate = addDays(practice[practice.length - 1].date, 3);
        const assessSession = buildSession(seed, oldMod, station, { type: 'Assessment', quality: 0.87, date: assessDate }, rng);
        const assess = buildAssessment(seed, oldMod, station, assessSession, 1);
        cert = buildCertification(seed, station, oldMod, assess, assessSession, {
          certDate: assessDate,
          validUntil: addDays(assessDate, 365),
        });
        cert.status = 'Re-qualification due';
        cert.requalificationTriggerReason = `Work instruction ${station.workInstructionRef} revised to Rev ${station.workInstructionRevision} on ${station.workInstructionRevisionDate} — R-02 (automatic, non-negotiable)`;
        sessionsForTrainee = [...practice, assessSession];
        assessmentsForTrainee = [assess];
        status = 'Re-qualification due';
        lastActivity = assessDate;
        break;
      }
      case 'in-training': {
        const runsSoFar = 2 + (seedFromId(seed.id) % 3);
        sessionsForTrainee = practiceAttempts(runsSoFar, mod, enrolmentDate, 0.25, 0.55);
        status = 'In training';
        lastActivity = sessionsForTrainee[sessionsForTrainee.length - 1].date;
        break;
      }
      case 'in-training-stalled': {
        sessionsForTrainee = practiceAttempts(2, mod, addDays(TODAY, -35), 0.2, 0.35);
        status = 'In training';
        lastActivity = addDays(TODAY, -21);
        break;
      }
      case 'awaiting-assessment': {
        sessionsForTrainee = practiceAttempts(mod.practiceRunsRequired, mod, addDays(TODAY, -18), 0.35, 0.79);
        status = 'Awaiting assessment';
        lastActivity = sessionsForTrainee[sessionsForTrainee.length - 1].date;
        break;
      }
      case 'recommended': {
        const practice = practiceAttempts(mod.practiceRunsRequired, mod, addDays(TODAY, -(mod.practiceRunsRequired * 2 + 16)), 0.4, 0.9);
        const assessDate = addDays(practice[practice.length - 1].date, 2);
        const assessSession = buildSession(seed, mod, station, { type: 'Assessment', quality: 0.9, date: assessDate }, rng);
        const assess = buildAssessment(seed, mod, station, assessSession, 1);
        cert = buildCertification(seed, station, mod, assess, assessSession, {
          certDate: addDays(assessDate, 1),
          skipApproval: true,
        });
        cert.status = 'Pending approval';
        sessionsForTrainee = [...practice, assessSession];
        assessmentsForTrainee = [assess];
        status = 'Recommended';
        lastActivity = assessDate;
        break;
      }
      case 'failed': {
        const practice = practiceAttempts(mod.practiceRunsRequired, mod, addDays(TODAY, -40), 0.2, 0.45);
        const attempt1Date = addDays(practice[practice.length - 1].date, 3);
        const forceCritical = seedFromId(seed.id) % 2 === 0;
        const attempt1Session = buildSession(seed, mod, station, { type: 'Assessment', quality: 0.4, date: attempt1Date, forceCriticalFail: forceCritical }, rng);
        const attempt1 = buildAssessment(seed, mod, station, attempt1Session, 1, 'Fail');
        const attempt2Date = addDays(attempt1Date, 12);
        const attempt2Session = buildSession(seed, mod, station, { type: 'Re-assessment', quality: 0.48, date: attempt2Date }, rng);
        const attempt2 = buildAssessment(seed, mod, station, attempt2Session, 2, 'Fail');
        sessionsForTrainee = [...practice, attempt1Session, attempt2Session];
        assessmentsForTrainee = [attempt1, attempt2];
        status = 'Failed';
        lastActivity = attempt2Date;
        break;
      }
      case 'suspended': {
        const practice = practiceAttempts(mod.practiceRunsRequired, mod, addDays(TODAY, -200), 0.35, 0.8);
        const assessDate = addDays(practice[practice.length - 1].date, 3);
        const assessSession = buildSession(seed, mod, station, { type: 'Assessment', quality: 0.84, date: assessDate }, rng);
        const assess = buildAssessment(seed, mod, station, assessSession, 1);
        cert = buildCertification(seed, station, mod, assess, assessSession, {
          certDate: assessDate,
          validUntil: addDays(assessDate, 365),
        });
        cert.status = 'Suspended';
        cert.withdrawalReason = 'Quality incident traced to operator/station — customer PPM spike, corner assembly (Ref: NCR-2026-0114) — R-05';
        cert.withdrawalAuthoriser = 'A. Krishnan, Quality Head';
        sessionsForTrainee = [...practice, assessSession];
        assessmentsForTrainee = [assess];
        status = 'Suspended';
        lastActivity = addDays(TODAY, -9);
        break;
      }
    }

    sessions.push(...sessionsForTrainee);
    assessments.push(...assessmentsForTrainee);
    if (cert) certifications.push(cert);

    const trainee: Trainee = {
      id: seed.id,
      name: seed.name,
      photoInitials: seed.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      dob: seed.dob,
      gender: seed.gender,
      employmentType: seed.employmentType,
      contractorName: seed.contractorName,
      dateOfJoining: seed.dateOfJoining,
      department: seed.department,
      shift: seed.shift,
      supervisor: seed.supervisor,
      supervisorId: seed.supervisorId,
      designation: seed.designation,
      priorExperienceYears: seed.priorExperienceYears,
      priorExperienceOn: seed.priorExperienceOn,
      education: seed.education,
      languages: seed.languages,
      inductionStatus: { done: true, date: seed.dateOfJoining, validUntil: addDays(seed.dateOfJoining, 730) },
      medicalFitness: { done: true, date: seed.dateOfJoining, validUntil: addDays(seed.dateOfJoining, 365) },
      colorVisionCheck: { done: true, date: seed.dateOfJoining },
      assignedStations: [seed.stationId],
      targetStation: seed.stationId,
      status,
      enrolmentDate,
      targetCertificationDate: addDays(enrolmentDate, 60),
      createdBy: 'Training Coordinator, Plant 2',
      createdAt: `${seed.dateOfJoining}T09:00:00+05:30`,
      modifiedBy: 'S. Nair',
      modifiedAt: `${lastActivity}T17:00:00+05:30`,
    };
    trainees.push(trainee);

    pushAudit(`${enrolmentDate}T09:10:00+05:30`, 'Training Coordinator, Plant 2', 'plant_admin', 'Edit', 'Trainee', trainee.id);
    sessionsForTrainee.forEach(s => pushAudit(`${s.date}T${s.endTime}:00+05:30`, seed.name, 'trainer', 'View', 'Session', s.id));
    assessmentsForTrainee.forEach(a => pushAudit(`${a.date}T17:30:00+05:30`, 'S. Nair', 'trainer', 'Edit', 'Assessment', a.id));
    if (cert?.recommendedBy) pushAudit(cert.recommendedBy.timestamp, cert.recommendedBy.name, 'trainer', 'Approve', 'Certification', cert.id);
    if (cert?.authorisedBy) pushAudit(cert.authorisedBy.timestamp, cert.authorisedBy.name, 'quality_head', 'Approve', 'Certification', cert.id);
  }

  auditLog.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return { trainees, sessions, assessments, certifications, auditLog };
}

export const DATA = generate();
export { STATIONS, MODULES, PILOT_STATION_ID };

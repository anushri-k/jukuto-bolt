export type Role = 'super_admin' | 'plant_admin' | 'trainer' | 'quality_head' | 'auditor';

export interface UserAccount {
  id: string;
  name: string;
  employeeId: string;
  role: Role;
  designation: string;
}

export type EmploymentType = 'Permanent' | 'Contract' | 'Apprentice' | 'Trainee' | 'Agency';

export type TraineeStatus =
  | 'Enrolled'
  | 'In training'
  | 'Awaiting assessment'
  | 'Recommended'
  | 'Certified'
  | 'Re-qualification due'
  | 'Suspended'
  | 'Failed'
  | 'Exited';

export interface Trainee {
  id: string;
  name: string;
  photoInitials: string;
  dob: string;
  gender?: string;
  employmentType: EmploymentType;
  contractorName?: string;
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
  inductionStatus: { done: boolean; date?: string; validUntil?: string };
  medicalFitness: { done: boolean; date?: string; validUntil?: string };
  colorVisionCheck?: { done: boolean; date?: string };
  assignedStations: string[];
  targetStation: string;
  status: TraineeStatus;
  enrolmentDate: string;
  targetCertificationDate: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface Station {
  id: string;
  name: string;
  line: string;
  partNumbers: string[];
  partName: string;
  operationDescription: string;
  workInstructionRef: string;
  workInstructionRevision: string;
  workInstructionRevisionDate: string;
  controlPlanRef: string;
  standardCycleTimeSec: number;
  qualityCriteria: string[];
  specialCharacteristic: 'Safety' | 'Regulatory' | 'Significant' | 'None';
  hazardClassification: string;
  requiredPPE: string[];
  requiredLevelForUnsupervised: number;
  minCertifiedPerShift: number;
  requalificationIntervalMonths: number;
  linkedModuleIds: string[];
  owner: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  version: string;
  linkedStationId: string;
  linkedWiRevision: string;
  type: 'Induction' | 'Safety' | 'Process' | 'Quality' | 'Re-certification' | 'Refresher';
  languages: string[];
  steps: ModuleStep[];
  nominalDurationMin: number;
  passingThresholdOverall: number;
  passingThresholdCriticalStep: number;
  practiceRunsRequired: number;
  maxAttemptsBeforeEscalation: number;
  approvedBy: string;
  approvedDate: string;
}

export interface ModuleStep {
  id: string;
  seq: number;
  description: string;
  targetTimeSec: number;
  toleranceSec: number;
  critical: boolean;
}

export type SessionType = 'Practice' | 'Assessment' | 'Re-assessment' | 'Refresher';
export type CompletionStatus = 'Completed' | 'Abandoned' | 'Aborted' | 'Timed out' | 'Technical failure';

export interface StepRecord {
  stepId: string;
  sequenceOk: boolean;
  timeTakenSec: number;
  correct: boolean;
  errorType?: 'Sequence' | 'Omission' | 'Torque' | 'Orientation' | 'Tooling' | 'Gauge' | 'Safety' | 'Quality-check skipped';
  retryCount: number;
  hintUsed: boolean;
  helpRequested: boolean;
}

export interface Session {
  id: string;
  traineeId: string;
  moduleId: string;
  moduleVersion: string;
  stationId: string;
  sessionType: SessionType;
  date: string;
  startTime: string;
  endTime: string;
  durationSec: number;
  headsetId: string;
  buildVersion: string;
  location: string;
  trainerPresent: { name: string; id: string } | null;
  completionStatus: CompletionStatus;
  steps: StepRecord[];
  sequenceAdherencePct: number;
  cycleTimeAchievedSec: number;
  errorCountByCategory: Record<string, number>;
  criticalErrorCount: number;
  safetyViolations: number;
  retries: number;
  hintsUsed: number;
  idleTimeSec: number;
  telemetryFileRef: string;
  telemetryChecksum: string;
}

export interface AssessmentChecklistItem {
  item: string;
  result: 'Yes' | 'No' | 'NA';
  remarks?: string;
}

export interface Assessment {
  id: string;
  traineeId: string;
  stationId: string;
  attemptNumber: number;
  date: string;
  assessorName: string;
  assessorId: string;
  sessionId: string;
  knowledgeScorePct: number | null;
  practicalScorePct: number;
  sequenceAdherenceScorePct: number;
  cycleTimeScorePct: number;
  qualityScorePct: number;
  safetyPass: boolean;
  weights: { knowledge: number; practical: number; sequence: number; cycleTime: number; quality: number };
  weightedOverallPct: number;
  criticalStepResult: 'Pass' | 'Fail';
  result: 'Pass' | 'Marginal' | 'Fail';
  checklist: AssessmentChecklistItem[];
  assessorObservation: string;
  trainerRemarks?: string;
  developmentPlan?: string;
}

export type CertificationStatus = 'Active' | 'Expiring soon' | 'Expired' | 'Suspended' | 'Withdrawn' | 'Re-qualification due' | 'Pending approval';

export interface Certification {
  id: string;
  traineeId: string;
  stationId: string;
  levelAwarded: number;
  scope: string;
  dateOfCertification: string;
  validFrom: string;
  validUntil: string;
  recommendedBy: { name: string; id: string; role: string; timestamp: string } | null;
  authorisedBy: { name: string; id: string; role: string; timestamp: string } | null;
  basisOfCompetence: string[];
  evidenceRefs: { sessionIds: string[]; assessmentIds: string[]; checksums: string[] };
  restrictions?: string;
  status: CertificationStatus;
  withdrawalReason?: string;
  withdrawalAuthoriser?: string;
  requalificationDueDate?: string;
  requalificationTriggerReason?: string;
  awarenessAttestation: { productQuality: boolean; productSafety: boolean; nonconformityConsequence: boolean } | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: Role;
  action: 'Login' | 'Logout' | 'View' | 'Export' | 'Print' | 'Edit' | 'Approve' | 'Reject' | 'Failed login';
  recordType: string;
  recordId: string;
  ip: string;
  device: string;
}

export interface ClauseMapEntry {
  clause: string;
  requirement: string;
  answeredBy: string;
  standardEdition: string;
}

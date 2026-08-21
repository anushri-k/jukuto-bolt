// Seed bios for 26 trainees. A "recipe" drives the generator (generator.ts)
// to produce self-consistent sessions, assessments and certifications — the
// bio never states a status directly; the status is always derived.

export type Recipe =
  | 'certified-current'
  | 'certified-expiring'
  | 'requal-overdue'
  | 'requal-wi-revision'
  | 'in-training'
  | 'in-training-stalled'
  | 'awaiting-assessment'
  | 'recommended'
  | 'failed'
  | 'suspended'
  | 'certified-missing-signature';

export interface TraineeSeed {
  id: string;
  name: string;
  employmentType: 'Permanent' | 'Contract' | 'Apprentice' | 'Trainee' | 'Agency';
  contractorName?: string;
  dob: string;
  gender: string;
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
  stationId: string;
  recipe: Recipe;
}

export const TRAINEE_SEEDS: TraineeSeed[] = [
  // ST-03 Brake Caliper (pilot / safety-critical) — heaviest coverage
  { id: 'EMP-2201', name: 'Ramesh Kumar Yadav', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1994-03-12', gender: 'Male', dateOfJoining: '2025-11-04', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 2, priorExperienceOn: 'Manual sub-assembly, unrelated OEM', education: '10th pass, ITI Fitter', languages: ['hi'], stationId: 'ST-03', recipe: 'certified-current' },
  { id: 'EMP-2202', name: 'Suman Devi', employmentType: 'Permanent', dob: '1991-07-22', gender: 'Female', dateOfJoining: '2023-02-10', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Senior Line Operator', priorExperienceYears: 5, priorExperienceOn: 'Brake sub-assembly, same plant', education: '12th pass', languages: ['hi', 'en'], stationId: 'ST-03', recipe: 'certified-current' },
  { id: 'EMP-2203', name: 'Arun Prasad', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1996-01-30', gender: 'Male', dateOfJoining: '2026-01-12', department: 'Brake Systems Assembly', shift: 'C', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 1, priorExperienceOn: 'None — first industrial role', education: '10th pass', languages: ['hi'], stationId: 'ST-03', recipe: 'certified-expiring' },
  { id: 'EMP-2204', name: 'Deepak Rathore', employmentType: 'Apprentice', dob: '2005-09-14', gender: 'Male', dateOfJoining: '2026-04-01', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Apprentice Operator', priorExperienceYears: 0, education: 'Diploma, Mechanical (pursuing)', languages: ['hi'], stationId: 'ST-03', recipe: 'in-training' },
  { id: 'EMP-2205', name: 'Farhan Sheikh', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1993-11-02', gender: 'Male', dateOfJoining: '2026-02-18', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 3, priorExperienceOn: 'Torque assembly, tier-2 supplier', education: 'ITI Fitter', languages: ['hi'], stationId: 'ST-03', recipe: 'awaiting-assessment' },
  { id: 'EMP-2206', name: 'Priya Sharma', employmentType: 'Permanent', dob: '1990-05-18', gender: 'Female', dateOfJoining: '2022-08-01', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Senior Line Operator', priorExperienceYears: 6, priorExperienceOn: 'Brake caliper, same station, prior WI revision', education: '12th pass', languages: ['hi', 'en'], stationId: 'ST-03', recipe: 'recommended' },
  { id: 'EMP-2207', name: 'Vikram Singh Chauhan', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1997-06-25', gender: 'Male', dateOfJoining: '2025-09-22', department: 'Brake Systems Assembly', shift: 'C', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 1, education: '10th pass', languages: ['hi'], stationId: 'ST-03', recipe: 'requal-wi-revision' },
  { id: 'EMP-2208', name: 'Sunita Kumari', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1995-02-09', gender: 'Female', dateOfJoining: '2025-06-15', department: 'Brake Systems Assembly', shift: 'C', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 2, education: 'ITI Electrician', languages: ['hi'], stationId: 'ST-03', recipe: 'requal-wi-revision' },
  { id: 'EMP-2209', name: 'Manoj Tiwari', employmentType: 'Permanent', dob: '1988-12-01', gender: 'Male', dateOfJoining: '2019-03-11', department: 'Brake Systems Assembly', shift: 'B', supervisor: 'A. Krishnan', supervisorId: 'EMP-1055', designation: 'Senior Line Operator', priorExperienceYears: 8, priorExperienceOn: 'Brake caliper, same station', education: '12th pass, ITI Fitter', languages: ['hi', 'en'], stationId: 'ST-03', recipe: 'requal-wi-revision' },
  { id: 'EMP-2210', name: 'Rekha Bai', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1992-04-17', gender: 'Female', dateOfJoining: '2025-01-06', department: 'Brake Systems Assembly', shift: 'B', supervisor: 'A. Krishnan', supervisorId: 'EMP-1055', designation: 'Line Operator', priorExperienceYears: 3, education: '12th pass', languages: ['hi'], stationId: 'ST-03', recipe: 'requal-wi-revision' },
  { id: 'EMP-2211', name: 'Ashok Meena', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1990-10-05', gender: 'Male', dateOfJoining: '2024-05-20', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 4, education: 'ITI Fitter', languages: ['hi'], stationId: 'ST-03', recipe: 'requal-overdue' },
  { id: 'EMP-2212', name: 'Geeta Rani', employmentType: 'Permanent', dob: '1989-08-29', gender: 'Female', dateOfJoining: '2020-11-02', department: 'Brake Systems Assembly', shift: 'C', supervisor: 'A. Krishnan', supervisorId: 'EMP-1055', designation: 'Senior Line Operator', priorExperienceYears: 7, education: '12th pass', languages: ['hi', 'en'], stationId: 'ST-03', recipe: 'requal-overdue' },
  { id: 'EMP-2213', name: 'Irfan Ali', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1998-03-03', gender: 'Male', dateOfJoining: '2026-03-09', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 0, education: '10th pass', languages: ['hi'], stationId: 'ST-03', recipe: 'failed' },

  // ST-04 Brake Line (safety-critical — intentional B-shift coverage gap: no B-shift trainees below)
  { id: 'EMP-2301', name: 'Nitin Verma', employmentType: 'Permanent', dob: '1992-09-19', gender: 'Male', dateOfJoining: '2021-06-14', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Senior Line Operator', priorExperienceYears: 5, education: '12th pass', languages: ['hi', 'en'], stationId: 'ST-04', recipe: 'certified-current' },
  { id: 'EMP-2302', name: 'Kavita Joshi', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1994-12-11', gender: 'Female', dateOfJoining: '2025-07-01', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 2, education: 'ITI Fitter', languages: ['hi'], stationId: 'ST-04', recipe: 'certified-current' },
  { id: 'EMP-2303', name: 'Sanjay Gupta', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1993-05-27', gender: 'Male', dateOfJoining: '2025-10-08', department: 'Brake Systems Assembly', shift: 'C', supervisor: 'A. Krishnan', supervisorId: 'EMP-1055', designation: 'Line Operator', priorExperienceYears: 3, education: '12th pass', languages: ['hi'], stationId: 'ST-04', recipe: 'certified-current' },
  { id: 'EMP-2304', name: 'Meena Kumari', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1996-02-14', gender: 'Female', dateOfJoining: '2026-01-20', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 1, education: 'ITI Fitter', languages: ['hi'], stationId: 'ST-04', recipe: 'certified-expiring' },
  { id: 'EMP-2305', name: 'Rohit Malhotra', employmentType: 'Permanent', dob: '1991-01-08', gender: 'Male', dateOfJoining: '2022-03-15', department: 'Brake Systems Assembly', shift: 'C', supervisor: 'A. Krishnan', supervisorId: 'EMP-1055', designation: 'Senior Line Operator', priorExperienceYears: 4, education: '12th pass', languages: ['hi', 'en'], stationId: 'ST-04', recipe: 'certified-expiring' },
  { id: 'EMP-2306', name: 'Preeti Yadav', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1997-07-30', gender: 'Female', dateOfJoining: '2026-02-02', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 0, education: '10th pass', languages: ['hi'], stationId: 'ST-04', recipe: 'awaiting-assessment' },
  { id: 'EMP-2307', name: 'Harpreet Singh', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1995-04-21', gender: 'Male', dateOfJoining: '2025-12-01', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 2, education: 'ITI Fitter', languages: ['hi', 'pa'], stationId: 'ST-04', recipe: 'in-training' },
  { id: 'EMP-2308', name: 'Anjali Patel', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1994-08-16', gender: 'Female', dateOfJoining: '2026-05-04', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'V. Deshmukh', supervisorId: 'EMP-1042', designation: 'Line Operator', priorExperienceYears: 1, education: '12th pass', languages: ['hi', 'gu'], stationId: 'ST-04', recipe: 'suspended' },

  // ST-08 Gauge & Leak Check (safety-critical)
  { id: 'EMP-2401', name: 'Dinesh Chandra', employmentType: 'Permanent', dob: '1990-06-09', gender: 'Male', dateOfJoining: '2021-01-11', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'A. Krishnan', supervisorId: 'EMP-1055', designation: 'Senior Line Operator', priorExperienceYears: 6, education: '12th pass', languages: ['hi', 'en'], stationId: 'ST-08', recipe: 'certified-current' },
  { id: 'EMP-2402', name: 'Pooja Rawat', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1996-03-25', gender: 'Female', dateOfJoining: '2025-08-19', department: 'Brake Systems Assembly', shift: 'C', supervisor: 'A. Krishnan', supervisorId: 'EMP-1055', designation: 'Line Operator', priorExperienceYears: 2, education: 'ITI Fitter', languages: ['hi'], stationId: 'ST-08', recipe: 'certified-current' },
  { id: 'EMP-2403', name: 'Yogesh Pawar', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1993-10-13', gender: 'Male', dateOfJoining: '2025-04-07', department: 'Brake Systems Assembly', shift: 'A', supervisor: 'A. Krishnan', supervisorId: 'EMP-1055', designation: 'Line Operator', priorExperienceYears: 3, education: '12th pass', languages: ['hi', 'mr'], stationId: 'ST-08', recipe: 'failed' },

  // ST-01 Chassis Weld Fixture
  { id: 'EMP-2101', name: 'Ajay Kumar Saini', employmentType: 'Permanent', dob: '1989-02-27', gender: 'Male', dateOfJoining: '2020-07-06', department: 'Chassis Assembly', shift: 'A', supervisor: 'M. Fernandes', supervisorId: 'EMP-1030', designation: 'Senior Line Operator', priorExperienceYears: 7, education: 'ITI Fitter', languages: ['hi', 'en'], stationId: 'ST-01', recipe: 'certified-current' },
  { id: 'EMP-2102', name: 'Neha Agarwal', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1995-11-20', gender: 'Female', dateOfJoining: '2025-05-12', department: 'Chassis Assembly', shift: 'B', supervisor: 'M. Fernandes', supervisorId: 'EMP-1030', designation: 'Line Operator', priorExperienceYears: 2, education: '12th pass', languages: ['hi'], stationId: 'ST-01', recipe: 'certified-current', },
  { id: 'EMP-2103', name: 'Bharat Solanki', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1994-07-04', gender: 'Male', dateOfJoining: '2026-03-22', department: 'Chassis Assembly', shift: 'A', supervisor: 'M. Fernandes', supervisorId: 'EMP-1030', designation: 'Line Operator', priorExperienceYears: 1, education: 'ITI Welder', languages: ['hi'], stationId: 'ST-01', recipe: 'in-training-stalled' },

  // ST-02 Chassis Bolt Torque
  { id: 'EMP-2104', name: 'Sandeep Yadav', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1993-01-15', gender: 'Male', dateOfJoining: '2025-09-01', department: 'Chassis Assembly', shift: 'A', supervisor: 'M. Fernandes', supervisorId: 'EMP-1030', designation: 'Line Operator', priorExperienceYears: 3, education: '12th pass', languages: ['hi'], stationId: 'ST-02', recipe: 'certified-current', },
  { id: 'EMP-2105', name: 'Reena Kapoor', employmentType: 'Permanent', dob: '1991-05-06', gender: 'Female', dateOfJoining: '2022-10-17', department: 'Chassis Assembly', shift: 'A', supervisor: 'M. Fernandes', supervisorId: 'EMP-1030', designation: 'Senior Line Operator', priorExperienceYears: 5, education: '12th pass', languages: ['hi', 'en'], stationId: 'ST-02', recipe: 'awaiting-assessment' },

  // ST-05 / ST-06 Powertrain
  { id: 'EMP-2501', name: 'Vishal Thakur', employmentType: 'Permanent', dob: '1990-09-23', gender: 'Male', dateOfJoining: '2021-11-08', department: 'Powertrain Assembly', shift: 'A', supervisor: 'K. Bhatt', supervisorId: 'EMP-1061', designation: 'Senior Line Operator', priorExperienceYears: 6, education: 'ITI Fitter', languages: ['hi', 'en'], stationId: 'ST-05', recipe: 'certified-current' },
  { id: 'EMP-2502', name: 'Komal Bisht', employmentType: 'Contract', contractorName: 'Nova Workforce Solutions', dob: '1996-06-30', gender: 'Female', dateOfJoining: '2025-03-14', department: 'Powertrain Assembly', shift: 'A', supervisor: 'K. Bhatt', supervisorId: 'EMP-1061', designation: 'Line Operator', priorExperienceYears: 2, education: '12th pass', languages: ['hi'], stationId: 'ST-06', recipe: 'certified-missing-signature' },

  // ST-07 Final Trim
  { id: 'EMP-2601', name: 'Om Prakash', employmentType: 'Contract', contractorName: 'Shreeji Manpower Services', dob: '1992-04-02', gender: 'Male', dateOfJoining: '2025-02-24', department: 'Trim & Final', shift: 'A', supervisor: 'M. Fernandes', supervisorId: 'EMP-1030', designation: 'Line Operator', priorExperienceYears: 4, education: '12th pass', languages: ['hi'], stationId: 'ST-07', recipe: 'certified-current' },
];

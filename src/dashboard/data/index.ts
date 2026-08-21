export * from './types';
export * from './config';
export { STATIONS, MODULES } from './stations';
export { DATA, PILOT_STATION_ID } from './generator';

import { DATA } from './generator';
import { STATIONS } from './stations';
import { Trainee, Certification, Session, Assessment } from './types';

export function traineeById(id: string): Trainee | undefined {
  return DATA.trainees.find(t => t.id === id);
}
export function stationById(id: string): typeof STATIONS[number] | undefined {
  return STATIONS.find(s => s.id === id);
}
export function certificationsFor(traineeId: string): Certification[] {
  return DATA.certifications.filter(c => c.traineeId === traineeId);
}
export function sessionsFor(traineeId: string): Session[] {
  return DATA.sessions.filter(s => s.traineeId === traineeId).sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
}
export function assessmentsFor(traineeId: string): Assessment[] {
  return DATA.assessments.filter(a => a.traineeId === traineeId).sort((a, b) => a.attemptNumber - b.attemptNumber);
}
export function latestCertificationFor(traineeId: string, stationId?: string): Certification | undefined {
  const list = certificationsFor(traineeId).filter(c => !stationId || c.stationId === stationId);
  return list.sort((a, b) => b.dateOfCertification.localeCompare(a.dateOfCertification))[0];
}

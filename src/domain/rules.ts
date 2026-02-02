import { TimetableSession } from "./types";

// Constants
export const ACADEMIC_START_HOUR = 9;
export const ACADEMIC_END_HOUR = 16;
export const LUNCH_START_HOUR = 12;
export const LUNCH_END_HOUR = 13;

export const DAYS: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

// Helper: Convert "09:30" to minutes from midnight
const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// Domain Rule: Validate Session Constraints
export const validateSession = (
  newSession: Omit<TimetableSession, 'id'>,
  existingSessions: TimetableSession[]
): { valid: boolean; error?: string } => {
  
  const startMin = toMinutes(newSession.startTime);
  const endMin = toMinutes(newSession.endTime);
  const lunchStart = LUNCH_START_HOUR * 60;
  const lunchEnd = LUNCH_END_HOUR * 60;
  const dayStart = ACADEMIC_START_HOUR * 60;
  const dayEnd = ACADEMIC_END_HOUR * 60;

  // 1. Boundary Checks
  if (startMin < dayStart || endMin > dayEnd) {
    return { valid: false, error: `Classes must be between ${ACADEMIC_START_HOUR}:00 and ${ACADEMIC_END_HOUR}:00.` };
  }

  if (startMin >= endMin) {
    return { valid: false, error: "End time must be after start time." };
  }

  // 2. Lunch Break Protection
  // Overlap formula: (StartA < EndB) && (EndA > StartB)
  if (startMin < lunchEnd && endMin > lunchStart) {
    return { valid: false, error: "Classes cannot overlap with Lunch Break (12:00 - 13:00)." };
  }

  // 3. Overlap with Existing Sessions (Same Year Group)
  const hasOverlap = existingSessions.some(session => {
    if (session.day !== newSession.day) return false;
    if (session.yearGroup !== newSession.yearGroup) return false; // Different years don't conflict

    const sStart = toMinutes(session.startTime);
    const sEnd = toMinutes(session.endTime);

    return startMin < sEnd && endMin > sStart;
  });

  if (hasOverlap) {
    return { valid: false, error: "This slot conflicts with another class for this Year Group." };
  }

  return { valid: true };
};
export type Role = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday'
}

export enum AcademicYear {
  YEAR_1 = 1,
  YEAR_2 = 2,
  YEAR_3 = 3,
  YEAR_4 = 4,
  YEAR_5 = 5
}

export enum Section {
  A = 'A',
  B = 'B',
  C = 'C'
}

export interface TimeSlot {
  startHour: number;
  startMinute: number;
  durationMinutes: number;
}

export interface ClassSession {
  id: string;
  subjectCode: string;
  subjectName: string;
  professor: string;
  room: string;
  year: AcademicYear;
  section: Section;
  day: DayOfWeek;
  startMinutes: number; // Minutes from midnight (e.g., 9:00 = 540)
  durationMinutes: number;
}

export interface TimetableSession {
  id: string;
  subject: string;
  professor: string;
  room: string;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  yearGroup: number; // 1-5
}

export enum ViolationType {
  ERROR = 'ERROR',
  WARNING = 'WARNING'
}

export enum ViolationCategory {
  OVERLAP = 'OVERLAP',
  LUNCH = 'LUNCH',
  BOUNDARY = 'BOUNDARY',
  ROOM = 'ROOM',
  PROFESSOR = 'PROFESSOR',
  WORKLOAD = 'WORKLOAD'
}

export interface Violation {
  type: ViolationType;
  category: ViolationCategory;
  message: string;
  relatedSessionIds: string[];
}

export interface ValidationResult {
  isValid: boolean;
  violations: Violation[];
}

export type ViewMode = 'ADMIN' | 'STUDENT' | 'REPORTS';

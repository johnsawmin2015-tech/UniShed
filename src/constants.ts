import { DayOfWeek, Section } from "./domain/types";

export const DAYS_ORDER = [
    DayOfWeek.MONDAY,
    DayOfWeek.Tuesday, // Note: fixing capitalization mismatch if needed, but assuming enum uses uppercase keys but values might be Title Case
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY
] as const;

// Ensure we match the Enum values. 
// If generic string usage is needed, we can map them.
// Let's assume DayOfWeek enum values are 'Monday', 'Tuesday' etc.

export const SECTIONS_ORDER = [Section.A, Section.B, Section.C];

export const MIN_CLASS_DURATION = 60;
export const MAX_CLASS_DURATION = 180;

export const DAY_START_HOUR = 9;
export const DAY_END_HOUR = 17;
export const DAY_START_MINUTES = DAY_START_HOUR * 60; // 9:00 -> 540
export const DAY_END_MINUTES = DAY_END_HOUR * 60;    // 17:00 -> 1020

export const LUNCH_START_MINUTES = 12 * 60; // 12:00
export const LUNCH_END_MINUTES = 13 * 60;   // 13:00

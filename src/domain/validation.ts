import { ClassSession, ValidationResult, Violation, ViolationCategory, ViolationType, DayOfWeek } from "./types";
import { LUNCH_START_MINUTES, LUNCH_END_MINUTES, DAY_START_MINUTES, DAY_END_MINUTES } from "../constants";

export const validateTimetable = (sessions: ClassSession[]): ValidationResult => {
    const violations: Violation[] = [];

    // Helper to check time overlap
    const isOverlapping = (s1: ClassSession, s2: ClassSession) => {
        if (s1.day !== s2.day) return false;
        const start1 = s1.startMinutes;
        const end1 = s1.startMinutes + s1.durationMinutes;
        const start2 = s2.startMinutes;
        const end2 = s2.startMinutes + s2.durationMinutes;
        return start1 < end2 && end1 > start2;
    };

    // 1. Pairwise checks
    for (let i = 0; i < sessions.length; i++) {
        const s1 = sessions[i];
        const end1 = s1.startMinutes + s1.durationMinutes;

        // A. Check Logic Constraints (Time bounds)
        if (s1.startMinutes < DAY_START_MINUTES || end1 > DAY_END_MINUTES) {
            violations.push({
                id: `bounds-${s1.id}`,
                type: 'ERROR',
                category: ViolationCategory.ROOM, // Misnomer but closest category for time bound? Or maybe we need logic category. Using 'ROOM' as catch-all or just pure string if type allows. 
                // Actually ViolationCategory is enum. Let's use ROOM for physical constraints or create OTHER.
                // Let's assume ValidationCategory has OTHER or similar. 
                // Checking types.ts: ROOM, PROFESSOR, OVERLAP. 
                // Use OVERLAP as generic conflict for time bounds? Or ROOM (resource unavailability).
                // I'll stick to OVERLAP for now or defined enums.
                // Let's use OVERLAP for time bounds as it overlaps with "non-working hours".
                relatedSessionIds: [s1.id],
                message: `${s1.subjectCode} is scheduled outside academic hours (09:00 - 17:00).`
            });
        }

        // B. Lunch Break Constraint (12:00 - 13:00)
        // Locked for everyone
        if (s1.startMinutes < LUNCH_END_MINUTES && end1 > LUNCH_START_MINUTES) {
            violations.push({
                id: `lunch-${s1.id}`,
                type: 'ERROR',
                category: ViolationCategory.OVERLAP,
                relatedSessionIds: [s1.id],
                message: `${s1.subjectCode} conflicts with the mandatory Lunch Break (12:00-13:00).`
            });
        }

        // C. Wednesday Afternoon Free (after 13:00)
        if (s1.day === DayOfWeek.WEDNESDAY && end1 > 13 * 60) {
            violations.push({
                id: `wed-free-${s1.id}`,
                type: 'WARNING', // Warning because maybe some electives allow it?
                category: ViolationCategory.OVERLAP,
                relatedSessionIds: [s1.id],
                message: `${s1.subjectCode} is scheduled during Wednesday Afternoon Free Study.`
            });
        }

        for (let j = i + 1; j < sessions.length; j++) {
            const s2 = sessions[j];

            if (isOverlapping(s1, s2)) {
                // D. Professor Collision
                if (s1.professor === s2.professor && s1.professor !== 'TBD') {
                    violations.push({
                        id: `prof-${s1.id}-${s2.id}`,
                        type: 'ERROR',
                        category: ViolationCategory.PROFESSOR,
                        relatedSessionIds: [s1.id, s2.id],
                        message: `Professor ${s1.professor} is double-booked for ${s1.subjectCode} and ${s2.subjectCode}.`
                    });
                }

                // E. Room Collision
                if (s1.room === s2.room && s1.room !== 'TBD') {
                    violations.push({
                        id: `room-${s1.id}-${s2.id}`,
                        type: 'ERROR',
                        category: ViolationCategory.ROOM,
                        relatedSessionIds: [s1.id, s2.id],
                        message: `Room ${s1.room} is double-booked.`
                    });
                }

                // F. Student Group Collision (Same Year & Section)
                if (s1.year === s2.year && s1.section === s2.section) {
                    violations.push({
                        id: `section-${s1.id}-${s2.id}`,
                        type: 'ERROR',
                        category: ViolationCategory.OVERLAP,
                        relatedSessionIds: [s1.id, s2.id],
                        message: `Section ${s1.year}-${s1.section} has overlapping classes: ${s1.subjectCode} and ${s2.subjectCode}.`
                    });
                }
            }
        }
    }

    return {
        isValid: violations.length === 0,
        violations
    };
};

import { AcademicYear, ClassSession, DayOfWeek, Section } from "../domain/types";

const SUBJECT_POOL: Record<number, Array<{ code: string, name: string, prof: string }>> = {
  1: [ // Year 1
    { code: 'CS101', name: 'Intro to Comp Sci', prof: 'Dr. A. Turing' },
    { code: 'MAT101', name: 'Calculus I', prof: 'Dr. I. Newton' },
    { code: 'PHY101', name: 'Physics I', prof: 'Dr. A. Einstein' },
    { code: 'ENG101', name: 'Acad. Writing', prof: 'Prof. V. Woolf' },
    { code: 'HIS101', name: 'History of Tech', prof: 'Dr. H. Zinn' },
    { code: 'ART101', name: 'Digital Arts', prof: 'Prof. L. Da Vinci' },
    { code: 'BIO101', name: 'Biology Basics', prof: 'Dr. R. Franklin' },
    { code: 'CHE101', name: 'Chemistry I', prof: 'Dr. M. Curie' }
  ],
  2: [ // Year 2
    { code: 'CS201', name: 'Data Structures', prof: 'Dr. D. Knuth' },
    { code: 'CS202', name: 'Digital Logic', prof: 'Dr. C. Shannon' },
    { code: 'MAT201', name: 'Discrete Math', prof: 'Dr. G. Boole' },
    { code: 'STA201', name: 'Prob & Stats', prof: 'Dr. K. Pearson' },
    { code: 'CS203', name: 'Comp Org', prof: 'Dr. von Neumann' },
    { code: 'ECO201', name: 'Microeconomics', prof: 'Dr. J. Keynes' },
    { code: 'PSY201', name: 'Cognitive Psych', prof: 'Dr. J. Piaget' },
    { code: 'CS205', name: 'OOP Java', prof: 'Dr. J. Gosling' }
  ],
  3: [ // Year 3
    { code: 'CS301', name: 'Operating Sys', prof: 'Dr. L. Torvalds' },
    { code: 'CS302', name: 'Algorithms', prof: 'Dr. E. Dijkstra' },
    { code: 'CS303', name: 'Databases', prof: 'Dr. E. Codd' },
    { code: 'CS304', name: 'Comp Networks', prof: 'Dr. V. Cerf' },
    { code: 'CS305', name: 'Web Stack', prof: 'Berners-Lee' },
    { code: 'CS306', name: 'Soft. Arch.', prof: 'M. Fowler' },
    { code: 'AI301', name: 'Intro to AI', prof: 'Dr. McCarthy' }
  ],
  4: [ // Year 4
    { code: 'AI401', name: 'Deep Learning', prof: 'Dr. Y. LeCun' },
    { code: 'CS402', name: 'Compilers', prof: 'Dr. G. Hopper' },
    { code: 'SEC401', name: 'Cybersecurity', prof: 'Dr. A. Shamir' },
    { code: 'CS404', name: 'Comp Graphics', prof: 'Dr. E. Catmull' },
    { code: 'CS405', name: 'Distributed Sys', prof: 'Dr. L. Lamport' },
    { code: 'ETH401', name: 'Tech Ethics', prof: 'Prof. I. Kant' },
    { code: 'PRJ400', name: 'Capstone I', prof: 'Prof. D. Head' }
  ],
  5: [ // Year 5
    { code: 'THS501', name: 'Thesis Research', prof: 'Dr. T. Mentor' },
    { code: 'THS502', name: 'Thesis Writeup', prof: 'Dr. R. Guide' },
    { code: 'ML503', name: 'Adv. ML', prof: 'Dr. G. Hinton' },
    { code: 'CLD504', name: 'Cloud Arch', prof: 'Dr. W. Vogels' },
    { code: 'QTM505', name: 'Quantum Comp', prof: 'Dr. P. Shor' },
    { code: 'SEM500', name: 'Guest Seminar', prof: 'Prof. V. Guest' },
    { code: 'ENT501', name: 'Tech Startup', prof: 'P. Graham' }
  ]
};

// Expanded room list to accommodate concurrent classes (5 years * 3 sections = 15 groups)
const ROOMS = [
  'Room 101', 'Room 102', 'Room 103', 'Room 104', 'Room 105',
  'Lab A', 'Lab B', 'Lab C', 'Lab D', 'Lab E',
  'Lecture Hall 1', 'Lecture Hall 2', 'Lecture Hall 3', 'Lecture Hall 4',
  'Auditorium A', 'Auditorium B',
  'Innovation Hub', 'Tech Lounge', 'Seminar Room A', 'Seminar Room B'
];

const generateSessions = (): ClassSession[] => {
  const sessions: ClassSession[] = [];
  const years = [AcademicYear.YEAR_1, AcademicYear.YEAR_2, AcademicYear.YEAR_3, AcademicYear.YEAR_4, AcademicYear.YEAR_5];
  const sections = [Section.A, Section.B, Section.C];
  const days = [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY];

  // Standard Schedule: 6 classes/day
  // 09:00, 10:00, 11:00, (Lunch), 13:00, 14:00, 15:00
  const standardSlots = [9, 10, 11, 13, 14, 15];

  // Wednesday Schedule: 4 classes/day
  // 09:00, 10:00, 11:00, (Lunch), 13:00
  const wednesdaySlots = [9, 10, 11, 13];

  years.forEach((year, yearIndex) => {
    const subjects = SUBJECT_POOL[year];

    sections.forEach((section, sectionIndex) => {
      // Calculate a unique group index (0-14)
      const groupIndex = (yearIndex * 3) + sectionIndex;

      days.forEach((day, dayIndex) => {
        const slots = (day === DayOfWeek.WEDNESDAY) ? wednesdaySlots : standardSlots;

        slots.forEach((startHour, slotIndex) => {
          // 1. Subject Selection
          // Ensure Section A, B, C of the same year get different subjects at the same time.
          // Using shift based on sectionIndex
          const subjectIndex = (slotIndex + sectionIndex + dayIndex) % subjects.length;
          const subject = subjects[subjectIndex];

          // 2. Room Selection
          // Ensure globally unique room for this time slot.
          // Offset based on groupIndex ensures uniqueness across all 15 concurrent groups.
          const roomIndex = (groupIndex + slotIndex + dayIndex) % ROOMS.length;
          const room = ROOMS[roomIndex];

          sessions.push({
            id: `y${year}-${section}-${day}-${startHour}`,
            year: year,
            section: section,
            day: day,
            startMinutes: startHour * 60,
            durationMinutes: 60,
            subjectCode: subject.code,
            subjectName: subject.name,
            professor: subject.prof,
            room: room
          });
        });

      });
    });
  });

  return sessions;
};

export const MOCK_SESSIONS: ClassSession[] = generateSessions();
import { User, TimetableSession, DayOfWeek } from "../domain/types";

// Seed Data
const ADMIN_USER: User = {
  id: 'admin-001',
  email: 'admin@uni.edu',
  name: 'Academic Registrar',
  role: 'ADMIN'
};

const INITIAL_SESSIONS: TimetableSession[] = [
  {
    id: '1',
    subject: 'Computer Science 101',
    professor: 'Dr. Turing',
    room: 'Lab A',
    day: DayOfWeek.MONDAY,
    startTime: '09:00',
    endTime: '11:00',
    yearGroup: 1
  }
];

// Initialize Storage if empty
const initStorage = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([ADMIN_USER]));
  }
  if (!localStorage.getItem('sessions')) {
    localStorage.setItem('sessions', JSON.stringify(INITIAL_SESSIONS));
  }
};

initStorage();

export const Storage = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem('users') || '[]'),
  
  saveUser: (user: User) => {
    const users = Storage.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },

  getSessions: (): TimetableSession[] => JSON.parse(localStorage.getItem('sessions') || '[]'),

  saveSession: (session: TimetableSession) => {
    const sessions = Storage.getSessions();
    sessions.push(session);
    localStorage.setItem('sessions', JSON.stringify(sessions));
  },

  deleteSession: (id: string) => {
    const sessions = Storage.getSessions().filter(s => s.id !== id);
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }
};
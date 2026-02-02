import { ClassSession } from "../domain/types";
import { MOCK_SESSIONS } from "./mockData";

const STORAGE_KEY = 'unisched_sessions';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    getSessions: async (): Promise<ClassSession[]> => {
        await delay(800);
        // Try to get from local storage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // If empty, seed with mock data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_SESSIONS));
        return MOCK_SESSIONS;
    },

    createSession: async (session: ClassSession): Promise<ClassSession> => {
        await delay(500);
        const stored = localStorage.getItem(STORAGE_KEY);
        const sessions = stored ? JSON.parse(stored) : MOCK_SESSIONS;
        const newSessions = [...sessions, session];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
        return session;
    },

    updateSession: async (session: ClassSession): Promise<ClassSession> => {
        await delay(500);
        const stored = localStorage.getItem(STORAGE_KEY);
        const sessions = stored ? JSON.parse(stored) : MOCK_SESSIONS;
        const newSessions = sessions.map((s: ClassSession) => s.id === session.id ? session : s);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
        return session;
    },

    deleteSession: async (id: string): Promise<void> => {
        await delay(500);
        const stored = localStorage.getItem(STORAGE_KEY);
        const sessions = stored ? JSON.parse(stored) : MOCK_SESSIONS;
        const newSessions = sessions.filter((s: ClassSession) => s.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    }
};

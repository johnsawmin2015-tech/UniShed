import { TimetableSession } from "../domain/types";
import { validateSession } from "../domain/rules";
import { Storage } from "../infrastructure/storage";

export const TimetableService = {
  getAllSessions: (): TimetableSession[] => {
    return Storage.getSessions();
  },

  addSession: (session: Omit<TimetableSession, 'id'>): { success: boolean; error?: string } => {
    const existing = Storage.getSessions();
    
    // Domain Validation
    const validation = validateSession(session, existing);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Persist
    const newSession: TimetableSession = {
      ...session,
      id: crypto.randomUUID()
    };
    Storage.saveSession(newSession);
    return { success: true };
  },

  deleteSession: (id: string) => {
    Storage.deleteSession(id);
  }
};
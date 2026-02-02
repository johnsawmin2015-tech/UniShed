import { User } from "../domain/types";
import { Storage } from "../infrastructure/storage";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  name: string;
  email: string;
}

// Pre-seeded admin user
const ADMIN_USER: User = {
  id: 'admin-001',
  email: 'admin@unisched.edu',
  name: 'Dr. Alexander Chen',
  role: 'ADMIN'
};

// Pre-seeded student user for demo
const DEMO_STUDENT: User = {
  id: 'student-001',
  email: 'student@uni.edu',
  name: 'Sarah Johnson',
  role: 'STUDENT'
};

export const AuthService = {
  login: async (creds: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));

    const email = creds.email.toLowerCase().trim();

    // Check for admin login
    if (email === ADMIN_USER.email.toLowerCase()) {
      localStorage.setItem('currentUser', JSON.stringify(ADMIN_USER));
      return { success: true, user: ADMIN_USER };
    }

    // Check for demo student
    if (email === DEMO_STUDENT.email.toLowerCase()) {
      localStorage.setItem('currentUser', JSON.stringify(DEMO_STUDENT));
      return { success: true, user: DEMO_STUDENT };
    }

    // Check stored users
    const users = Storage.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email);

    if (!user) {
      return { success: false, error: "Invalid credentials. Please check your email and password." };
    }

    // In production, verify password hash here
    // For demo, any password works if email matches

    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  },

  registerStudent: async (data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> => {
    await new Promise(r => setTimeout(r, 600));

    const email = data.email.toLowerCase().trim();

    // Check if admin email
    if (email === ADMIN_USER.email.toLowerCase()) {
      return { success: false, error: "This email is reserved for administrative use." };
    }

    const users = Storage.getUsers();
    if (users.find(u => u.email.toLowerCase() === email)) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name.trim(),
      email: email,
      role: 'STUDENT'
    };

    Storage.saveUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true, user: newUser };
  },

  logout: () => {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  },

  // Check if current user is admin
  isAdmin: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'ADMIN';
  },

  // Check if current user is student
  isStudent: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'STUDENT';
  },

  // Get admin user for display purposes
  getAdminInfo: () => ({
    email: ADMIN_USER.email,
    name: ADMIN_USER.name,
  }),
};
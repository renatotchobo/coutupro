import { User } from '../types';

const STORAGE_KEY = 'coutupro_users';
const CURRENT_USER_KEY = 'coutupro_current_user';
const USED_CODES_KEY = 'coutupro_used_codes';
const ACTIVE_SESSIONS_KEY = 'coutupro_active_sessions';

// Codes par défaut
const DEFAULT_CODES = {
  ADMIN123: { role: 'admin', name: 'Administrateur' },
  USER123: { role: 'user', name: 'Utilisateur Test' }
};

export class AuthService {
  private getBrowserId(): string {
    let browserId = localStorage.getItem('browser_id');
    if (!browserId) {
      browserId = crypto.randomUUID();
      localStorage.setItem('browser_id', browserId);
    }
    return browserId;
  }

  private getUsedCodes(): string[] {
    const stored = localStorage.getItem(USED_CODES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private addUsedCode(code: string): void {
    const usedCodes = this.getUsedCodes();
    if (!usedCodes.includes(code)) {
      usedCodes.push(code);
      localStorage.setItem(USED_CODES_KEY, JSON.stringify(usedCodes));
    }
  }

  private getActiveSessions(): { [code: string]: string } {
    const stored = localStorage.getItem(ACTIVE_SESSIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  private setActiveSession(code: string, browserId: string): void {
    const sessions = this.getActiveSessions();
    sessions[code] = browserId;
    localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));
  }

  private removeActiveSession(code: string): void {
    const sessions = this.getActiveSessions();
    delete sessions[code];
    localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions));
  }

  private getUsers(): User[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Initialiser avec les codes par défaut
      const defaultUsers: User[] = Object.entries(DEFAULT_CODES).map(([code, data]) => ({
        id: crypto.randomUUID(),
        code,
        role: data.role as 'admin' | 'user',
        name: data.name,
        isActive: true,
        createdAt: new Date().toISOString()
      }));
      this.saveUsers(defaultUsers);
      return defaultUsers;
    }
    return JSON.parse(stored);
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  login(code: string): User | null {
    const browserId = this.getBrowserId();
    const usedCodes = this.getUsedCodes();
    const activeSessions = this.getActiveSessions();
    
    // Check if code has been used (except for default codes)
    if (!Object.keys(DEFAULT_CODES).includes(code) && usedCodes.includes(code)) {
      return null; // Code already used
    }
    
    // Check if code is active in another browser
    if (activeSessions[code] && activeSessions[code] !== browserId) {
      return null; // Code active in another browser
    }
    
    const users = this.getUsers();
    const user = users.find(u => u.code === code && u.isActive);
    
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.saveUsers(users);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      // Mark code as used (except for default codes)
      if (!Object.keys(DEFAULT_CODES).includes(code)) {
        this.addUsedCode(code);
      }
      
      // Set active session
      this.setActiveSession(code, browserId);
      
      return user;
    }
    
    return null;
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  logout(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.removeActiveSession(currentUser.code);
    }
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  generateCode(): string {
    let code;
    const usedCodes = this.getUsedCodes();
    const existingCodes = this.getUsers().map(u => u.code);
    
    do {
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
    } while (usedCodes.includes(code) || existingCodes.includes(code));
    
    return code;
  }

  createUser(code: string, name: string, role: 'admin' | 'user' = 'user'): User {
    const users = this.getUsers();
    const newUser: User = {
      id: crypto.randomUUID(),
      code,
      role,
      name,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  getAllUsers(): User[] {
    return this.getUsers();
  }

  updateUser(id: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  }

  deleteUser(id: string): void {
    const users = this.getUsers();
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete) {
      this.removeActiveSession(userToDelete.code);
    }
    const filtered = users.filter(u => u.id !== id);
    this.saveUsers(filtered);
  }

  getUsedCodesCount(): number {
    return this.getUsedCodes().length;
  }

  getActiveSessionsCount(): number {
    return Object.keys(this.getActiveSessions()).length;
  }
}

export const authService = new AuthService();
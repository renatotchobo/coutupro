import { User } from '../types';

const STORAGE_KEY = 'coutupro_users';
const CURRENT_USER_KEY = 'coutupro_current_user';

// Codes par défaut
const DEFAULT_CODES = {
  ADMIN123: { role: 'admin', name: 'Administrateur' },
  USER123: { role: 'user', name: 'Utilisateur Test' }
};

export class AuthService {
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
    const users = this.getUsers();
    const user = users.find(u => u.code === code && u.isActive);
    
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.saveUsers(users);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    
    return null;
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  generateCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
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
    const filtered = users.filter(u => u.id !== id);
    this.saveUsers(filtered);
  }
}

export const authService = new AuthService();
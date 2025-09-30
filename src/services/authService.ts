import { User } from '../types';

const STORAGE_KEY = 'coutupro_users';
const CURRENT_USER_KEY = 'coutupro_current_user';
const USED_CODES_KEY = 'coutupro_used_codes';

// Codes par défaut
const DEFAULT_CODES = {
  ADMIN123: { role: 'admin', name: 'Administrateur' },
  USER123: { role: 'user', name: 'Utilisateur Test' }
};

export class AuthService {
  // Récupérer les utilisateurs depuis localStorage ou initialiser avec les codes par défaut
  private getUsers(): User[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
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

  // Connexion utilisateur (fonctionne sur tous les navigateurs)
  login(code: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.code === code && u.isActive);

    if (!user) return null;

    // Mettre à jour la date de dernier login
    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    // Marquer le code comme utilisé (sauf codes par défaut)
    if (!Object.keys(DEFAULT_CODES).includes(code)) {
      this.addUsedCode(code);
    }

    return user;
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  // Générer un code unique
  generateCode(): string {
    let code;
    const usedCodes = this.getUsedCodes();
    const existingCodes = this.getUsers().map(u => u.code);

    do {
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
    } while (usedCodes.includes(code) || existingCodes.includes(code));

    return code;
  }

  // Créer un utilisateur
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

  getUsedCodesCount(): number {
    return this.getUsedCodes().length;
  }
}

// Instance exportée
export const authService = new AuthService();

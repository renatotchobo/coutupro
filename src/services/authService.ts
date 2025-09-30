import { User } from '../types';

const STORAGE_KEY = 'coutupro_users';
const CURRENT_USER_KEY = 'coutupro_current_user';
const ACTIVE_SESSIONS_KEY = 'coutupro_active_sessions';

// Codes par défaut
const DEFAULT_CODES = {
  ADMIN123: { role: 'admin', name: 'Administrateur' },
  USER123: { role: 'user', name: 'Utilisateur Test' }
};

export class AuthService {
  // ID unique du navigateur/appareil
  private getBrowserId(): string {
    let browserId = localStorage.getItem('browser_id');
    if (!browserId) {
      browserId = crypto.randomUUID();
      localStorage.setItem('browser_id', browserId);
    }
    return browserId;
  }

  // Utilisateurs
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

  // Sessions actives
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

  // Connexion utilisateur
  login(code: string): User | null {
    const browserId = this.getBrowserId();
    const users = this.getUsers();
    const user = users.find(u => u.code === code && u.isActive);

    if (!user) return null;

    const activeSessions = this.getActiveSessions();

    // Vérifier si le code est déjà utilisé par un autre appareil
    if (activeSessions[code] && activeSessions[code] !== browserId) {
      return null; // Code occupé
    }

    // Connexion réussie
    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    // Marquer le code comme actif sur ce navigateur
    this.setActiveSession(code, browserId);

    return user;
  }

  // Déconnexion
  logout(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.removeActiveSession(currentUser.code);
    }
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Générer un code unique
  generateCode(): string {
    let code;
    const existingCodes = this.getUsers().map(u => u.code);

    do {
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
    } while (existingCodes.includes(code));

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

  // Modifier un utilisateur
  updateUser(id: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  }

  // Supprimer un utilisateur
  deleteUser(id: string): void {
    const users = this.getUsers();
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete) {
      this.removeActiveSession(userToDelete.code);
    }
    const filtered = users.filter(u => u.id !== id);
    this.saveUsers(filtered);
  }

  // Liste des utilisateurs
  getAllUsers(): User[] {
    return this.getUsers();
  }

  // Statistiques
  getActiveSessionsCount(): number {
    return Object.keys(this.getActiveSessions()).length;
  }
}

export const authService = new AuthService();

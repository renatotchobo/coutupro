import { User } from '../types';

const ADMIN_PASSWORD = 'TCBDEV2025';
const ADMIN_SESSION_KEY = 'coutupro_admin_session';
const USERS_KEY = 'coutupro_users';
const CODES_HISTORY_KEY = 'coutupro_codes_history';

export interface CodeHistory {
  id: string;
  code: string;
  userId: string;
  userName: string;
  generatedAt: string;
  isActive: boolean;
}

export class AdminService {
  // Admin Authentication
  authenticateAdmin(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      const session = {
        authenticated: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  isAdminAuthenticated(): boolean {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;
    
    try {
      const sessionData = JSON.parse(session);
      return sessionData.authenticated === true;
    } catch {
      return false;
    }
  }

  logoutAdmin(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  // User Management
  private getUsers(): User[] {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private getCodesHistory(): CodeHistory[] {
    const stored = localStorage.getItem(CODES_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCodesHistory(history: CodeHistory[]): void {
    localStorage.setItem(CODES_HISTORY_KEY, JSON.stringify(history));
  }

  getAllUsers(): User[] {
    return this.getUsers();
  }

  createUser(userData: {
    name: string;
    phone?: string;
    address?: string;
    role: 'admin' | 'user';
  }): { user: User; code: string } {
    const users = this.getUsers();
    const code = this.generateUniqueCode();
    
    const newUser: User = {
      id: crypto.randomUUID(),
      code,
      role: userData.role,
      name: userData.name,
      phone: userData.phone,
      address: userData.address,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    // Add to codes history
    const history = this.getCodesHistory();
    history.push({
      id: crypto.randomUUID(),
      code,
      userId: newUser.id,
      userName: newUser.name,
      generatedAt: new Date().toISOString(),
      isActive: true
    });
    this.saveCodesHistory(history);

    return { user: newUser, code };
  }

  updateUser(userId: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  }

  deleteUser(userId: string): void {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      // Mark code as inactive in history
      const history = this.getCodesHistory();
      const codeEntry = history.find(h => h.userId === userId);
      if (codeEntry) {
        codeEntry.isActive = false;
        this.saveCodesHistory(history);
      }
    }
    
    const filtered = users.filter(u => u.id !== userId);
    this.saveUsers(filtered);
  }

  resetUserCode(userId: string): string {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    // Mark old code as inactive
    const history = this.getCodesHistory();
    const oldCodeEntry = history.find(h => h.userId === userId && h.isActive);
    if (oldCodeEntry) {
      oldCodeEntry.isActive = false;
    }

    // Generate new code
    const newCode = this.generateUniqueCode();
    user.code = newCode;
    this.saveUsers(users);

    // Add new code to history
    history.push({
      id: crypto.randomUUID(),
      code: newCode,
      userId: user.id,
      userName: user.name,
      generatedAt: new Date().toISOString(),
      isActive: true
    });
    this.saveCodesHistory(history);

    return newCode;
  }

  private generateUniqueCode(): string {
    let code;
    const existingCodes = this.getUsers().map(u => u.code);
    
    do {
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
    } while (existingCodes.includes(code));
    
    return code;
  }

  // Authentication for regular users
  authenticateUser(code: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.code === code && u.isActive);
    
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.saveUsers(users);
      return user;
    }
    
    return null;
  }

  // Statistics
  getStats() {
    const users = this.getUsers();
    const history = this.getCodesHistory();
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      regularUsers: users.filter(u => u.role === 'user').length,
      totalCodes: history.length,
      activeCodes: history.filter(h => h.isActive).length,
      recentLogins: users.filter(u => u.lastLogin).length
    };
  }

  getCodesHistoryData(): CodeHistory[] {
    return this.getCodesHistory().sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }

  // Export functionality
  exportUsersCSV(): string {
    const users = this.getUsers();
    const header = 'Nom,Code,Rôle,Téléphone,Adresse,Statut,Date de création,Dernière connexion\n';
    
    const rows = users.map(user => [
      user.name,
      user.code,
      user.role === 'admin' ? 'Administrateur' : 'Utilisateur',
      user.phone || '',
      user.address || '',
      user.isActive ? 'Actif' : 'Inactif',
      new Date(user.createdAt).toLocaleDateString('fr-FR'),
      user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'
    ].join(','));

    return header + rows.join('\n');
  }
}

export const adminService = new AdminService();
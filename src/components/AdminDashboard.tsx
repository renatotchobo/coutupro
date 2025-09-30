import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Key, Activity, Plus, Edit3, Trash2, 
  Copy, Download, RefreshCw, LogOut, Eye, EyeOff,
  UserPlus, Settings, BarChart3, Clock, CheckCircle
} from 'lucide-react';
import { adminService, CodeHistory } from '../services/adminService';
import { User } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [codesHistory, setCodesHistory] = useState<CodeHistory[]>([]);
  const [stats, setStats] = useState<any>({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    role: 'user' as 'admin' | 'user'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(adminService.getAllUsers());
    setCodesHistory(adminService.getCodesHistoryData());
    setStats(adminService.getStats());
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', address: '', role: 'user' });
    setShowAddForm(false);
    setEditingUser(null);
  };

  const handleCreateUser = () => {
    if (!formData.name.trim()) {
      alert('Le nom est requis');
      return;
    }

    try {
      const { user, code } = adminService.createUser(formData);
      loadData();
      resetForm();
      alert(`Utilisateur créé avec succès!\nCode d'accès: ${code}\n\nCe code peut être utilisé sur tous les appareils.`);
    } catch (error) {
      alert('Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role
    });
    setShowAddForm(true);
  };

  const handleUpdateUser = () => {
    if (!editingUser || !formData.name.trim()) {
      alert('Le nom est requis');
      return;
    }

    adminService.updateUser(editingUser.id, formData);
    loadData();
    resetForm();
    alert('Utilisateur mis à jour avec succès!');
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur? Cette action est irréversible.')) {
      adminService.deleteUser(userId);
      loadData();
      alert('Utilisateur supprimé avec succès');
    }
  };

  const handleResetCode = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le code de cet utilisateur?')) {
      try {
        const newCode = adminService.resetUserCode(userId);
        loadData();
        alert(`Nouveau code généré: ${newCode}\n\nL'ancien code a été désactivé.`);
      } catch (error) {
        alert('Erreur lors de la réinitialisation du code');
      }
    }
  };

  const toggleUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      adminService.updateUser(userId, { isActive: !user.isActive });
      loadData();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Code copié dans le presse-papiers!');
  };

  const exportUsers = () => {
    const csvContent = adminService.exportUsersCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coutupro-users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      adminService.logoutAdmin();
      onLogout();
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'codes', label: 'Codes', icon: Key },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0A3764] text-white px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Administration COUTUPRO</h1>
              <p className="text-white/80 text-sm">Gestion des utilisateurs et codes</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#0A3764] text-[#0A3764] bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Codes Générés</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalCodes}</p>
                  </div>
                  <Key className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.adminUsers}</p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#0A3764] text-white p-4 rounded-lg hover:bg-[#195885] transition-colors flex items-center space-x-2"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Ajouter utilisateur</span>
                </button>
                <button
                  onClick={exportUsers}
                  className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Exporter CSV</span>
                </button>
                <button
                  onClick={loadData}
                  className="bg-gray-500 text-white p-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Actualiser</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité récente</h3>
              <div className="space-y-3">
                {codesHistory.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${entry.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium text-gray-800">{entry.userName}</p>
                        <p className="text-sm text-gray-600">Code: {entry.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(entry.generatedAt).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.generatedAt).toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Gestion des utilisateurs</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-[#0A3764] text-white px-4 py-2 rounded-lg hover:bg-[#195885] transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter</span>
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                  </h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                      placeholder="+229 XX XX XX XX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rôle
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                      placeholder="Adresse complète"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={editingUser ? handleUpdateUser : handleCreateUser}
                    className="flex-1 bg-[#0A3764] text-white py-3 px-4 rounded-lg hover:bg-[#195885] transition-colors"
                  >
                    {editingUser ? 'Mettre à jour' : 'Créer l\'utilisateur'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Users List */}
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <h4 className="font-semibold text-gray-800">{user.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Code: <strong>{user.code}</strong></span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </div>
                        {user.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(user.code)}
                        className="p-2 text-gray-600 hover:text-[#0A3764] transition-colors"
                        title="Copier le code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleResetCode(user.id)}
                        className="p-2 text-orange-600 hover:text-orange-800 transition-colors"
                        title="Réinitialiser le code"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 transition-colors ${
                          user.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                        title={user.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Codes Tab */}
        {activeTab === 'codes' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Historique des codes</h2>
            
            <div className="space-y-3">
              {codesHistory.map((entry) => (
                <div key={entry.id} className="bg-white rounded-xl p-4 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${entry.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <h4 className="font-semibold text-gray-800">{entry.userName}</h4>
                        <p className="text-sm text-gray-600">Code: <strong>{entry.code}</strong></p>
                        <p className="text-xs text-gray-500">
                          Généré le {new Date(entry.generatedAt).toLocaleDateString('fr-FR')} à {new Date(entry.generatedAt).toLocaleTimeString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entry.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(entry.code)}
                        className="p-2 text-gray-600 hover:text-[#0A3764] transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Paramètres système</h2>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Exportation des données</h3>
              <p className="text-gray-600 mb-4">
                Exportez la liste complète des utilisateurs et leurs codes d'accès au format CSV.
              </p>
              <button
                onClick={exportUsers}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Exporter les utilisateurs (CSV)</span>
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations système</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">COUTUPRO v2.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mot de passe admin:</span>
                  <span className="font-medium">TCBDEV2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Codes universels:</span>
                  <span className="font-medium">Oui (tous appareils)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Développeur:</span>
                  <span className="font-medium">Rénato TCHOBO</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
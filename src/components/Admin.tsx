import React, { useState, useEffect } from 'react';
import { Shield, Users, Key, Plus, Copy, Trash2, CheckCircle, XCircle, Download, Calendar, Eye, EyeOff, CreditCard as Edit3, Save, X, UserPlus, Activity, Globe, Clock } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [newUserData, setNewUserData] = useState({
    name: '',
    role: 'user' as 'admin' | 'user',
    address: '',
    phone: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(authService.getAllUsers());
  };

  const generateNewCode = () => {
    const code = authService.generateCode();
    setGeneratedCode(code);
    return code;
  };

  const handleCreateUser = () => {
    if (!newUserData.name) {
      alert('Veuillez entrer un nom');
      return;
    }

    const code = generatedCode || generateNewCode();
    const user = authService.createUser(code, newUserData.name, newUserData.role);
    
    // Update user with additional info
    if (newUserData.address || newUserData.phone) {
      authService.updateUser(user.id, {
        address: newUserData.address,
        phone: newUserData.phone
      });
    }
    
    setNewUserData({ name: '', role: 'user', address: '', phone: '' });
    setGeneratedCode('');
    setShowAddUserForm(false);
    loadUsers();
    alert(`Utilisateur créé avec le code: ${code}`);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUserData({
      name: user.name,
      role: user.role,
      address: (user as any).address || '',
      phone: (user as any).phone || ''
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser || !newUserData.name) {
      alert('Veuillez entrer un nom');
      return;
    }

    authService.updateUser(editingUser.id, {
      name: newUserData.name,
      role: newUserData.role,
      address: newUserData.address,
      phone: newUserData.phone
    });

    setEditingUser(null);
    setNewUserData({ name: '', role: 'user', address: '', phone: '' });
    loadUsers();
    alert('Utilisateur mis à jour avec succès!');
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setShowAddUserForm(false);
    setNewUserData({ name: '', role: 'user', address: '', phone: '' });
    setGeneratedCode('');
  };

  const toggleUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      authService.updateUser(userId, { isActive: !user.isActive });
      loadUsers();
    }
  };

  const deleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      authService.deleteUser(userId);
      loadUsers();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Code copié dans le presse-papiers!');
  };

  const exportCodes = () => {
    const csvContent = "Nom,Code,Rôle,Statut,Date de création\n" +
      users.map(user => 
        `${user.name},${user.code},${user.role},${user.isActive ? 'Actif' : 'Inactif'},${new Date(user.createdAt).toLocaleDateString('fr-FR')}`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codes-acces-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeUsers = users.filter(u => u.isActive).length;
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const usedCodesCount = authService.getUsedCodesCount();
  const activeSessionsCount = authService.getActiveSessionsCount();

  return (
    <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-1">Administration</h1>
          <p className="text-gray-500 text-sm">Gestion des utilisateurs et codes d'accès</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
              <p className="text-lg font-semibold text-gray-900">{totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Actifs</p>
              <p className="text-lg font-semibold text-gray-900">{activeUsers}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sessions</p>
              <p className="text-lg font-semibold text-gray-900">{activeSessionsCount}</p>
            </div>
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Codes utilisés</p>
              <p className="text-lg font-semibold text-gray-900">{usedCodesCount}</p>
            </div>
            <Key className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowAddUserForm(true)}
          className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span className="text-sm font-medium">Ajouter</span>
        </button>
        <button
          onClick={exportCodes}
          className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Exporter</span>
        </button>
      </div>

      {/* Add/Edit User Form */}
      {(showAddUserForm || editingUser) && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
            </h3>
            <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'utilisateur
              </label>
              <input
                type="text"
                value={newUserData.name}
                onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Ex: Jean Dupont"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({...newUserData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="+229 XX XX XX XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({...newUserData, role: e.target.value as any})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <textarea
                value={newUserData.address}
                onChange={(e) => setNewUserData({...newUserData, address: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                rows={2}
                placeholder="Adresse complète"
              />
            </div>

            {/* Generate Code - Only for new users */}
            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code d'accès
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={generatedCode}
                    onChange={(e) => setGeneratedCode(e.target.value)}
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Générer automatiquement"
                  />
                  <button
                    onClick={generateNewCode}
                    className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Key className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingUser ? 'Mettre à jour' : 'Créer l\'utilisateur'}</span>
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-3">Liste des utilisateurs</h3>
        
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      user.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-800">{user.name}</h4>
                      <p className="text-sm text-gray-600">
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </p>
                      {(user as any).phone && (
                        <p className="text-xs text-gray-500">{(user as any).phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-4">
                    <span>Code: <strong className="text-gray-800">{user.code}</strong></span>
                    <button
                      onClick={() => copyToClipboard(user.code)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>Créé le: {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                  {user.lastLogin && (
                    <span>Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                      user.isActive
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="text-xs">{user.isActive ? 'Désactiver' : 'Activer'}</span>
                  </button>
                  
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          Conçu par <span className="font-semibold">Rénato TCHOBO</span> — Version 1.0
        </p>
      </div>
    </div>
  );
}
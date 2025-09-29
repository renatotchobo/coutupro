import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Key, Plus, Copy, Trash2, CheckCircle, XCircle,
  Download, Calendar, Eye, EyeOff
} from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [newUserData, setNewUserData] = useState({
    name: '',
    role: 'user' as 'admin' | 'user'
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
    authService.createUser(code, newUserData.name, newUserData.role);
    
    setNewUserData({ name: '', role: 'user' });
    setGeneratedCode('');
    setShowAddUserForm(false);
    loadUsers();
    alert(`Utilisateur créé avec le code: ${code}`);
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

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-[#0A3764] rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Administration</h1>
        <p className="text-gray-600">Gestion des utilisateurs et codes d'accès</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-blue-600">Total</p>
          <p className="text-xl font-bold text-blue-800">{totalUsers}</p>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-green-600">Actifs</p>
          <p className="text-xl font-bold text-green-800">{activeUsers}</p>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 text-center">
          <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-sm text-purple-600">Admins</p>
          <p className="text-xl font-bold text-purple-800">{adminUsers}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowAddUserForm(true)}
          className="bg-[#0A3764] text-white p-3 rounded-lg hover:bg-[#195885] transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Ajouter utilisateur</span>
        </button>
        <button
          onClick={exportCodes}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Exporter CSV</span>
        </button>
      </div>

      {/* Add User Form */}
      {showAddUserForm && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Créer un nouvel utilisateur</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'utilisateur
              </label>
              <input
                type="text"
                value={newUserData.name}
                onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                placeholder="Ex: Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <select
                value={newUserData.role}
                onChange={(e) => setNewUserData({...newUserData, role: e.target.value as any})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            {/* Generate Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code d'accès
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={generatedCode}
                  onChange={(e) => setGeneratedCode(e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
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

            <div className="flex space-x-3">
              <button
                onClick={handleCreateUser}
                className="flex-1 bg-[#0A3764] text-white py-3 px-4 rounded-lg hover:bg-[#195885] transition-colors"
              >
                Créer l'utilisateur
              </button>
              <button
                onClick={() => setShowAddUserForm(false)}
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Liste des utilisateurs</h3>
        
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      user.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <h4 className="font-semibold text-gray-800">{user.name}</h4>
                      <p className="text-sm text-gray-600">
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </p>
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

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-4">
                    <span>Code: <strong className="text-gray-800">{user.code}</strong></span>
                    <button
                      onClick={() => copyToClipboard(user.code)}
                      className="text-[#0A3764] hover:text-[#195885]"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Créé le: {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                  {user.lastLogin && (
                    <span>Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1 ${
                      user.isActive
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{user.isActive ? 'Désactiver' : 'Activer'}</span>
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
      <div className="text-center pt-6 border-t-2 border-gray-200">
        <p className="text-gray-600 text-sm">
          Conçu par <span className="font-semibold">Rénato TCHOBO</span> — Version 1.0
        </p>
      </div>
    </div>
  );
}
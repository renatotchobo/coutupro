import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Palette, Wrench, LogOut, Download, RotateCcw, 
  Trash2, MapPin, Phone, Hash, Building, Camera, Save
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { WorkshopProfile, AppSettings } from '../types';

interface SettingsProps {
  onLogout: () => void;
}

export default function Settings({ onLogout }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('notifications');
  const [profile, setProfile] = useState<WorkshopProfile>({
    name: 'Mon Atelier',
    phone: '',
    ifu: '',
    location: ''
  });
  const [settings, setSettings] = useState<AppSettings>({
    primaryColor: '#0A3764',
    secondaryColor: '#195885',
    notifications: {
      orderDeadlines: true,
      deliveryReminders: true,
      paymentReminders: true
    }
  });

  useEffect(() => {
    setProfile(dataService.getWorkshopProfile());
    setSettings(dataService.getAppSettings());
  }, []);

  const handleProfileSave = () => {
    dataService.saveWorkshopProfile(profile);
    alert('Profil sauvegardé!');
  };

  const handleSettingsSave = () => {
    dataService.saveAppSettings(settings);
    alert('Paramètres sauvegardés!');
  };

  const handleExportData = () => {
    const data = dataService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coutupro-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('⚠️ Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible !')) {
      dataService.resetData();
      alert('Données réinitialisées!');
      window.location.reload();
    }
  };

  const colorPresets = [
    { name: 'Bleu Océan (Défaut)', primary: '#0A3764', secondary: '#195885' },
    { name: 'Vert Émeraude', primary: '#047857', secondary: '#059669' },
    { name: 'Violet Royal', primary: '#7C3AED', secondary: '#8B5CF6' },
    { name: 'Rouge Cardinal', primary: '#DC2626', secondary: '#EF4444' },
    { name: 'Orange Sunset', primary: '#EA580C', secondary: '#F97316' },
    { name: 'Rose Élégant', primary: '#DB2777', secondary: '#EC4899' }
  ];

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profil Atelier', icon: Building },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench }
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
        <p className="text-gray-600">Personnalisez votre application</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0A3764] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Configuration des notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">Alertes de délai</h3>
                  <p className="text-sm text-gray-600">Notifications pour les commandes proches de la date de livraison</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.orderDeadlines}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        orderDeadlines: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A3764]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">Rappels de livraison</h3>
                  <p className="text-sm text-gray-600">Rappels pour les livraisons prévues</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.deliveryReminders}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        deliveryReminders: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A3764]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800">Rappels de paiement</h3>
                  <p className="text-sm text-gray-600">Notifications pour les soldes en attente</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.paymentReminders}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        paymentReminders: e.target.checked
                      }
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A3764]"></div>
                </label>
              </div>

              <button
                onClick={handleSettingsSave}
                className="w-full bg-[#0A3764] text-white py-3 px-4 rounded-lg hover:bg-[#195885] transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Sauvegarder</span>
              </button>
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Profil de l'atelier</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'atelier
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                  placeholder="Ex: Atelier Couture Élégance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFU (Numéro d'identification fiscale)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profile.ifu}
                    onChange={(e) => setProfile(prev => ({ ...prev, ifu: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                    placeholder="Ex: 3202100123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                    placeholder="Ex: Cotonou, Bénin"
                  />
                </div>
              </div>

              <button
                onClick={handleProfileSave}
                className="w-full bg-[#0A3764] text-white py-3 px-4 rounded-lg hover:bg-[#195885] transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Sauvegarder le profil</span>
              </button>
            </div>
          </div>
        )}

        {/* Appearance */}
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Personnalisation de l'apparence</h2>
            
            <div className="space-y-6">
              {/* Color Presets */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Thèmes prédéfinis</h3>
                <div className="space-y-2">
                  {colorPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary
                      }))}
                      className={`w-full flex items-center space-x-3 p-3 border-2 rounded-lg transition-colors ${
                        settings.primaryColor === preset.primary
                          ? 'border-[#0A3764] bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex space-x-1">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="text-sm font-medium">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Couleurs personnalisées</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur primaire
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-12 h-10 border-2 border-gray-200 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Couleur secondaire
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-12 h-10 border-2 border-gray-200 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1 p-2 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSettingsSave}
                className="w-full bg-[#0A3764] text-white py-3 px-4 rounded-lg hover:bg-[#195885] transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Appliquer les couleurs</span>
              </button>
            </div>
          </div>
        )}

        {/* Maintenance */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Maintenance & Données</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Sauvegarder les données</h3>
                <p className="text-sm text-green-700 mb-3">
                  Exportez toutes vos données (clients, commandes, mesures) au format JSON.
                </p>
                <button
                  onClick={handleExportData}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter les données</span>
                </button>
              </div>

              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">Zone dangereuse</h3>
                <p className="text-sm text-red-700 mb-3">
                  ⚠️ Ces actions sont irréversibles. Assurez-vous d'avoir sauvegardé vos données.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleResetData}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Réinitialiser toutes les données</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Déconnexion</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Se déconnecter de l'application et retourner à l'écran de connexion.
                </p>
                <button
                  onClick={onLogout}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t-2 border-gray-200 text-center">
        <p className="text-gray-600 text-sm">
          Conçu par <span className="font-semibold">Rénato TCHOBO</span> — Version 1.0
        </p>
      </div>
    </div>
  );
}
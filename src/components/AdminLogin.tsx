import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { adminService } from '../services/adminService';

interface AdminLoginProps {
  onAuthenticated: () => void;
}

export default function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isAuthenticated = adminService.authenticateAdmin(password);
      if (isAuthenticated) {
        onAuthenticated();
      } else {
        setError('Mot de passe incorrect. Accès refusé.');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A3764] to-[#195885] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-[#0A3764]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Administration</h1>
          <p className="text-white/80">COUTUPRO - Accès sécurisé</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-[#0A3764] mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-800">
              Authentification requise
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Entrez le mot de passe administrateur
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none transition-colors"
                  placeholder="Mot de passe sécurisé"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A3764] text-white py-3 px-4 rounded-lg hover:bg-[#195885] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Accéder à l'administration</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lock className="w-4 h-4" />
              <span>Accès protégé par mot de passe unique</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/70 text-sm">
          <p>COUTUPRO Administration — Version 2.0</p>
          <p className="mt-1">Conçu par Rénato TCHOBO</p>
        </div>
      </div>
    </div>
  );
}
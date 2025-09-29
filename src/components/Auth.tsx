import React, { useState } from 'react';
import { LogIn, Lock } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = authService.login(code.toUpperCase());
      if (user) {
        onLogin(user);
      } else {
        setError('Code d\'autorisation invalide');
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
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-[#0A3764]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">COUTUPRO</h1>
          <p className="text-white/80">Gestion pour Stylistes & Couturiers</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Connexion
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Code d'autorisation
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none transition-colors"
                placeholder="Entrez votre code"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
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
                  <LogIn className="w-5 h-5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Test Codes Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium text-gray-700 mb-2"></p>
            <p className="text-gray-600">• <code className="bg-white px-2 py-1 rounded">ADMIN123</code> - Administrateur</p>
            <p className="text-gray-600">• <code className="bg-white px-2 py-1 rounded">USER123</code> - Utilisateur</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/70 text-sm">
          <p>Conçu par Rénato TCHOBO — Version 1.0</p>
        </div>
      </div>
    </div>
  );
}
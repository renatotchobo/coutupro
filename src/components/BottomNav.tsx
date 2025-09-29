import React from 'react';
import { Home, Users, Package, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Accueil', icon: Home },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'orders', label: 'Commandes', icon: Package },
  { id: 'settings', label: 'Paramètres', icon: Settings }
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A3764] text-white border-t-2 border-[#0A3764] px-4 py-2 z-50">

      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 ${
  isActive
    ? 'text-[#0A3764] bg-white scale-110'   // actif = texte bleu + fond blanc
    : 'text-white hover:text-gray-200'      // inactif = texte blanc
}`}

            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
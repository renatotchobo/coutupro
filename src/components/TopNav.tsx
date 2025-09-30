import React from 'react';
import { User, Menu, Building } from 'lucide-react';
import { dataService } from '../services/dataService';

interface TopNavProps {
  title: string;
  showProfile?: boolean;
  onMenuClick?: () => void;
  showWorkshopInfo?: boolean;
}

export default function TopNav({ title, showProfile = false, onMenuClick, showWorkshopInfo = false }: TopNavProps) {
  const workshopProfile = dataService.getWorkshopProfile();
  const showWorkshop = showWorkshopInfo && workshopProfile.name && workshopProfile.name !== 'Mon Atelier';

  return (
    <div className="bg-[#0A3764] border-b border-gray-200 text-white px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-[#0C467F] transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        )}
        {showWorkshop ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Building className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">{workshopProfile.name}</h1>
              <p className="text-xs text-gray-200">{title}</p>
            </div>
          </div>
        ) : (
          <h1 className="text-lg font-medium text-white">{title}</h1>
        )}
      </div>
      
      {showProfile && (
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

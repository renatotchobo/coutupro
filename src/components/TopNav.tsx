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
    <div className="bg-white border-b border-gray-200 text-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {showWorkshop ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Building className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-800">{workshopProfile.name}</h1>
              <p className="text-xs text-gray-500">{title}</p>
            </div>
          </div>
        ) : (
          <h1 className="text-lg font-medium">{title}</h1>
        )}
      </div>
      
      {showProfile && (
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      )}
    </div>
  );
}
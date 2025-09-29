import React from 'react';
import { User, Menu } from 'lucide-react';

interface TopNavProps {
  title: string;
  showProfile?: boolean;
  onMenuClick?: () => void;
}

export default function TopNav({ title, showProfile = false, onMenuClick }: TopNavProps) {
  return (
    <div className="bg-[#0A3764] text-white px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      {showProfile && (
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Intro from './components/Intro';
import Dashboard from './components/Dashboard';
import Clients from './components/Clients';
import Orders from './components/Orders';
import Measurements from './components/Measurements';
import Settings from './components/Settings';
import Admin from './components/Admin';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import { authService } from './services/authService';
import { dataService } from './services/dataService';
import { User } from './types';

type AppState = 'auth' | 'intro' | 'main' | 'admin';

function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [measurementProps, setMeasurementProps] = useState<any>({});

  useEffect(() => {
    // Check for existing user session
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      if (user.role === 'admin') {
        setAppState('admin');
      } else {
        setAppState('main'); // Skip intro if user is already logged in
      }
    }

    // Apply saved color settings
    const settings = dataService.getAppSettings();
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);

    // Listen for navigation events from components
    const handleNavigation = (event: any) => {
      const { detail } = event;
      if (detail === 'measurements') {
        setActiveTab('measurements');
        setMeasurementProps({
          selectedClient: event.clientData,
          selectedOrder: event.orderData
        });
      } else {
        setActiveTab(detail);
        setMeasurementProps({});
      }
    };

    window.addEventListener('navigate', handleNavigation);
    return () => window.removeEventListener('navigate', handleNavigation);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setAppState('admin');
    } else {
      setAppState('intro');
    }
  };

  const handleIntroComplete = () => {
    setAppState('main');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAppState('auth');
    setActiveTab('dashboard');
    setMeasurementProps({});
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tableau de bord';
      case 'clients':
        return 'Clients';
      case 'orders':
        return 'Commandes';
      case 'measurements':
        return 'Mesures';
      case 'settings':
        return 'Paramètres';
      default:
        return 'COUTUPRO';
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <Clients />;
      case 'orders':
        return <Orders />;
      case 'measurements':
        return <Measurements {...measurementProps} />;
      case 'settings':
        return <Settings onLogout={handleLogout} />;
      default:
        return <Dashboard />;
    }
  };

  // Auth State
  if (appState === 'auth') {
    return <Auth onLogin={handleLogin} />;
  }

  // Intro State
  if (appState === 'intro') {
    return <Intro onComplete={handleIntroComplete} />;
  }

  // Admin State
  if (appState === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <TopNav 
          title="Administration" 
          showProfile 
        />
        <div className="flex-1 overflow-y-auto">
          <Admin />
        </div>
        <div className="p-4 bg-white border-t text-center">
          <button
            onClick={handleLogout}
            className="text-[#0A3764] hover:text-[#195885] font-medium"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  // Main App State
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TopNav 
        title={getPageTitle()} 
        showProfile 
      />
      
      <div className="flex-1 overflow-y-auto pb-20">
        {renderMainContent()}
      </div>
      
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
}

export default App;
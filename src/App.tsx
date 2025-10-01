import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Intro from './components/Intro';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Clients from './components/Clients';
import Orders from './components/Orders';
import Measurements from './components/Measurements';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import { adminService } from './services/adminService';
import { dataService } from './services/dataService';
import { User } from './types';

type AppState = 'auth' | 'intro' | 'main' | 'admin-login' | 'admin';

function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [measurementProps, setMeasurementProps] = useState<any>({});

  useEffect(() => {
    // Check URL for admin route
    if (window.location.pathname === '/admin') {
      if (adminService.isAdminAuthenticated()) {
        setAppState('admin');
      } else {
        setAppState('admin-login');
      }
      return;
    }

    // Regular app flow - no persistent sessions for users
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
    setAppState('intro');
  };

  const handleIntroComplete = () => {
    setAppState('main');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAppState('auth');
    setActiveTab('dashboard');
    setMeasurementProps({});
  };

  const handleAdminAuthenticated = () => {
    setAppState('admin');
  };

  const handleAdminLogout = () => {
    adminService.logoutAdmin();
    setAppState('admin-login');
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

  // Admin Login State
  if (appState === 'admin-login') {
    return <AdminLogin onAuthenticated={handleAdminAuthenticated} />;
  }

  // Admin State
  if (appState === 'admin') {
    return <AdminDashboard onLogout={handleAdminLogout} />;
    // Check if user wants to access admin panel
    if (window.location.pathname === '/admin') {
      return <AdminPanel />;
    }
    return <Dashboard />;

  // Main App State
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TopNav 
        title={getPageTitle()}
        showWorkshopInfo={activeTab === 'dashboard'}
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
import React, { useEffect, useState } from 'react';
import { Users, Package, DollarSign, Clock, UserPlus, Ruler } from 'lucide-react';
import { dataService } from '../services/dataService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    clientsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const newStats = dataService.getStats();
    setStats(newStats);
    
    // Charger les commandes récentes
    const orders = dataService.getOrders();
    const clients = dataService.getClients();
    
    const ordersWithClients = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map(order => ({
        ...order,
        clientName: clients.find(c => c.id === order.clientId)?.firstName + ' ' + 
                   clients.find(c => c.id === order.clientId)?.lastName
      }));
    
    setRecentOrders(ordersWithClients);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const statCards = [
    {
      title: 'Clients',
      value: stats.clientsCount,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Commandes',
      value: stats.ordersCount,
      icon: Package,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Chiffre d\'affaires',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'En cours',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const quickActions = [
    {
      title: 'Voir clients',
      color: 'bg-green-500 hover:bg-green-600',
      icon: Users,
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'clients' }))
    },
    {
      title: 'Ajouter client',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      icon: UserPlus,
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'clients' }))
    },
    {
      title: 'Prendre mesure',
      color: 'bg-red-500 hover:bg-red-600',
      icon: Ruler,
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'measurements' }))
    },
    {
      title: 'Voir commandes',
      color: 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300',
      icon: Package,
      action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'orders' }))
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`${card.bgColor} border-2 border-gray-200 rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Actions rapides</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center space-y-2 transition-colors`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Commandes récentes</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{order.title}</h3>
                    <p className="text-sm text-gray-600">{order.clientName}</p>
                    <p className="text-sm text-gray-500">
                      Livraison: {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatPrice(order.totalAmount)}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Livrée' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { Users, Package, DollarSign, Clock, UserPlus, Ruler } from 'lucide-react';
import { dataService } from '../services/dataService';

// Liste de 10 images en ligne pour le carrousel
const bannerImages = [
  "https://i.ibb.co/FkqKDSXX/c4f9aea3d2ffc0aa0795c3d3fb6af2ef.jpg",
  "https://i.ibb.co/nqFqGY73/b1fd7a067e350e44a0967e474f13cd63.jpg",
  "https://i.ibb.co/yFtjYsyV/5c9d1d906f100a6736f1ce2eb92b63aa.jpg",
  "https://i.ibb.co/67S1bCwx/9284310b66f4dec745fcaa46762298d4.jpg",
  "https://i.ibb.co/XrLXmcQP/a77c81bc7bebde235ba9c5e066cc9847.jpg",
  "https://i.ibb.co/mFb2970M/81f7dc9c4245ca02578603359ed982a4.jpg",
  "https://i.ibb.co/prx9xvLJ/05828a972eb16664c80ece88eaa77405.jpg",
  "https://i.ibb.co/0pK1x7Pz/e396eb0d4d85b18fa76c38ebd1aabb49.jpg",
  "https://i.ibb.co/3yfsYzSQ/a18c4faa8898797d2daa92e63e47861b.jpg",
  "https://i.ibb.co/BKNjQDPX/00b0879e255400ef2ed1f3563faad69a.jpg"
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    clientsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  // Pour la modale "Voir mesures"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    loadStats();

    // Charger tous les clients pour le bouton "Voir mesures"
    const allClients = dataService.getClients();
    setClients(allClients);
  }, []);

  // Carrousel auto-défilant
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    const newStats = dataService.getStats();
    setStats(newStats);

    const orders = dataService.getOrders();
    const clientsList = dataService.getClients();

    const ordersWithClients = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map(order => ({
        ...order,
        clientName: clientsList.find(c => c.id === order.clientId)?.firstName + ' ' + 
                   clientsList.find(c => c.id === order.clientId)?.lastName
      }));

    setRecentOrders(ordersWithClients);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const statCards = [
    { title: 'Clients', value: stats.clientsCount, icon: Users, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { title: 'Commandes', value: stats.ordersCount, icon: Package, color: 'bg-green-500', bgColor: 'bg-green-50' },
    { title: "Chiffre d'affaires", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
    { title: 'En cours', value: stats.pendingOrders, icon: Clock, color: 'bg-orange-500', bgColor: 'bg-orange-50' }
  ];

  const quickActions = [
    { title: 'Voir clients', color: 'bg-green-500 hover:bg-green-600', icon: Users, action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'clients' })) },
    { title: 'Ajouter client', color: 'bg-yellow-500 hover:bg-yellow-600', icon: UserPlus, action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'clients' })) },
    { title: 'Voir mesures', color: 'bg-red-500 hover:bg-red-600', icon: Ruler, action: () => setIsModalOpen(true) },
    { title: 'Voir commandes', color: 'bg-blue-500 hover:bg-blue-600 text-white', icon: Package, action: () => window.dispatchEvent(new CustomEvent('navigate', { detail: 'orders' })) }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Bannière Carrousel */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-md">
        {bannerImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Bannière ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

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

      {/* Modale Voir Mesures */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Choisir un client</h2>
            <ul className="space-y-2 max-h-64 overflow-y-auto border-t border-b border-gray-200 py-2">
              {clients.map((client) => (
                <li key={client.id}>
                  <button
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                    onClick={() => setSelectedClient(client)}
                  >
                    {client.firstName} {client.lastName}
                  </button>
                </li>
              ))}
            </ul>

            {selectedClient && selectedClient.measurements && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-gray-700">Mesures de {selectedClient.firstName}</h3>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <ul className="space-y-1">
                    {Object.entries(selectedClient.measurements).map(([key, value]) => (
                      <li key={key} className="flex justify-between text-gray-700">
                        <span className="font-medium">{key} :</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => {
                setSelectedClient(null);
                setIsModalOpen(false);
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

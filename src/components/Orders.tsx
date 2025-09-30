import React, { useState, useEffect } from 'react';
import { Search, Plus, CreditCard as Edit, Trash2, Package, Calendar, DollarSign, User, Ruler } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Client, Order } from '../types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    deliveryDate: '',
    totalAmount: '',
    paidAmount: '',
    status: 'En cours' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setOrders(dataService.getOrders());
    setClients(dataService.getClients());
  };

  const getFilteredOrders = () => {
    return orders
      .filter(order => {
        const client = clients.find(c => c.id === order.clientId);
        const clientName = client ? `${client.firstName} ${client.lastName}` : '';
        
        const matchesSearch = 
          order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.description?.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      title: '',
      description: '',
      deliveryDate: '',
      totalAmount: '',
      paidAmount: '',
      status: 'En cours'
    });
    setEditingOrder(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData = {
      ...formData,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      paidAmount: parseFloat(formData.paidAmount) || 0
    };
    
    if (editingOrder) {
      dataService.updateOrder(editingOrder.id, orderData);
    } else {
      dataService.saveOrder(orderData);
    }
    
    loadData();
    resetForm();
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      clientId: order.clientId,
      title: order.title,
      description: order.description || '',
      deliveryDate: order.deliveryDate.split('T')[0], // Format for date input
      totalAmount: order.totalAmount.toString(),
      paidAmount: order.paidAmount.toString(),
      status: order.status
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      dataService.deleteOrder(id);
      loadData();
    }
  };

  const handleMeasure = (order: Order) => {
    const client = clients.find(c => c.id === order.clientId);
    window.dispatchEvent(new CustomEvent('navigate', { 
      detail: 'measurements',
      clientData: client,
      orderData: order
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'Livrée':
        return 'bg-green-100 text-green-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = getFilteredOrders();

  if (showAddForm) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {editingOrder ? 'Modifier la commande' : 'Nouvelle commande'}
          </h1>
          <button
            onClick={resetForm}
            className="text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client *
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({...formData, clientId: e.target.value})}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
              required
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName} - {client.phone}
                </option>
              ))}
            </select>
            {clients.length === 0 && (
              <p className="text-sm text-orange-600 mt-1">
                Aucun client trouvé. Ajoutez d'abord un client.
              </p>
            )}
          </div>

          {/* Order Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la commande *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ex: Robe de soirée, Boubou, Costume..."
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
              rows={3}
              placeholder="Détails supplémentaires sur la commande..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de livraison *
            </label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
              required
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Montant total *
              </label>
              <input
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avance payée
              </label>
              <input
                type="number"
                value={formData.paidAmount}
                onChange={(e) => setFormData({...formData, paidAmount: e.target.value})}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
                min="0"
                max={formData.totalAmount}
              />
            </div>
          </div>

          {/* Calculated Remaining */}
          {formData.totalAmount && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Reste à payer: <span className="font-semibold">
                  {formatPrice(
                    (parseFloat(formData.totalAmount) || 0) - (parseFloat(formData.paidAmount) || 0)
                  )}
                </span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
            >
              <option value="En cours">En cours</option>
              <option value="Livrée">Livrée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#0A3764] text-white py-3 px-4 rounded-lg hover:bg-[#195885] transition-colors"
              disabled={clients.length === 0}
            >
              {editingOrder ? 'Mettre à jour' : 'Créer la commande'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Commandes</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#0A3764] text-white p-3 rounded-lg hover:bg-[#195885] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {['all', 'En cours', 'Livrée', 'Annulée'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-[#0A3764] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'Toutes' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#0A3764] text-white p-4 rounded-lg mb-4">
        <p className="text-sm opacity-90">Total commandes</p>
        <p className="text-2xl font-bold">{orders.length}</p>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'Aucune commande trouvée' 
              : 'Aucune commande enregistrée'
            }
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Essayez avec des filtres différents'
              : 'Commencez par créer votre première commande'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#0A3764] text-white px-6 py-3 rounded-lg hover:bg-[#195885] transition-colors"
            >
              Créer une commande
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const client = clients.find(c => c.id === order.clientId);
            const clientName = client ? `${client.firstName} ${client.lastName}` : 'Client supprimé';
            
            return (
              <div key={order.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{order.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{clientName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Livraison: {new Date(order.deliveryDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Pricing Info */}
                <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                  <div className="text-center">
                    <p className="text-gray-600">Total</p>
                    <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Payé</p>
                    <p className="font-semibold text-green-600">{formatPrice(order.paidAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Reste</p>
                    <p className={`font-semibold ${order.remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatPrice(order.remainingAmount)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMeasure(order)}
                    className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Ruler className="w-4 h-4" />
                    <span>Voir mesures</span>
                  </button>
                  <button
                    onClick={() => handleEdit(order)}
                    className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
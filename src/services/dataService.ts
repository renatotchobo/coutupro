import { Client, Order, Measurement, WorkshopProfile, AppSettings } from '../types';

class DataService {
  private getStorageKey(type: string): string {
    return `coutupro_${type}`;
  }

  // Clients
  getClients(): Client[] {
    const stored = localStorage.getItem(this.getStorageKey('clients'));
    return stored ? JSON.parse(stored) : [];
  }

  saveClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Client {
    const clients = this.getClients();
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    clients.push(newClient);
    localStorage.setItem(this.getStorageKey('clients'), JSON.stringify(clients));
    return newClient;
  }

  updateClient(id: string, updates: Partial<Client>): void {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
      clients[index] = { 
        ...clients[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem(this.getStorageKey('clients'), JSON.stringify(clients));
    }
  }

  deleteClient(id: string): void {
    const clients = this.getClients();
    const filtered = clients.filter(c => c.id !== id);
    localStorage.setItem(this.getStorageKey('clients'), JSON.stringify(filtered));
  }

  // Orders
  getOrders(): Order[] {
    const stored = localStorage.getItem(this.getStorageKey('orders'));
    return stored ? JSON.parse(stored) : [];
  }

  saveOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'remainingAmount'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
      remainingAmount: order.totalAmount - order.paidAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem(this.getStorageKey('orders'), JSON.stringify(orders));
    return newOrder;
  }

  updateOrder(id: string, updates: Partial<Order>): void {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      const updatedOrder = { 
        ...orders[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      // Recalculer le reste si montant total ou avance changent
      if ('totalAmount' in updates || 'paidAmount' in updates) {
        updatedOrder.remainingAmount = updatedOrder.totalAmount - updatedOrder.paidAmount;
      }
      orders[index] = updatedOrder;
      localStorage.setItem(this.getStorageKey('orders'), JSON.stringify(orders));
    }
  }

  deleteOrder(id: string): void {
    const orders = this.getOrders();
    const filtered = orders.filter(o => o.id !== id);
    localStorage.setItem(this.getStorageKey('orders'), JSON.stringify(filtered));
  }

  // Measurements
  getMeasurements(): Measurement[] {
    const stored = localStorage.getItem(this.getStorageKey('measurements'));
    return stored ? JSON.parse(stored) : [];
  }

  saveMeasurement(measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>): Measurement {
    const measurements = this.getMeasurements();
    const newMeasurement: Measurement = {
      ...measurement,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    measurements.push(newMeasurement);
    localStorage.setItem(this.getStorageKey('measurements'), JSON.stringify(measurements));
    return newMeasurement;
  }

  getMeasurementsByClient(clientId: string): Measurement[] {
    return this.getMeasurements().filter(m => m.clientId === clientId);
  }

  // Settings
  getWorkshopProfile(): WorkshopProfile {
    const stored = localStorage.getItem(this.getStorageKey('workshop'));
    return stored ? JSON.parse(stored) : {
      name: 'Mon Atelier',
      phone: '',
      ifu: '',
      location: ''
    };
  }

  saveWorkshopProfile(profile: WorkshopProfile): void {
    localStorage.setItem(this.getStorageKey('workshop'), JSON.stringify(profile));
  }

  getAppSettings(): AppSettings {
    const stored = localStorage.getItem(this.getStorageKey('settings'));
    return stored ? JSON.parse(stored) : {
      primaryColor: '#0A3764',
      secondaryColor: '#195885',
      notifications: {
        orderDeadlines: true,
        deliveryReminders: true,
        paymentReminders: true
      }
    };
  }

  saveAppSettings(settings: AppSettings): void {
    localStorage.setItem(this.getStorageKey('settings'), JSON.stringify(settings));
    // Appliquer les couleurs CSS
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
  }

  // Stats
  getStats() {
    const clients = this.getClients();
    const orders = this.getOrders();
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.paidAmount, 0);
    const pendingOrders = orders.filter(o => o.status === 'En cours').length;
    
    return {
      clientsCount: clients.length,
      ordersCount: orders.length,
      totalRevenue,
      pendingOrders
    };
  }

  // Data management
  exportData() {
    return {
      clients: this.getClients(),
      orders: this.getOrders(),
      measurements: this.getMeasurements(),
      workshop: this.getWorkshopProfile(),
      settings: this.getAppSettings(),
      exportDate: new Date().toISOString()
    };
  }

  resetData(): void {
    const keys = ['clients', 'orders', 'measurements'];
    keys.forEach(key => localStorage.removeItem(this.getStorageKey(key)));
  }
}

export const dataService = new DataService();
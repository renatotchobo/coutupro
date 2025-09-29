export interface User {
  id: string;
  code: string;
  role: 'admin' | 'user';
  name: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  deliveryDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'En cours' | 'Livrée' | 'Annulée';
  createdAt: string;
  updatedAt: string;
}

export interface Measurement {
  id: string;
  clientId: string;
  orderId?: string;
  measurements: {
    dos?: number;
    longueurManche?: number;
    tourManche?: number;
    longueurRobe?: number;
    longueurJupe?: number;
    longueurPantalon?: number;
    longueurTaille?: number;
    hauteurPoitrine?: number;
    hauteurSousSein?: number;
    encolure?: number;
    carrure?: number;
    tourPoitrine?: number;
    tourSousSein?: number;
    tourTaille?: number;
    tourBassin?: number;
    hauteurBassin?: number;
    ceinture?: number;
    basPantalon?: number;
    tourGenou?: number;
    [key: string]: number | undefined;
  };
  customMeasurements: { [key: string]: number };
  createdAt: string;
  updatedAt: string;
}

export interface WorkshopProfile {
  name: string;
  logo?: string;
  phone: string;
  ifu: string;
  location: string;
}

export interface AppSettings {
  primaryColor: string;
  secondaryColor: string;
  notifications: {
    orderDeadlines: boolean;
    deliveryReminders: boolean;
    paymentReminders: boolean;
  };
}
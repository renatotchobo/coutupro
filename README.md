# COUTUPRO - Application de Gestion pour Stylistes et Couturiers

Une PWA (Progressive Web App) moderne et responsive conçue spécialement pour les stylistes et couturiers souhaitant optimiser la gestion de leur activité.

## 🎯 Description du projet

COUTUPRO est une application web progressive qui permet aux professionnels de la couture de :
- Gérer efficacement leur clientèle
- Suivre leurs commandes et paiements
- Enregistrer les mesures de leurs clients
- Personnaliser l'apparence de l'application
- Administrer les accès utilisateurs

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Navigateur moderne supportant les PWA

## 🚀 Installation et lancement

### Installation rapide

```bash
# Cloner le projet
git clone [URL_DU_PROJET]
cd coutupro

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run dev
```

### Commandes disponibles

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Construire l'application pour la production
npm run preview      # Prévisualiser la version de production
npm run lint         # Vérifier le code avec ESLint
npm run typecheck    # Vérification TypeScript
```

## 🏗️ Structure du projet

```
src/
├── components/          # Composants React
│   ├── Auth.tsx        # Authentification par code
│   ├── Intro.tsx       # Carrousel de présentation
│   ├── Dashboard.tsx   # Tableau de bord principal
│   ├── Clients.tsx     # Gestion des clients
│   ├── Orders.tsx      # Gestion des commandes
│   ├── Measurements.tsx # Prise de mesures
│   ├── Settings.tsx    # Paramètres de l'application
│   ├── Admin.tsx       # Espace administration
│   ├── BottomNav.tsx   # Navigation mobile
│   └── TopNav.tsx      # Barre de navigation supérieure
├── services/           # Services de données
│   ├── authService.ts  # Service d'authentification
│   └── dataService.ts  # Service de gestion des données
├── types/              # Types TypeScript
│   └── index.ts        # Définitions des interfaces
├── App.tsx             # Composant principal
├── main.tsx           # Point d'entrée de l'application
└── index.css          # Styles globaux avec Tailwind
```

## 🔐 Comptes de test

### Codes d'autorisation par défaut :

- **Administrateur** : `ADMIN123`
  - Accès à l'espace d'administration
  - Génération de nouveaux codes d'accès
  - Gestion des utilisateurs

- **Utilisateur** : `USER123`
  - Accès à l'application principale
  - Gestion clients, commandes, mesures
  - Personnalisation des paramètres

## 📱 Fonctionnalités principales

### 🔒 Authentification
- Connexion par code d'autorisation unique
- Gestion des rôles (Admin/Utilisateur)
- Session persistante

### 👥 Gestion des clients
- Ajout/modification/suppression de clients
- Recherche et filtrage
- Photos de profil (optionnel)
- Informations complètes (nom, téléphone, email, adresse)

### 📦 Gestion des commandes
- Création de commandes liées aux clients
- Calcul automatique du reste à payer
- Suivi des statuts (En cours, Livrée, Annulée)
- Gestion des dates de livraison
- Filtrage par statut et recherche

### 📏 Prise de mesures
- 19 mesures standards prédéfinies :
  - Dos, Longueur manche, Tour de manche
  - Longueur robe, jupe, pantalon, taille
  - Hauteur poitrine, sous-sein
  - Encolure, Carrure
  - Tours : poitrine, sous-sein, taille, bassin, genou
  - Hauteur bassin, Ceinture, Bas pantalon
- Mesures personnalisées (ajout libre)
- Historique chronologique par client
- Sauvegarde liée aux commandes

### ⚙️ Paramètres avancés
- **Notifications** : Alertes personnalisables
- **Profil Atelier** : Nom, logo, téléphone, IFU, localisation
- **Apparence** : 
  - 6 thèmes prédéfinis
  - Couleurs personnalisées (HEX)
  - Application en temps réel
- **Maintenance** : Export/import de données, réinitialisation

### 👑 Espace Administration
- Génération de codes d'accès
- Gestion des utilisateurs (activation/désactivation)
- Historique des connexions
- Export CSV des codes d'accès
- Statistiques d'utilisation

## 🎨 Personnalisation

### Modification des couleurs par défaut

Les couleurs peuvent être modifiées dans l'application via les Paramètres > Apparence, ou directement dans le code :

```typescript
// src/services/dataService.ts - couleurs par défaut
const defaultSettings = {
  primaryColor: '#0A3764',    // Bleu foncé principal
  secondaryColor: '#195885'   // Bleu clair secondaire
}
```

### Modification de la mention du concepteur

```typescript
// Rechercher et remplacer dans tous les fichiers :
"Conçu par Rénato TCHOBO — Version 1.0"
```

## 📊 Schéma de données

### Structure des données principales :

```typescript
// Utilisateur
User {
  id: string
  code: string
  role: 'admin' | 'user'
  name: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

// Client
Client {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  address?: string
  photo?: string
  createdAt: string
  updatedAt: string
}

// Commande
Order {
  id: string
  clientId: string
  title: string
  description?: string
  deliveryDate: string
  totalAmount: number
  paidAmount: number
  remainingAmount: number  // Calculé automatiquement
  status: 'En cours' | 'Livrée' | 'Annulée'
  createdAt: string
  updatedAt: string
}

// Mesures
Measurement {
  id: string
  clientId: string
  orderId?: string
  measurements: { [key: string]: number }
  customMeasurements: { [key: string]: number }
  createdAt: string
  updatedAt: string
}
```

## 🧪 Tests rapides

### Workflow de test complet :

1. **Connexion** : Utiliser `USER123`
2. **Intro** : Naviguer dans le carrousel (3 slides)
3. **Dashboard** : Vérifier les statistiques vides
4. **Ajouter un client** :
   ```json
   {
     "firstName": "Marie",
     "lastName": "Dubois",
     "phone": "+229 12 34 56 78",
     "email": "marie.dubois@email.com"
   }
   ```
5. **Créer une commande** :
   ```json
   {
     "client": "Marie Dubois",
     "title": "Robe de soirée",
     "totalAmount": 50000,
     "paidAmount": 25000,
     "deliveryDate": "2024-02-15"
   }
   ```
6. **Prendre des mesures** : Remplir quelques champs standard
7. **Tester l'admin** : Se déconnecter et utiliser `ADMIN123`

## 🔧 Administration

### Génération de codes d'accès

1. Connectez-vous avec `ADMIN123`
2. Cliquez sur "Ajouter utilisateur"
3. Remplissez le nom et sélectionnez le rôle
4. Cliquez sur l'icône clé pour générer un code
5. Le code peut être copié et partagé

### Export des données

- **Format JSON** : Via Paramètres > Maintenance > Exporter
- **Format CSV** : Via Administration > Exporter CSV (codes uniquement)

## 🔒 Sécurité et données

- Toutes les données sont stockées localement (localStorage)
- Pas de serveur externe requis pour le fonctionnement de base
- Les codes d'accès ne sont pas chiffrés (version démo)
- Architecture prête pour une API REST future

## 📱 PWA (Progressive Web App)

L'application supporte :
- Installation sur l'écran d'accueil
- Fonctionnement hors ligne (cache)
- Notifications push (simulées)
- Interface adaptée mobile

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **Build** : Vite
- **Storage** : localStorage (données mockées)
- **PWA** : Service Worker + Manifest

## 📞 Support

Pour toute question ou amélioration, contactez :
**Rénato TCHOBO** - Développeur principal

---

*Version 1.0 - Application complète et prête pour la production*
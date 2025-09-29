import React, { useState, useEffect } from 'react';
import { Ruler, Save, Plus, Trash2, User } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Client, Order, Measurement } from '../types';

interface MeasurementsProps {
  selectedClient?: Client;
  selectedOrder?: Order;
}

const STANDARD_MEASUREMENTS = [
  { key: 'dos', label: 'Dos' },
  { key: 'longueurManche', label: 'Longueur manche' },
  { key: 'tourManche', label: 'Tour de manche' },
  { key: 'longueurRobe', label: 'Longueur robe' },
  { key: 'longueurJupe', label: 'Longueur jupe' },
  { key: 'longueurPantalon', label: 'Longueur pantalon' },
  { key: 'longueurTaille', label: 'Longueur taille' },
  { key: 'hauteurPoitrine', label: 'Hauteur poitrine' },
  { key: 'hauteurSousSein', label: 'Hauteur sous-sein' },
  { key: 'encolure', label: 'Encolure' },
  { key: 'carrure', label: 'Carrure' },
  { key: 'tourPoitrine', label: 'Tour de poitrine' },
  { key: 'tourSousSein', label: 'Tour sous-sein' },
  { key: 'tourTaille', label: 'Tour de taille' },
  { key: 'tourBassin', label: 'Tour bassin' },
  { key: 'hauteurBassin', label: 'Hauteur bassin' },
  { key: 'ceinture', label: 'Ceinture' },
  { key: 'basPantalon', label: 'Bas pantalon' },
  { key: 'tourGenou', label: 'Tour du genou' }
];

export default function Measurements({ selectedClient, selectedOrder }: MeasurementsProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState(selectedClient?.id || '');
  const [measurements, setMeasurements] = useState<any>({});
  const [customMeasurements, setCustomMeasurements] = useState<{[key: string]: number}>({});
  const [newCustomKey, setNewCustomKey] = useState('');
  const [newCustomValue, setNewCustomValue] = useState('');
  const [previousMeasurements, setPreviousMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    setClients(dataService.getClients());
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      const previous = dataService.getMeasurementsByClient(selectedClientId);
      setPreviousMeasurements(previous);
      
      // Load the latest measurements if available
      if (previous.length > 0) {
        const latest = previous[previous.length - 1];
        setMeasurements(latest.measurements);
        setCustomMeasurements(latest.customMeasurements);
      }
    }
  }, [selectedClientId]);

  const handleMeasurementChange = (key: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value ? parseFloat(value) : undefined
    }));
  };

  const addCustomMeasurement = () => {
    if (newCustomKey && newCustomValue) {
      setCustomMeasurements(prev => ({
        ...prev,
        [newCustomKey]: parseFloat(newCustomValue)
      }));
      setNewCustomKey('');
      setNewCustomValue('');
    }
  };

  const removeCustomMeasurement = (key: string) => {
    setCustomMeasurements(prev => {
      const newCustom = { ...prev };
      delete newCustom[key];
      return newCustom;
    });
  };

  const handleSave = () => {
    if (!selectedClientId) {
      alert('Veuillez sélectionner un client');
      return;
    }

    const measurementData = {
      clientId: selectedClientId,
      orderId: selectedOrder?.id,
      measurements,
      customMeasurements
    };

    dataService.saveMeasurement(measurementData);
    alert('Mesures sauvegardées avec succès!');
    
    // Reload previous measurements
    const previous = dataService.getMeasurementsByClient(selectedClientId);
    setPreviousMeasurements(previous);
  };

  const client = clients.find(c => c.id === selectedClientId);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Prise de mesures</h1>
        {selectedOrder && (
          <p className="text-gray-600">Commande: {selectedOrder.title}</p>
        )}
      </div>

      {/* Client Selection */}
      {!selectedClient && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un client *
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
          >
            <option value="">Choisir un client...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName} - {client.phone}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Client Info */}
      {client && (
        <div className="bg-[#0A3764] text-white p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-[#0A3764]" />
            </div>
            <div>
              <h3 className="font-semibold">{client.firstName} {client.lastName}</h3>
              <p className="text-white/80">{client.phone}</p>
            </div>
          </div>
        </div>
      )}

      {selectedClientId ? (
        <div className="space-y-6">
          {/* Previous Measurements History */}
          {previousMeasurements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Historique des mesures</h3>
              <p className="text-sm text-gray-600 mb-2">
                {previousMeasurements.length} mesure(s) précédente(s)
              </p>
              <div className="text-xs text-gray-500">
                Dernière prise: {new Date(previousMeasurements[previousMeasurements.length - 1].createdAt).toLocaleString('fr-FR')}
              </div>
            </div>
          )}

          {/* Standard Measurements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mesures standards</h3>
            <div className="grid gap-4">
              {STANDARD_MEASUREMENTS.map(measure => (
                <div key={measure.key} className="flex items-center space-x-3">
                  <label className="flex-1 text-sm font-medium text-gray-700">
                    {measure.label}
                  </label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      step="0.1"
                      value={measurements[measure.key] || ''}
                      onChange={(e) => handleMeasurementChange(measure.key, e.target.value)}
                      className="w-20 p-2 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none text-center"
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-500">cm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Measurements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mesures personnalisées</h3>
            
            {/* Existing Custom Measurements */}
            {Object.entries(customMeasurements).length > 0 && (
              <div className="space-y-3 mb-4">
                {Object.entries(customMeasurements).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <span className="flex-1 text-sm font-medium text-gray-700">{key}</span>
                    <span className="text-sm text-gray-600">{value} cm</span>
                    <button
                      onClick={() => removeCustomMeasurement(key)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Custom Measurement */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Nom de la mesure"
                value={newCustomKey}
                onChange={(e) => setNewCustomKey(e.target.value)}
                className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Valeur"
                value={newCustomValue}
                onChange={(e) => setNewCustomValue(e.target.value)}
                className="w-24 p-3 border-2 border-gray-200 rounded-lg focus:border-[#0A3764] focus:outline-none text-center"
              />
              <button
                onClick={addCustomMeasurement}
                className="bg-[#0A3764] text-white p-3 rounded-lg hover:bg-[#195885] transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <button
              onClick={handleSave}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Sauvegarder les mesures</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Ruler className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Sélectionnez un client
          </h3>
          <p className="text-gray-500">
            Choisissez un client pour commencer la prise de mesures
          </p>
        </div>
      )}
    </div>
  );
}
import React, { useState } from "react"
import { ShoppingCart, Ruler, X } from "lucide-react"

// Exemple de données clients avec mesures
const clients = [
  {
    id: 1,
    name: "Alice Dupont",
    mesures: {
      taille: "170 cm",
      poids: "65 kg",
      poitrine: "90 cm",
      tailleTour: "70 cm",
      hanches: "95 cm",
    },
  },
  {
    id: 2,
    name: "Jean Martin",
    mesures: {
      taille: "180 cm",
      poids: "80 kg",
      poitrine: "100 cm",
      tailleTour: "85 cm",
      hanches: "100 cm",
    },
  },
]

// Exemple de commandes
const commandes = [
  { id: 101, clientId: 1, description: "Robe sur mesure", statut: "En cours" },
  { id: 102, clientId: 2, description: "Costume 3 pièces", statut: "En attente" },
]

export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null)

  return (
    <div className="p-6 space-y-6">
      {/* Bannière */}
      <div className="bg-gradient-to-r from-[#0A3764] to-[#195885] text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-white/80">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
          <ShoppingCart className="w-6 h-6 text-[#0A3764]" />
          <p className="text-lg font-bold">12</p>
          <p className="text-gray-500 text-sm">Commandes</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
          <Ruler className="w-6 h-6 text-[#195885]" />
          <p className="text-lg font-bold">8</p>
          <p className="text-gray-500 text-sm">Clients mesurés</p>
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Commandes récentes</h2>
        <ul className="divide-y divide-gray-200">
          {commandes.map((commande) => {
            const client = clients.find((c) => c.id === commande.clientId)
            return (
              <li key={commande.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="font-medium">{commande.description}</p>
                  <p className="text-sm text-gray-500">
                    Client : {client?.name} — Statut : {commande.statut}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedClient(client || null)}
                  className="bg-[#0A3764] text-white px-3 py-2 rounded-lg hover:bg-[#195885] transition"
                >
                  Voir mesures
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Modal mesures */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedClient(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4">
              Mesures de {selectedClient.name}
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>Taille : {selectedClient.mesures.taille}</li>
              <li>Poids : {selectedClient.mesures.poids}</li>
              <li>Poitrine : {selectedClient.mesures.poitrine}</li>
              <li>Taille (tour) : {selectedClient.mesures.tailleTour}</li>
              <li>Hanches : {selectedClient.mesures.hanches}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

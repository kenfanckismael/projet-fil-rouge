import React from 'react';
import { Clock, ShoppingBag } from 'lucide-react';

const OrderFilters = ({ statusFilter, setStatusFilter, serviceTypeFilter, setServiceTypeFilter }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <h1 className="text-2xl font-bold">Gestion des commandes</h1>

    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
      {/* Filtre par statut */}
      <div className="relative flex-1">
        <select
          className="w-full border rounded-md px-3 py-2 pl-9 text-sm bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="tous">Tous les statuts</option>
          <option value="en attente">🕒 En attente</option>
          <option value="en préparation">👨‍🍳 En préparation</option>
          <option value="prêt">✅ Prêt à servir</option>
          <option value="servi">🍽️ Servi</option>
          <option value="terminé">✔️ Terminé</option>
        </select>
        <Clock className="absolute left-3 top-2.5 text-gray-400" size={16} />
      </div>

      {/* Filtre par type de service */}
      <div className="relative flex-1">
        <select
          className="w-full border rounded-md px-3 py-2 pl-9 text-sm bg-white"
          value={serviceTypeFilter}
          onChange={(e) => setServiceTypeFilter(e.target.value)}
        >
          <option value="tous">Tous les types</option>
          <option value="sur place">🏠 Sur place</option>
          <option value="à emporter">📦 À emporter</option>
          <option value="livraison">🚚 Livraison</option>
        </select>
        <ShoppingBag className="absolute left-3 top-2.5 text-gray-400" size={16} />
      </div>
    </div>
  </div>
);

export default OrderFilters;

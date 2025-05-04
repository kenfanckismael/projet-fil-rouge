import OrderItem from './OrderItem';

export default function OrderList({ 
  orders, 
  tables, 
  expandedOrder, 
  onToggleExpand,
  onStatusChange,
  onPaymentStatusChange
}) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* En-tête de tableau visible uniquement sur grand écran */}
      <div className="hidden md:grid grid-cols-7 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700">
        <div>Commande #</div>
        <div>Date</div>
        <div>Table</div>
        <div>Montant</div>
        <div>Statut</div>
        <div>Paiement</div>
        <div className="text-right">Actions</div>
      </div>
      
      {/* Liste des commandes avec division */}
      <div className="divide-y divide-gray-200">
        {orders.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Aucune commande disponible</div>
        ) : (
          orders.map(order => (
            <OrderItem
              key={order.id}
              order={order}
              tables={tables}
              isExpanded={expandedOrder === order.id}
              onToggleExpand={onToggleExpand}
              onStatusChange={onStatusChange}
              onPaymentStatusChange={onPaymentStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}

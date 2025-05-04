export default function OrderDetails({ order, tables }) {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Détails de la commande</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Type de service:</span>
            <span className="ml-2 capitalize">{order.service_type.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-gray-500">Mode de paiement:</span>
            <span className="ml-2 capitalize">{order.payment_method ? order.payment_method.replace('_', ' ') : 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500">Client:</span>
            <span className="ml-2">{order.client_name || 'Non spécifié'}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Articles commandés</h4>
        <div className="bg-gray-50 rounded-md overflow-hidden border border-gray-200">
          <div className="grid grid-cols-5 px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100">
            <div className="col-span-2">Plat</div>
            <div>Quantité</div>
            <div>Prix unitaire</div>
            <div>Total</div>
          </div>
          <div className="divide-y divide-gray-200">
            {order.items.map(item => (
              <div key={item.id} className="grid grid-cols-5 px-4 py-3 text-sm hover:bg-gray-100">
                <div className="col-span-2">
                  <div className="font-medium">{item.plat_name}</div>
                  {item.notes && (
                    <div className="text-xs text-gray-500 italic mt-1">Note: {item.notes}</div>
                  )}
                </div>
                <div>{item.quantity}</div>
                <div>{formatPrice(item.prix)}</div>
                <div>{formatPrice(item.quantity * item.prix)}</div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 text-sm font-medium text-right bg-gray-100 border-t border-gray-200">
            Total: {formatPrice(order.total_prix)}
          </div>
        </div>
      </div>
    </div>
  );
}

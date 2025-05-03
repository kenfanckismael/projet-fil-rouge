import React from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import OrderActionButton from './OrderActionButton';

const OrderCard = ({ order, setOrders }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    {/* En-tête de commande */}
    <div className="flex justify-between items-start mb-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg">#{order.id}</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {order.timestamp} · {order.service_type}
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-lg">{Number(order.total_prix).toFixed(2)} €</div>
        <div className="text-sm text-gray-500 capitalize">{order.payment_method}</div>
      </div>
    </div>

    {/* Détails des articles */}
    <div className="border-t border-b py-3 my-2 max-h-40 overflow-y-auto">
      {Array.isArray(order.elts) && order.elts.length > 0 ? (
        order.elts.map((item, idx) => (
          <div key={idx} className="flex justify-between py-1.5 text-sm">
            <div className="flex items-start">
              <span className="font-medium mr-2">{item.quantity}x</span>
              <div>
                <div>{item.plat?.name || 'Plat inconnu'}</div>
                {item.notes && (
                  <div className="text-xs text-gray-500 mt-0.5">Note: {item.notes}</div>
                )}
              </div>
            </div>
            <div className="font-medium">{(item.prix * item.quantity).toFixed(2)} €</div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Aucun article dans cette commande.</p>
      )}
    </div>

    {/* Actions */}
    <div className="flex justify-between items-center mt-3">
      <div className="text-sm text-gray-500">
        {Array.isArray(order.elts)
          ? order.elts.reduce((sum, item) => sum + item.quantity, 0)
          : 0}{' '}
        articles
      </div>
      <div className="flex gap-2">
        <OrderActionButton order={order} setOrders={setOrders} />
      </div>
    </div>
  </div>
);

export default OrderCard;

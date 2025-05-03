import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ orders, setOrders }) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
    {orders.length > 0 ? (
      orders.map(order => (
        <OrderCard key={order.id} order={order} setOrders={setOrders} />
      ))
    ) : (
      <div className="col-span-2 flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-500">Aucune commande trouvée</h3>
        <p className="text-gray-400 mt-1">Ajustez vos filtres ou attendez de nouvelles commandes</p>
      </div>
    )}
  </div>
);

export default OrderList;

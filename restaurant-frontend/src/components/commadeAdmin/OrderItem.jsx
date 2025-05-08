import { ChevronDown, ChevronUp } from 'lucide-react';
import StatusBadge from './StatusBadge';
import OrderDetails from './OrderDetails';
import OrderActions from './OrderActions';

export default function OrderItem({ 
  order, 
  tables, 
  isExpanded, 
  onToggleExpand,
  onStatusChange,
  onPaymentStatusChange
}) {
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

  return (
    <div className="px-4 py-4 md:px-6 hover:bg-gray-50 transition">
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2 md:gap-0 items-center">
        <div className="font-medium"># {order.id}</div>
        <div className="text-gray-600 text-sm">
          {formatDateTime(order.created_at)}
        </div>
        <div className="text-gray-800">
          {tables.find(t => t.id === order.table_id)?.name || `Table ${order.table_id}`}
        </div>
        <div className="font-medium">{Number(order.total_prix).toFixed(2)} XAF</div>
        <div>
          <StatusBadge type="order" status={order.status} />
        </div>
        <div>
          <StatusBadge type="payment" status={order.payment_status} />
        </div>
        <div className="flex justify-end">
          <button
            className="text-blue-600 hover:text-blue-800 transition"
            onClick={() => onToggleExpand(order.id)}
            aria-label={isExpanded ? "Masquer les détails" : "Afficher les détails"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="transition-all duration-300 ease-in-out">
          <OrderDetails order={order} tables={tables} />
          <OrderActions
            orderStatus={order.status}
            paymentStatus={order.payment_status}
            onStatusChange={(status) => onStatusChange(order.id, status)}
            onPaymentStatusChange={(status) => onPaymentStatusChange(order.id, status)}
          />
        </div>
      )}
    </div>
  );
}

import React from 'react';

const OrderStatusBadge = ({ status }) => {
  let badgeClass = '';
  switch (status) {
    case 'en attente':
      badgeClass = 'bg-amber-100 text-amber-800';
      break;
    case 'en préparation':
      badgeClass = 'bg-blue-100 text-blue-800';
      break;
    case 'prêt':
      badgeClass = 'bg-green-100 text-green-800';
      break;
    case 'servi':
      badgeClass = 'bg-gray-100 text-gray-800';
      break;
    case 'terminé':
      badgeClass = 'bg-purple-100 text-purple-800';
      break;
    default:
      badgeClass = 'bg-gray-200 text-gray-600';
  }
  return <span className={`px-2 py-1 rounded-md text-xs font-medium ${badgeClass}`}>{status}</span>;
};

export default OrderStatusBadge;

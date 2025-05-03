import React from 'react';

const OrderActionButton = ({ onClick, color, icon, label }) => (
  <button
    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium ${color}`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default OrderActionButton;

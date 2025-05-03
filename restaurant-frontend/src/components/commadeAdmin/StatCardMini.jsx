import React from 'react';

const StatCardMini = ({ title, value, color }) => (
  <div className={`p-3 rounded-lg ${color}`}>
    <div className="text-xs font-medium">{title}</div>
    <div className="text-xl font-bold mt-1">{value}</div>
  </div>
);

export default StatCardMini;

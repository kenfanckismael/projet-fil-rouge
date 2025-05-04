import React from 'react';

export default function LoadingSpinner({ size = 'h-12 w-12', color = 'border-blue-500' }) {
  return (
    <div className="flex justify-center items-center py-12">
      <div
        className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}
        style={{ borderTopColor: 'transparent' }} // Pour avoir une ligne de chargement colorée uniquement sur le bas
      ></div>
    </div>
  );
}

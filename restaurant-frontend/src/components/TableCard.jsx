import React from 'react';

const TableCard = ({ table, onEdit, onDelete }) => {
  return (
    <div className="w-[251px] bg-white border border-black rounded-[10px] overflow-hidden transition-transform hover:scale-105">
        <div className="p-[21px]">
            {/* En-tête avec nom de table et statut */}
            <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-nunito font-semibold text-[20px] leading-[22px] text-[#F96540]">
                Table {table.name || table.id}
                </h3>
                <p className="font-nunito font-medium text-[14px] text-[#FC8F33]">
                {table.code}
                </p>
            </div>
            <span
                className={`px-2 py-1 rounded-full text-xs font-nunito font-medium ${
                table.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
            >
                {table.active ? 'Active' : 'Inactive'}
            </span>
            </div>

            {/* Nombre de places */}
            <div className="flex items-center text-gray-600 mb-4 text-sm font-nunito">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            <span>{table.nb_place || 4} places</span>
            </div>

            {/* QR Code */}
            <div className="mb-4">
            {table.qr_code_path ? (
                <>
                <img
                    src={`/storage/${table.qr_code_path}`}
                    alt={`QR Code for table ${table.code}`}
                    className="w-[213px] h-[213px] border border-gray-200 rounded-[15px] mx-auto hover:opacity-90 transition-opacity"
                />
                <p className="text-xs text-gray-500 mt-2 text-center font-nunito">
                    Scanner pour accéder au menu
                </p>
                </>
            ) : (
                <div className="w-[213px] h-[213px] bg-gray-200 border border-black rounded-[15px] flex items-center justify-center mx-auto">
                <span className="text-gray-500">QR Code {table.id}</span>
                </div>
            )}
            </div>

            {/* Lien */}
            <div className="flex justify-center">
                <p className="text-center font-nunito font-normal text-[12px] leading-[22px] text-gray-600 mb-4">
                    Lien : https://localhost:5173/{table.restaurant?.name}/{table.restaurant?.id}/{ table.code}
                </p>
            </div>

           {/* Boutons d'action */}
            <div className="flex justify-center items-center space-x-4 mt-4">
            <a
                href={table.qr_code_path}
                download={`QR_Code_${table.code}.png`}
                className="px-3 py-1 bg-[#13BF7D] text-white rounded-md hover:bg-green-600 transition-colors text-xs font-nunito"
            >
                Télécharger
            </a>

            {onEdit && onDelete && (
                <div className="flex space-x-4">
                <button
                    onClick={() => onEdit(table)}
                    className="px-3 py-1 bg-[#FFDB5B] text-gray-800 rounded-md hover:bg-yellow-400 transition-colors text-xs font-nunito"
                >
                    Modifier
                </button>
                <button
                    onClick={() => onDelete(table.id)}
                    className="px-3 py-1 bg-[#F96540] text-white rounded-md hover:bg-red-600 transition-colors text-xs font-nunito"
                >
                    Supprimer
                </button>
                </div>
            )}
            </div>
        </div>
    </div>
  );
};

export default TableCard;
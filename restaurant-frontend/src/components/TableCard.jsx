export default function TableCard({ table, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-md shadow-sm overflow-hidden transition-transform hover:scale-105">
            <div className="p-2">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{table.name}</h3>
                        <p className="text-orange-500 text-sm">{table.code}</p>
                    </div>
                    <span
                        className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                            table.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {table.active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className="flex items-center text-gray-600 mb-1 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <span>{table.nb_place} places</span>
                </div>

                {table.restaurant?.name && (
                    <div className="flex items-center text-gray-600 mb-2 text-sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <span>{table.restaurant.name}</span>
                    </div>
                )}

                {table.qr_code_path && (
                    <div className="mb-2">
                        <a
                            href={`/storage/${table.qr_code_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={`/storage/${table.qr_code_path}`}
                                alt={`QR Code for table ${table.code}`}
                                className="w-full h-auto border border-gray-200 rounded hover:opacity-90 transition-opacity"
                            />
                        </a>
                        <p className="text-xs text-gray-500 mt-1">Scanner pour accéder au menu</p>
                        <a
                            href={`/storage/${table.qr_code_path}`}
                            download={`QR_Code_${table.code}.png`}
                            className="px-2 py-0.5 bg-green-500 text-white rounded-md hover:bg-green-600 hover:scale-105 transition-transform text-xs"
                        >
                            Télécharger le QR Code
                        </a>
                    </div>
                )}

                {onEdit && onDelete && (
                    <div className="flex justify-end space-x-1">
                        <button
                            onClick={() => onEdit(table)}
                            className="px-2 py-0.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:scale-105 transition-transform text-xs"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={() => onDelete(table.id)}
                            className="px-2 py-0.5 bg-red-500 text-white rounded-md hover:bg-red-600 hover:scale-105 transition-transform text-xs"
                        >
                            Supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
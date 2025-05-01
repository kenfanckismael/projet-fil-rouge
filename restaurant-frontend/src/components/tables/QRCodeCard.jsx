export default function QRCodeCard({ table, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-md shadow-sm overflow-hidden transition-transform hover:scale-105">
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{table.name}</h3>
                        <p className="text-orange-500 text-sm">{table.code}</p>
                    </div>
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            table.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {table.active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className="text-sm text-gray-600 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                        />
                    </svg>
                    <span>{table.nb_place} places</span>
                </div>

                {table.restaurant?.name && (
                    <div className="text-sm text-gray-600 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
                            />
                        </svg>
                        <span>{table.restaurant.name}</span>
                    </div>
                )}

                {table.qr_code_path && (
                    <div className="mb-3">
                        <a
                            href={`/storage/${table.qr_code_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={`/storage/${table.qr_code_path}`}
                                alt={`QR Code pour ${table.code}`}
                                className="w-full border border-gray-200 rounded-md hover:opacity-90 transition-opacity"
                            />
                        </a>
                        <p className="text-xs text-gray-500 mt-1">Scanner pour accéder au menu</p>
                        <a
                            href={`/storage/${table.qr_code_path}`}
                            download={`QR_Code_${table.code}.png`}
                            className="inline-block mt-1 px-2 py-0.5 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                        >
                            Télécharger le QR Code
                        </a>
                    </div>
                )}

                {(onEdit || onDelete) && (
                    <div className="flex justify-end space-x-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(table)}
                                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-transform"
                            >
                                Modifier
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(table.id)}
                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-transform"
                            >
                                Supprimer
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PlatCard({ plat, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            {plat.image && (
                <img 
                    src={`/storage/${plat.image}`} 
                    alt={plat.name}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{plat.name}</h3>
                    <span className="text-orange-500 font-bold">{Number(plat.prix).toFixed(2)} €</span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{plat.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${plat.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {plat.disponible ? 'Disponible' : 'Non disponible'}
                    </span>
                    {plat.en_vedette && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            En vedette
                        </span>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                        <p className="font-medium">Catégorie:</p>
                        <p>{plat.categorie?.name || 'Non spécifiée'}</p>
                    </div>
                    <div>
                        <p className="font-medium">Restaurant:</p>
                        <p>{plat.restaurant?.name || 'Non spécifié'}</p>
                    </div>
                </div>
                
                {onEdit && onDelete && (
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => onEdit(plat)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={() => onDelete(plat.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                        >
                            Supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
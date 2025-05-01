export default function EltCommandeCard({ eltCommande, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            {eltCommande.plat?.name || 'Plat non spécifié'}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Commande #{eltCommande.commande_id}
                        </p>
                    </div>
                    <span className="text-orange-500 font-bold">
                        {(eltCommande.quantity * eltCommande.prix).toFixed(2)} €
                    </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                        <p className="text-gray-600">Quantité:</p>
                        <p className="font-medium">{eltCommande.quantity}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Prix unitaire:</p>
                        <p className="font-medium">{Number(eltCommande.prix).toFixed(2)} €</p>
                    </div>
                </div>
                
                {eltCommande.notes && (
                    <div className="mb-3">
                        <p className="text-gray-600">Notes:</p>
                        <p className="font-medium italic">{eltCommande.notes}</p>
                    </div>
                )}
                
                {onEdit && onDelete && (
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => onEdit(eltCommande)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={() => onDelete(eltCommande.id)}
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
export default function CommandeCard({ commande, onEdit, onDelete }) {
    const statusClasses = {
        en_attente: 'bg-yellow-100 text-yellow-800',
        en_cours: 'bg-blue-100 text-blue-800',
        terminee: 'bg-green-100 text-green-800',
        annulee: 'bg-red-100 text-red-800'
    };

    const paymentStatusClasses = {
        paye: 'bg-green-100 text-green-800',
        non_paye: 'bg-red-100 text-red-800',
        partiel: 'bg-orange-100 text-orange-800'
    };

    const serviceTypeLabels = {
        sur_place: 'Sur place',
        a_emporter: 'À emporter',
        livraison: 'Livraison'
    };

    const paymentMethodLabels = {
        espece: 'Espèces',
        carte: 'Carte',
        online: 'En ligne'
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Commande #{commande.id}</h3>
                        <p className="text-gray-500 text-sm">
                            {new Date(commande.created_at).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[commande.status]}`}>
                            {commande.status.replace('_', ' ')}
                        </span>
                        <span className="text-orange-500 font-bold mt-1">
                        {Number(commande.total_prix).toFixed(2)} €                        
                        </span>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p className="text-gray-600">Restaurant:</p>
                        <p className="font-medium">{commande.restaurant?.name || 'Non spécifié'}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Table:</p>
                        <p className="font-medium">{commande.table?.name || 'Non spécifiée'}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Service:</p>
                        <p className="font-medium">{serviceTypeLabels[commande.service_type]}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Paiement:</p>
                        <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusClasses[commande.payment_status]}`}>
                                {commande.payment_status.replace('_', ' ')}
                            </span>
                            {commande.payment_method && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {paymentMethodLabels[commande.payment_method]}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                
                
                
                {onEdit && onDelete && (
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => onEdit(commande)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                        >
                            Modifier
                        </button>
                        <button
                            onClick={() => onDelete(commande.id)}
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
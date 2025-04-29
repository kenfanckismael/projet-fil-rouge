import { useState, useEffect } from 'react';

export default function CommandeForm({ commande, restaurants, tables, plats, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(commande || {
        restaurant_id: restaurants[0]?.id || '',
        table_id: tables[0]?.id || '',
        total_prix: 0,
        status: 'en_attente',
        payment_method: '',
        payment_status: 'non_paye',
        service_type: 'sur_place',
        plats: []
    });

    const [selectedPlats, setSelectedPlats] = useState([]);
    const [availableTables, setAvailableTables] = useState(tables);

    useEffect(() => {
        if (commande) {
            setFormData(commande);
            setSelectedPlats(commande.plats?.map(plat => ({
                ...plat,
                quantite: plat.pivot.quantite,
                prix_unitaire: plat.pivot.prix_unitaire,
                commentaire: plat.pivot.commentaire
            })) || []);
        }
    }, [commande]);

    useEffect(() => {
        if (formData.restaurant_id) {
            const filteredTables = tables.filter(table => 
                table.restaurant_id == formData.restaurant_id
            );
            setAvailableTables(filteredTables);
            if (!filteredTables.some(t => t.id == formData.table_id)) {
                setFormData(prev => ({ ...prev, table_id: filteredTables[0]?.id || '' }));
            }
        }
    }, [formData.restaurant_id, formData.table_id, tables]);

    useEffect(() => {
        // Calculer le total prix
        const total = selectedPlats.reduce((sum, plat) => {
            return sum + (plat.quantite * plat.prix_unitaire);
        }, 0);
        setFormData(prev => ({ ...prev, total_prix: total }));
    }, [selectedPlats]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddPlat = (plat) => {
        if (!selectedPlats.some(p => p.id === plat.id)) {
            setSelectedPlats(prev => [...prev, { 
                ...plat, 
                quantite: 1, 
                prix_unitaire: plat.prix,
                commentaire: '' 
            }]);
        }
    };

    const handleRemovePlat = (platId) => {
        setSelectedPlats(prev => prev.filter(p => p.id !== platId));
    };

    const handlePlatChange = (platId, field, value) => {
        setSelectedPlats(prev => prev.map(plat => 
            plat.id === platId ? { ...plat, [field]: value } : plat
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const platsData = selectedPlats.map(plat => ({
            id: plat.id,
            quantite: parseInt(plat.quantite),
            prix_unitaire: parseFloat(plat.prix_unitaire),
            commentaire: plat.commentaire
        }));

        onSubmit({
            ...formData,
            plats: platsData
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="restaurant_id">Restaurant</label>
                    <select
                        id="restaurant_id"
                        name="restaurant_id"
                        value={formData.restaurant_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    >
                        {restaurants.map(restaurant => (
                            <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="table_id">Table</label>
                    <select
                        id="table_id"
                        name="table_id"
                        value={formData.table_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    >
                        {availableTables.map(table => (
                            <option key={table.id} value={table.id}>
                                {table.name} (Code: {table.code})
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="service_type">Type de service</label>
                    <select
                        id="service_type"
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    >
                        <option value="sur_place">Sur place</option>
                        <option value="a_emporter">À emporter</option>
                        <option value="livraison">Livraison</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="status">Statut</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    >
                        <option value="en_attente">En attente</option>
                        <option value="en_cours">En cours</option>
                        <option value="terminee">Terminée</option>
                        <option value="annulee">Annulée</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="payment_method">Méthode de paiement</label>
                    <select
                        id="payment_method"
                        name="payment_method"
                        value={formData.payment_method}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="">Non spécifié</option>
                        <option value="espece">Espèces</option>
                        <option value="carte">Carte</option>
                        <option value="online">En ligne</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="payment_status">Statut paiement</label>
                    <select
                        id="payment_status"
                        name="payment_status"
                        value={formData.payment_status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    >
                        <option value="non_paye">Non payé</option>
                        <option value="partiel">Partiel</option>
                        <option value="paye">Payé</option>
                    </select>
                </div>
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Total: {formData.total_prix.toFixed(2)} €</label>
            </div>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Plats commandés</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-700 mb-2">Ajouter des plats</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {plats
                                .filter(plat => plat.restaurant_id == formData.restaurant_id)
                                .map(plat => (
                                    <div key={plat.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium">{plat.name}</p>
                                            <p className="text-sm text-gray-500">{plat.prix.toFixed(2)} €</p>
                                        </div>
                                        {!selectedPlats.some(p => p.id === plat.id) ? (
                                            <button
                                                type="button"
                                                onClick={() => handleAddPlat(plat)}
                                                className="px-2 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                                            >
                                                Ajouter
                                            </button>
                                        ) : (
                                            <span className="text-sm text-gray-400">Déjà ajouté</span>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-700 mb-2">Plats sélectionnés</h4>
                        {selectedPlats.length > 0 ? (
                            <ul className="space-y-3">
                                {selectedPlats.map(plat => (
                                    <li key={plat.id} className="border-b pb-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <p className="font-medium">{plat.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {plat.prix_unitaire.toFixed(2)} € l'unité
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePlat(plat.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-sm text-gray-600">Quantité</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={plat.quantite}
                                                    onChange={(e) => handlePlatChange(plat.id, 'quantite', e.target.value)}
                                                    className="w-full px-2 py-1 border rounded text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-600">Prix unitaire</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={plat.prix_unitaire}
                                                    onChange={(e) => handlePlatChange(plat.id, 'prix_unitaire', e.target.value)}
                                                    className="w-full px-2 py-1 border rounded text-sm"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-1">
                                            <label className="text-sm text-gray-600">Commentaire</label>
                                            <input
                                                type="text"
                                                value={plat.commentaire}
                                                onChange={(e) => handlePlatChange(plat.id, 'commentaire', e.target.value)}
                                                className="w-full px-2 py-1 border rounded text-sm"
                                                placeholder="Sans oignons, etc."
                                            />
                                        </div>
                                        
                                        <div className="mt-1 text-right text-sm font-medium">
                                            Total: {(plat.quantite * plat.prix_unitaire).toFixed(2)} €
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">Aucun plat sélectionné</p>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                    Enregistrer
                </button>
            </div>
        </form>
    );
}
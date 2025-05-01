import { useState, useEffect } from 'react';

export default function EltCommandeForm({ eltCommande, commandes, plats, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(eltCommande || {
        commande_id: commandes[0]?.id || '',
        plat_id: plats[0]?.id || '',
        quantity: 1,
        notes: '',
        prix: 0
    });

    const [selectedPlat, setSelectedPlat] = useState(null);

    useEffect(() => {
        if (eltCommande) {
            setFormData(eltCommande);
            const plat = plats.find(p => p.id === eltCommande.plat_id);
            setSelectedPlat(plat);
        }
    }, [eltCommande, plats]);

    useEffect(() => {
        if (formData.plat_id) {
            const plat = plats.find(p => p.id == formData.plat_id);
            setSelectedPlat(plat);
            setFormData(prev => ({
                ...prev,
                prix: plat?.prix || 0
            }));
        }
    }, [formData.plat_id, plats]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'prix' ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="commande_id">Commande</label>
                    <select
                        id="commande_id"
                        name="commande_id"
                        value={formData.commande_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    >
                        {commandes.map(commande => (
                            <option key={commande.id} value={commande.id}>
                                Commande #{commande.id} - {commande.restaurant?.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="plat_id">Plat</label>
                    <select
                        id="plat_id"
                        name="plat_id"
                        value={formData.plat_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    >
                        {plats.map(plat => (
                            <option key={plat.id} value={plat.id}>
                        {plat.name} - {Number(plat.prix).toFixed(2)} €
                        </option>
                        ))}
                    </select>
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="quantity">Quantité</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="prix">Prix unitaire</label>
                    <input
                        type="number"
                        id="prix"
                        name="prix"
                        min="0"
                        step="0.01"
                        value={formData.prix}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    rows="2"
                />
            </div>
            
            {selectedPlat && (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-600 mb-1">Résumé</h4>
                    <p className="text-sm">
                    {formData.quantity} x {selectedPlat.name} à {typeof formData.prix === 'number' ? formData.prix.toFixed(2) : 'Prix non disponible'} €                    </p>
                    <p className="text-sm font-bold mt-1">
                        Total: {(formData.quantity * formData.prix).toFixed(2)} €
                    </p>
                </div>
            )}
            
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
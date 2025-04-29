import { useState, useEffect } from 'react';

export default function TableForm({ table, restaurants, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(table || {
        name: '',
        code: '',
        nb_place: 4,
        active: true,
        restaurant_id: restaurants[0]?.id || ''
    });

    useEffect(() => {
        if (table) {
            setFormData(table);
        }
    }, [table]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">Nom</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="code">Code</label>
                <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="nb_place">Nombre de places</label>
                <input
                    type="number"
                    id="nb_place"
                    name="nb_place"
                    min="1"
                    value={formData.nb_place}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>
            
            <div className="mb-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        className="rounded text-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Table active</span>
                </label>
            </div>
            
            <div className="mb-4">
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
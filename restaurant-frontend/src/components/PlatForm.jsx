import { useState, useEffect } from 'react';

export default function PlatForm({ plat, categories, restaurants, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(plat || {
        name: '',
        description: '',
        prix: 0,
        image: null,
        disponible: true,
        en_vedette: false,
        categorie_id: categories[0]?.id || '',
        restaurant_id: restaurants[0]?.id || ''
    });

    const [imagePreview, setImagePreview] = useState(plat?.image || null);

    useEffect(() => {
        if (plat) {
            setFormData(plat);
            if (plat.image) {
                setImagePreview(`/storage/${plat.image}`);
            }
        }
    }, [plat]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        }
        console.log('FormData:', Object.fromEntries(data.entries()));
        onSubmit(data);
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
                <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                    rows="3"
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="prix">Prix (€)</label>
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
            
            <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="image">Image</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded-md"
                    accept="image/*"
                />
                {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded-md" />
                )}
            </div>
            
            <div className="mb-4 flex space-x-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="disponible"
                        checked={formData.disponible}
                        onChange={handleChange}
                        className="rounded text-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Disponible</span>
                </label>
                
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="en_vedette"
                        checked={formData.en_vedette}
                        onChange={handleChange}
                        className="rounded text-orange-500"
                    />
                    <span className="ml-2 text-gray-700">En vedette</span>
                </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="categorie_id">Catégorie</label>
                    <select
                        id="categorie_id"
                        name="categorie_id"
                        value={formData.categorie_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    >
                        {categories.map(categorie => (
                            <option key={categorie.id} value={categorie.id}>
                                {categorie.name}
                            </option>
                        ))}
                    </select>
                </div>
                
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
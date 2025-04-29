import { useEffect, useState } from 'react';
import PlatCard from '../components/PlatCard';
import PlatForm from '../components/PlatForm';
import Navbar from '../components/Navbar';

export default function AdminPlats() {
    const [plats, setPlats] = useState([]);
    const [categories, setCategories] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [editingPlat, setEditingPlat] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    useEffect(() => {
        fetchPlats();
        fetchCategories();
        fetchRestaurants();
    }, []);
    
    const fetchPlats = () => {
        fetch('http://localhost:8000/api/plats')
            .then(res => res.json())
            .then(data => setPlats(data))
            .catch(err => console.error(err));
    };
    
    const fetchCategories = () => {
        fetch('http://localhost:8000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    };
    
    const fetchRestaurants = () => {
        fetch('http://localhost:8000/api/restaurants')
            .then(res => res.json())
            .then(data => setRestaurants(data))
            .catch(err => console.error(err));
    };
    
    const handleCreate = () => {
        setEditingPlat(null);
        setShowForm(true);
    };
    
    const handleEdit = (plat) => {
        setEditingPlat(plat);
        setShowForm(true);
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
            fetch(`http://localhost:8000/api/plats/${id}`, {
                method: 'DELETE',
            })
            .then(() => {
                fetchPlats();
            })
            .catch(err => console.error(err));
        }
    };
    
    const handleSubmit = (formData) => {
        const url = editingPlat 
            ? `api/plats/${editingPlat.id}`
            : 'http://localhost:8000/api/plats';
            
        const method = editingPlat ? 'PUT' : 'POST';

        console.log('Submitting to:', url);
    console.log('Method:', method);
    console.log('FormData:', Object.fromEntries(formData.entries()));
        
        fetch(url, {
            method,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData,
        })
        .then(res => res.json())
        .then(() => {
            fetchPlats();
            setShowForm(false);
        })
        .catch(err => console.error(err));
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-orange-500">Gestion des Plats</h1>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                        Ajouter un plat
                    </button>
                </div>
                
                {showForm && (
                    <div className="mb-8">
                        <PlatForm 
                            plat={editingPlat}
                            categories={categories}
                            restaurants={restaurants}
                            onSubmit={handleSubmit}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plats.map(plat => (
                        <PlatCard 
                            key={plat.id} 
                            plat={plat} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
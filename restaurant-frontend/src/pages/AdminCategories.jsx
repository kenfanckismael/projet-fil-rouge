import { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import CategoryForm from '../components/CategoryForm';
import Navbar from '../components/Navbar';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    useEffect(() => {
        fetchCategories();
        fetchRestaurants();
    }, []);
    
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
        setEditingCategory(null);
        setShowForm(true);
    };
    
    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            fetch(`http://localhost:8000/api/categories/${id}`, {
                method: 'DELETE',
            })
            .then(() => {
                fetchCategories();
            })
            .catch(err => console.error(err));
        }
    };
    
    const handleSubmit = (formData) => {
        const url = editingCategory 
            ? `http://localhost:8000/api/categories/${editingCategory.id}`
            : 'http://localhost:8000/api/categories';
            
        const method = editingCategory ? 'PUT' : 'POST';
        
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(() => {
            fetchCategories();
            setShowForm(false);
        })
        .catch(err => console.error(err));
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-orange-500">Gestion des Catégories</h1>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                        Ajouter une catégorie
                    </button>
                </div>
                
                {showForm && (
                    <div className="mb-8">
                        <CategoryForm 
                            category={editingCategory}
                            restaurants={restaurants}
                            onSubmit={handleSubmit}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(category => (
                        <CategoryCard 
                            key={category.id} 
                            category={category} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
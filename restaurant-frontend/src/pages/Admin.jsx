import { useEffect, useState } from 'react';
import RestaurantForm from '../components/RestaurantForm';
import RestaurantCard from '../components/RestaurantCard';
import Navbar from '../components/Navbar';

export default function Admin() {
  const [restaurants, setRestaurants] = useState([]);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    fetchRestaurants();
  }, []);
  
  const fetchRestaurants = () => {
    fetch('http://localhost:8000/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  };
  
  const handleCreate = () => {
    setEditingRestaurant(null);
    setShowForm(true);
  };
  
  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setShowForm(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
      fetch(`http://localhost:8000/api/restaurants/${id}`, {
        method: 'DELETE',
      })
      .then(() => {
        fetchRestaurants();
      })
      .catch(err => console.error(err));
    }
  };
  
  const handleSubmit = (formData) => {
    const url = editingRestaurant 
      ? `http://localhost:8000/api/restaurants/${editingRestaurant.id}`
      : 'http://localhost:8000/api/restaurants';
      
    const method = editingRestaurant ? 'PUT' : 'POST';
    
    fetch(url, {
      method,
      body: formData,
    })
    .then(res => res.json())
    .then(() => {
      fetchRestaurants();
      setShowForm(false);
    })
    .catch(err => console.error(err));
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">Administration</h1>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Ajouter un restaurant
          </button>
        </div>
        
        {showForm && (
          <div className="mb-8">
            <RestaurantForm 
              restaurant={editingRestaurant}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <div key={restaurant.id} className="relative">
              <RestaurantCard restaurant={restaurant} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(restaurant)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(restaurant.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
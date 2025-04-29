import { useEffect, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import Navbar from '../components/Navbar';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:8000/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-orange-500 mb-8">Nos Restaurants</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
}
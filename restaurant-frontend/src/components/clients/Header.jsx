import { useEffect, useState } from 'react';
import { Menu, ShoppingCart, CreditCard, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import MenuDropdown from './MenuDropdown';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    // Remplace l'URL par celle de ton backend
    fetch('http://localhost:8000/api/restaurant/1')
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then(data => setRestaurant(data))
      .catch(err => {
        console.error("Erreur fetch restaurant:", err);
        // Données par défaut si échec
        setRestaurant({
          name: "Mon Restaurant",
          logo: "/logo.png",
          address: "Adresse inconnue",
          phoneNumber: "Non disponible"
        });
      });
  }, []);

  if (!restaurant) {
    return (
      <header className="px-6 py-4 bg-white shadow-md text-gray-500">
        Chargement du restaurant...
      </header>
    );
  }

  return (
    <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src={restaurant.logo ? `/storage/${restaurant.logo}` : '/logo.png'}
          alt="logo"
          className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
        />
        <div className="flex flex-col">
          <span className="text-xl font-bold text-orange-500">{restaurant.name}</span>
          <div className="flex items-center text-gray-500 text-sm gap-3">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>{restaurant.phoneNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-1 bg-orange-500 text-white px-3 py-2 rounded-md"
          >
            <Menu size={18} />
            <span>Menu</span>
          </button>
          {menuOpen && <MenuDropdown />}
        </div>

        <Link to="/commande" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <ShoppingCart size={20} />
        </Link>

        <Link to="/paiement" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <CreditCard size={20} />
        </Link>
      </div>
    </header>
  );
}

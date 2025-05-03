import React, { useEffect, useState } from 'react';
import Siedebar from '../components/Siedebar';
import Header from '../components/Header';
import PlatCard from '../components/PlatCard';
import PlatForm from '../components/PlatForm';
import { ChevronDown } from 'lucide-react';

const AdminPlats = () => {
  const [plats, setPlats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [editingPlat, setEditingPlat] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement des données au montage
  useEffect(() => {
    Promise.all([fetchPlats(), fetchCategories(), fetchRestaurants()])
      .finally(() => setLoading(false));
  }, []);

  // Récupérer les plats
  const fetchPlats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/plats');
      if (!res.ok) throw new Error('Erreur lors de la récupération des plats');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlats(data);
      } else {
        console.error('Les données des plats ne sont pas sous le bon format');
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue lors du chargement des plats');
    }
  };

  // Récupérer les catégories
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Récupérer les restaurants
  const fetchRestaurants = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/restaurants');
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Gestion de l'ajout
  const handleCreate = () => {
    setEditingPlat(null);
    setShowForm(true);
  };

  // Gestion de l'édition
  const handleEdit = (plat) => {
    setEditingPlat(plat);
    setShowForm(true);
  };

  // Suppression d'un plat
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      fetch(`http://localhost:8000/api/plats/${id}`, { method: 'DELETE' })
        .then(() => fetchPlats())
        .catch((err) => console.error(err));
    }
  };

  // Création ou mise à jour d'un plat
  const handleSubmit = (formData) => {
    const url = editingPlat
      ? `http://localhost:8000/api/plats/${editingPlat.id}`
      : 'http://localhost:8000/api/plats';
    const method = editingPlat ? 'PUT' : 'POST';

    fetch(url, {
      method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        fetchPlats();
        setShowForm(false);
      })
      .catch((err) => console.error(err));
  };

  // Filtrage des plats selon recherche et catégorie
  const filteredPlats = plats.filter(
    (plat) =>
      (plat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || (plat.categorie && plat.categorie.name === selectedCategory))
  );

  // Gestion de la fermeture du modal en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains('backdrop-blur-sm')) {
        setShowForm(false);
      }
    };

    if (showForm) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [showForm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FC8F33] to-[#F96540]">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-[199px] h-screen bg-white z-40">
        <Siedebar activeSection="Menu" />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-[199px] right-0 h-[80px] bg-white z-30 shadow">
        <Header title="POKE NOW." initials="PN" />
      </div>

      {/* Barre d'actions */}
      <div className="fixed top-[80px] left-[199px] right-0 h-[60px] bg-white z-20 flex items-center justify-between px-6 shadow">
        <h2 className="font-bold text-lg text-gray-800">Gestion des Plats</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Ajouter un plat
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="absolute top-[140px] left-[199px] right-0 h-[calc(100vh-140px)] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-12 w-12 text-white mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <p className="text-white font-semibold text-lg">Chargement des plats...</p>
          </div>
        </div>
      ) : (
        <main className="absolute top-[140px] left-[199px] right-0 h-[calc(100vh-140px)] overflow-y-auto p-6">
          {/* Popup Formulaire */}
          {showForm && (
            <div className="fixed inset-0 bg-orange-300 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="relative bg-white p-4 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Bouton pour fermer le popup */}
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  aria-label="Fermer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h2 className="text-lg font-bold mb-4 text-center">
                  {editingPlat ? 'Modifier le Plat' : 'Ajouter un Plat'}
                </h2>
                <PlatForm
                  plat={editingPlat}
                  categories={categories || []}
                  restaurants={restaurants || []}
                  onSubmit={handleSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          )}

          {/* Filtres */}
          <section className="sticky top-0 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            {/* Recherche */}
            <div className="relative w-full sm:w-1/2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher des plats..."
                className="w-full pl-9 pr-3 py-2 rounded-lg shadow-sm bg-white placeholder-gray-400 text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
              </div>
            </div>

            {/* Dropdown catégories */}
            <div className="relative w-full sm:w-1/3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2 bg-white rounded-lg shadow-sm flex justify-between items-center text-sm"
              >
                {selectedCategory || 'Catégorie'}
                <ChevronDown className="w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <ul className="absolute z-10 w-full  bg-white shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto text-sm">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Liste des plats */}
          <section className="bg-[#EFF3F6] p-6 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredPlats.map((plat) => (
                <PlatCard
                  key={plat.id}
                  plat={plat}
                  category={plat.categorie?.name}
                  restaurant={plat.restaurant?.name}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default AdminPlats;

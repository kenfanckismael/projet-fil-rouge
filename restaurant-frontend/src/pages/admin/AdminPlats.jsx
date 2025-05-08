import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Siedebar';
import PlatCard from '../../components/plats/PlatCard';
import PlatForm from '../../components/plats/PlatForm';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPlats = () => {
  // États
  const [plats, setPlats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [editingPlat, setEditingPlat] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Effets
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [platsRes, categoriesRes, restaurantsRes] = await Promise.all([
          fetch('http://localhost:8000/api/plats'),
          fetch('http://localhost:8000/api/categories'),
          fetch('http://localhost:8000/api/restaurants')
        ]);

        if (!platsRes.ok || !categoriesRes.ok || !restaurantsRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const [platsData, categoriesData, restaurantsData] = await Promise.all([
          platsRes.json(),
          categoriesRes.json(),
          restaurantsRes.json()
        ]);

        setPlats(Array.isArray(platsData) ? platsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setRestaurants(Array.isArray(restaurantsData) ? restaurantsData : []);
      } catch (err) {
        console.error(err);
        setError(err.message);
        showNotification('Erreur lors du chargement des données', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonctions utilitaires
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const resetForm = () => {
    setEditingPlat(null);
    setShowForm(false);
  };

  // Handlers
  const handleCreate = () => {
    setEditingPlat(null);
    setShowForm(true);
  };

  const handleEdit = (plat) => {
    setEditingPlat(plat);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/plats/${id}`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) {
          throw new Error('Échec de la suppression');
        }
        
        fetchPlats();
        showNotification('Plat supprimé avec succès');
      } catch (err) {
        console.error(err);
        showNotification(err.message, 'error');
      }
    }
  };

  const fetchPlats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/plats');
      if (!res.ok) throw new Error('Erreur lors de la récupération des plats');
      const data = await res.json();
      setPlats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      showNotification('Erreur lors du chargement des plats', 'error');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingPlat
        ? `http://localhost:8000/api/plats/${editingPlat.id}`
        : 'http://localhost:8000/api/plats';
      
      const response = await fetch(url, {
        method: editingPlat ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la requête');
      }

      await fetchPlats();
      showNotification(
        editingPlat ? 'Plat modifié avec succès' : 'Plat créé avec succès'
      );
      resetForm();
    } catch (err) {
      showNotification(err.message, 'error');
      console.error('Erreur:', err);
    }
  };

  // Filtrage
  const filteredPlats = plats.filter(plat => {
    const matchesSearch = plat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || plat.categorie_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Rendu
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F76A00] to-[#F96540]">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
              notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            } text-white`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 w-[199px] h-screen bg-white z-40 shadow-lg">
        <Sidebar activeSection="Menu" />
      </aside>

      {/* Header */}
      <motion.header
        className="fixed top-0 left-[199px] right-0 h-[60px] bg-[#F76A00] z-20 flex items-center justify-between px-4 sm:px-6 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-semibold text-lg text-white">Gestion des Plats</h2>
        <button
          onClick={handleCreate}
          className="px-4 sm:px-6 py-2 bg-[#F96A00] text-white rounded-md shadow-lg hover:bg-[#F96540] transition-transform duration-200"
        >
          Ajouter un plat
        </button>
      </motion.header>

      {/* Contenu principal */}
      {loading ? (
        <div className="absolute top-[60px] left-[199px] right-0 h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-[#F76A00] to-[#F96540]">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-white mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <p className="text-white font-semibold text-lg">Chargement des plats...</p>
          </div>
        </div>
      ) : (
        <main className="absolute top-[60px] left-[199px] right-0 h-[calc(100vh-60px)] overflow-y-auto p-6 bg-[#F5F5F5] rounded-tl-2xl">
          {/* Formulaire modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && resetForm()}
              >
                <motion.div
                  className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                  variants={{
                    initial: { scale: 0.8, opacity: 0 },
                    animate: { scale: 1, opacity: 1 },
                    exit: { scale: 0.8, opacity: 0 },
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={resetForm}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Fermer le formulaire"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-bold mb-4 text-center text-[#F76A00]">
                    {editingPlat ? 'Modifier le Plat' : 'Ajouter un Plat'}
                  </h2>
                  <PlatForm
                    plat={editingPlat}
                    categories={categories}
                    restaurants={restaurants}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Barre de recherche et filtres */}
          <section className="sticky top-0 z-20 mb-8 flex flex-col sm:flex-row justify-between gap-4 bg-[#F5F5F5] pt-2 pb-4">
            <div className="relative w-full sm:w-1/2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher des plats..."
                className="w-full pl-9 pr-3 py-2 rounded-lg shadow-sm bg-white text-sm placeholder-gray-400 transition focus:ring-2 focus:ring-[#F76A00] focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
              </div>
            </div>

            <div className="relative w-full sm:w-1/3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2 bg-white rounded-lg shadow-sm flex justify-between items-center text-sm hover:bg-orange-100"
              >
                {selectedCategory 
                  ? categories.find(c => c.id === selectedCategory)?.name || 'Catégorie'
                  : 'Toutes catégories'}
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.ul
                    className="absolute z-10 w-full bg-white shadow-lg rounded-lg mt-1 max-h-60 overflow-y-auto text-sm"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <li
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                    >
                      Toutes catégories
                    </li>
                    {categories.map((cat) => (
                      <li
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                      >
                        {cat.name}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Liste des plats */}
          <section className="bg-[#EFF3F6] p-6 rounded-xl">
            {error ? (
              <div className="text-center py-8 text-red-500">
                {error}
              </div>
            ) : filteredPlats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun plat trouvé
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {filteredPlats.map((plat) => (
                  <motion.div
                    key={plat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PlatCard
                      plat={plat}
                      category={categories.find(c => c.id === plat.categorie_id)?.name}
                      restaurant={restaurants.find(r => r.id === plat.restaurant_id)?.name}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
};

export default AdminPlats;
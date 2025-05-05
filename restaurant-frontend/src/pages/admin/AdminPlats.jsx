import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Siedebar';
import PlatCard from '../../components/plats/PlatCard';
import PlatForm from '../../components/plats/PlatForm';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchPlats(), fetchCategories(), fetchRestaurants()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchPlats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/plats');
      if (!res.ok) throw new Error('Erreur lors de la récupération des plats');
      const data = await res.json();
      setPlats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des plats.');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/restaurants');
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

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
        await fetch(`http://localhost:8000/api/plats/${id}`, { method: 'DELETE' });
        fetchPlats();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (formData) => {
    const url = editingPlat
      ? `http://localhost:8000/api/plats/${editingPlat.id}`
      : 'http://localhost:8000/api/plats';
    const method = editingPlat ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });
      fetchPlats();
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPlats = plats.filter(
    (plat) =>
      (plat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || plat.categorie?.name === selectedCategory)
  );

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

  const modalVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F76A00] to-[#F96540]">
      <aside className="fixed top-0 left-0 w-[199px] h-screen bg-white z-40 shadow-lg">
        <Sidebar activeSection="Menu" />
      </aside>

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
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="fixed inset-0 bg-orange-300 bg-opacity-30 backdrop-blur-lg flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                  variants={modalVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  aria-live="assertive"
                >
                  <button
                    onClick={() => setShowForm(false)}
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
                    onCancel={() => setShowForm(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="sticky top-0 z-20 mb-8 flex flex-col sm:flex-row justify-between gap-4">
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
                {selectedCategory || 'Catégorie'}
                <ChevronDown className="w-4 h-4" />
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
                    {categories.map((cat) => (
                      <li
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.name);
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

          <section className="bg-[#EFF3F6] p-6 rounded-xl">
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
                    category={plat.categorie?.name}
                    restaurant={plat.restaurant?.name}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default AdminPlats;

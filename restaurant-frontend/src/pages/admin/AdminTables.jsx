import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Siedebar from '../../components/Siedebar';
import TableCard from '../../components/tables/TableCard';
import TableForm from '../../components/tables/TableForm';

const headerVariants = {
  hidden: { y: -60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const buttonVariants = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [editingTable, setEditingTable] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('tables');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tablesRes, restaurantsRes] = await Promise.all([
          fetch('http://localhost:8000/api/tables'),
          fetch('http://localhost:8000/api/restaurants'),
        ]);

        if (!tablesRes.ok || !restaurantsRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const [tablesData, restaurantsData] = await Promise.all([tablesRes.json(), restaurantsRes.json()]);
        setTables(tablesData);
        setRestaurants(restaurantsData);
      } catch (err) {
        setError(err.message);
        console.error('Erreur de chargement:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingTable(null);
    setShowForm(true);
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cette table ?')) {
      try {
        const res = await fetch(`http://localhost:8000/api/tables/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Erreur suppression');
        setTables(tables.filter((t) => t.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const isEditing = !!editingTable;
      const url = isEditing
        ? `http://localhost:8000/api/tables/${editingTable.id}`
        : 'http://localhost:8000/api/tables';

      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erreur sauvegarde');

      const updated = await response.json();
      setTables(isEditing ? tables.map(t => t.id === updated.id ? updated : t) : [...tables, updated]);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FC8F33] to-[#F96540]">
      <div className="fixed top-0 left-0 w-[199px] h-screen bg-white z-40">
        <Siedebar activeSection="tables" />
      </div>

      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="fixed top-0 left-[199px] right-0 h-[60px] bg-white z-20 flex items-center px-6 overflow-x-auto gap-4 shadow-lg"
      >
        <motion.button
          variants={buttonVariants}
          onClick={() => setActiveTab('tables')}
          className={`px-6 py-3 rounded-xl font-nunito font-bold text-sm sm:text-base ${
            activeTab === 'tables'
              ? 'bg-[#F96540] text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Gestion des Tables
        </motion.button>
        <motion.button
          variants={buttonVariants}
          onClick={() => setActiveTab('qr-codes')}
          className={`px-6 py-3 rounded-xl font-nunito font-bold text-sm sm:text-base ${
            activeTab === 'qr-codes'
              ? 'bg-[#F96540] text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          QR Codes
        </motion.button>
      </motion.header>

      <main className="absolute top-[60px] left-[199px] right-0 h-[calc(100vh-60px)] overflow-y-auto p-4 lg:p-8">
        {isLoading ? (
          <div className="text-white font-nunito text-xl flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            Chargement en cours...
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#F96540] text-white rounded-lg hover:bg-[#E05530]"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              {activeTab === 'tables' && (
                <section>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="font-nunito font-bold text-2xl text-gray-800">Liste des Tables</h2>
                    <button
                      onClick={handleCreate}
                      className="px-6 py-3 bg-[#F96540] rounded-xl font-nunito font-bold text-white hover:bg-[#E05530] flex items-center gap-2"
                    >
                      <span className="text-xl">+</span>
                      <span>Ajouter une Table</span>
                    </button>
                  </div>

                  <div>
                    {tables.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tables.map((table) => (
                          <TableCard
                            key={table.id}
                            table={table}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">Aucune table disponible</div>
                    )}
                  </div>
                </section>
              )}

              {activeTab === 'qr-codes' && (
                <section>
                  <h2 className="font-nunito font-bold text-2xl text-gray-800 mb-6">Génération des QR Codes</h2>
                  {tables.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tables.map((table) => (
                        <div key={table.id} className="bg-white border p-6 rounded-xl shadow-sm">
                          <h3 className="font-bold text-[#F96540]">{table.name || `Table ${table.id}`}</h3>
                          <p className="text-sm text-gray-600">
                            {table.nb_place} places • {table.restaurant?.name || 'Non attribué'}
                          </p>
                          <div className="my-4 flex justify-center">
                            {table.qr_code_path ? (
                              <img
                                src={`/storage/${table.qr_code_path}`}
                                alt={table.code}
                                className="w-32 h-32 border rounded"
                              />
                            ) : (
                              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400">
                                QR ?
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={`/storage/${table.qr_code_path}`}
                              download={`QR_${table.code}.png`}
                              className={`px-4 py-2 rounded ${
                                table.qr_code_path
                                  ? 'bg-[#13BF7D] text-white'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              Télécharger
                            </a>
                            <button
                              onClick={() => handleEdit(table)}
                              className="px-4 py-2 bg-yellow-300 rounded"
                            >
                              Régénérer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">Aucune table disponible</div>
                  )}
                </section>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal popup pour ajouter/modifier une table */}
      {showForm && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex justify-center items-center p-4"
          initial={{ opacity: 0 }} // Commence avec une opacité nulle
          animate={{ opacity: 1 }} // Devient pleinement visible
          exit={{ opacity: 0 }} // Lors de la fermeture, devient invisible
          transition={{ duration: 0.3 }} // Durée de l'animation
        >
          <motion.div
            className="bg-white p-6 rounded-xl w-full max-w-lg relative shadow-lg"
            initial={{ y: -50 }} // Le modal commence légèrement plus haut
            animate={{ y: 0 }} // Et se déplace vers sa position finale
            exit={{ y: 50 }} // Lors de la fermeture, il se déplace légèrement vers le bas
            transition={{ duration: 0.3 }} // Durée de l'animation
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">
              {editingTable ? 'Modifier la Table' : 'Ajouter une Table'}
            </h3>
            <TableForm
              table={editingTable}
              restaurants={restaurants}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminTables;

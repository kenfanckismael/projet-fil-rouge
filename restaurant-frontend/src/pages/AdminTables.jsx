import React, { useEffect, useState } from 'react';
import Siedebar from '../components/Siedebar';
import TableCard from '../components/TableCard';
import TableForm from '../components/TableForm';
import Header from '../components/Header';

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
          fetch('http://localhost:8000/api/restaurants')
        ]);

        if (!tablesRes.ok || !restaurantsRes.ok) {
          throw new Error('Erreur lors du chargement des donn\u00e9es');
        }

        const [tablesData, restaurantsData] = await Promise.all([
          tablesRes.json(),
          restaurantsRes.json()
        ]);

        setTables(tablesData);
        setRestaurants(restaurantsData);
      } catch (err) {
        setError(err.message);
        console.error("Erreur de chargement:", err);
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
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/tables/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Échec de la suppression');
        }

        setTables(tables.filter(table => table.id !== id));
      } catch (err) {
        setError(err.message);
        console.error("Erreur de suppression:", err);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur lors de la sauvegarde');
      }

      const updatedTable = await response.json();

      setTables(isEditing 
        ? tables.map(t => t.id === updatedTable.id ? updatedTable : t)
        : [...tables, updatedTable]
      );
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FC8F33] to-[#F96540]">
        <div className="text-white font-nunito text-xl flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          Chargement en cours...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FC8F33] to-[#F96540]">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#F96540] text-white rounded-lg hover:bg-[#E05530] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FC8F33] to-[#F96540]">
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-white p-4 shadow-lg z-30">
        <Siedebar activeSection="tables" />
      </div>

      <div className="lg:ml-64">
        <div className="fixed top-0 left-0 lg:left-64 right-0 z-20 bg-white shadow-md">
          <Header title="POKE NOW." initials="PN" />
        </div>

        <div className="fixed top-20 left-0 lg:left-64 right-0 z-10 bg-white border-b border-gray-200 px-6 pt-4 pb-2">
          <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            <button
              onClick={() => setActiveTab('tables')}
              className={`px-6 py-2 rounded-xl font-nunito font-bold text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'tables'
                  ? 'bg-[#F96540] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Gestion des Tables
            </button>
            <button
              onClick={() => setActiveTab('qr-codes')}
              className={`px-6 py-2 rounded-xl font-nunito font-bold text-sm sm:text-base whitespace-nowrap ${
                activeTab === 'qr-codes'
                  ? 'bg-[#F96540] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              QR Codes
            </button>
          </div>
        </div>

        <main className="pt-[140px] px-4 lg:px-8 pb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              {activeTab === 'tables' ? (
                <section>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="font-nunito font-bold text-2xl text-gray-800">
                      Liste des Tables
                    </h2>
                    <button
                      onClick={handleCreate}
                      className="px-6 py-3 bg-[#F96540] rounded-xl font-nunito font-bold text-white hover:bg-[#E05530] transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <span className="text-xl">+</span>
                      <span>Ajouter une Table</span>
                    </button>
                  </div>

                  {showForm && (
                    <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-inner">
                      <TableForm
                        table={editingTable}
                        restaurants={restaurants}
                        onSubmit={handleSubmit}
                        onCancel={() => setShowForm(false)}
                      />
                    </div>
                  )}

                  {tables.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <div className="text-gray-400 mb-4 text-5xl">🍽️</div>
                      <h3 className="font-nunito text-gray-600 text-lg mb-2">
                        Aucune table disponible
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Commencez par ajouter votre première table
                      </p>
                      <button
                        onClick={handleCreate}
                        className="px-6 py-2 bg-[#F96540] text-white rounded-lg hover:bg-[#E05530] transition-colors"
                      >
                        Ajouter une table
                      </button>
                    </div>
                  )}
                </section>
              ) : (
                <section>
                  <h2 className="font-nunito font-bold text-2xl text-gray-800 mb-6">
                    Génération des QR Codes
                  </h2>

                  {tables.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tables.map((table) => (
                        <div key={table.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-nunito font-bold text-xl text-[#F96540]">
                                {table.name || `Table ${table.id}`}
                              </h3>
                              <p className="font-nunito text-gray-600 text-sm">
                                {table.nb_place} places • {table.restaurant?.name || 'Non attribué'}
                              </p>
                            </div>
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                              #{table.code}
                            </span>
                          </div>

                          <div className="flex justify-center my-4">
                            {table.qr_code_path ? (
                              <img 
                                src={`/storage/${table.qr_code_path}`}
                                alt={`QR Code ${table.code}`}
                                className="w-40 h-40 border-2 border-gray-200 rounded-lg object-contain"
                              />
                            ) : (
                              <div className="w-40 h-40 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
                                <span className="text-4xl mb-2">❓</span>
                                <span className="text-xs">QR Code non généré</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <a
                              href={table.qr_code_path}
                              download={`QR_${table.code}.png`}
                              className={`px-4 py-2 text-center rounded-lg font-nunito font-medium transition-colors ${
                                table.qr_code_path 
                                  ? 'bg-[#13BF7D] text-white hover:bg-green-600'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                              disabled={!table.qr_code_path}
                            >
                              Télécharger
                            </a>
                            <button
                              onClick={() => handleEdit(table)}
                              className="px-4 py-2 bg-[#FFDB5B] text-gray-800 rounded-lg font-nunito font-medium hover:bg-yellow-400 transition-colors"
                            >
                              Régénérer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <div className="text-gray-400 mb-4 text-5xl">📱</div>
                      <h3 className="font-nunito text-gray-600 text-lg mb-2">
                        Aucune table disponible
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Ajoutez des tables pour générer des QR Codes
                      </p>
                      <button
                        onClick={handleCreate}
                        className="px-6 py-2 bg-[#F96540] text-white rounded-lg hover:bg-[#E05530] transition-colors"
                      >
                        Ajouter une table
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminTables;

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
          fetch('http://localhost:8000/api/restaurants'),
        ]);

        if (!tablesRes.ok || !restaurantsRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }

        const [tablesData, restaurantsData] = await Promise.all([
          tablesRes.json(),
          restaurantsRes.json(),
        ]);

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
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-[199px] h-screen bg-white z-40">
        <Siedebar activeSection="tables" />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-[199px] right-0 h-[80px] bg-white z-30 shadow">
        <Header title="POKE NOW." initials="PN" />
      </div>

      {/* Tabs */}
      <div className="fixed top-[80px] left-[199px] right-0 h-[60px] bg-white z-20 flex items-center px-6 overflow-x-auto gap-4 shadow">
        <button
          onClick={() => setActiveTab('tables')}
          className={`px-6 py-3 rounded-xl font-nunito font-bold text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'tables' ? 'bg-[#F96540] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Gestion des Tables
        </button>
        <button
          onClick={() => setActiveTab('qr-codes')}
          className={`px-6 py-3 rounded-xl font-nunito font-bold text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'qr-codes' ? 'bg-[#F96540] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          QR Codes
        </button>
      </div>

      {/* Main Content */}
      <main className="absolute top-[140px] left-[199px] right-0 h-[calc(100vh-140px)] overflow-y-auto p-4 lg:p-8">
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
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#F96540] text-white rounded-lg hover:bg-[#E05530]">Réessayer</button>
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
                    <div className="text-center py-12 text-gray-500">Aucune table disponible</div>
                  )}
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
                          <p className="text-sm text-gray-600">{table.nb_place} places • {table.restaurant?.name || 'Non attribué'}</p>
                          <div className="my-4 flex justify-center">
                            {table.qr_code_path ? (
                              <img src={`/storage/${table.qr_code_path}`} alt={table.code} className="w-32 h-32 border rounded" />
                            ) : (
                              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-400">QR ?</div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <a
                              href={`/storage/${table.qr_code_path}`}
                              download={`QR_${table.code}.png`}
                              className={`px-4 py-2 rounded ${table.qr_code_path ? 'bg-[#13BF7D] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            >
                              Télécharger
                            </a>
                            <button onClick={() => handleEdit(table)} className="px-4 py-2 bg-yellow-300 rounded">Régénérer</button>
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
    </div>
  );
};

export default AdminTables;

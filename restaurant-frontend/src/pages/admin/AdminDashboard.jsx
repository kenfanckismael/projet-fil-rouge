import { useState, useEffect } from 'react';
import { Filter, RefreshCw, Menu } from 'lucide-react';
import { motion } from 'framer-motion';  // Importer motion pour l'animation
import LoadingSpinner from '../../components/commadeAdmin/LoadingSpinner';
import FilterPanel from '../../components/commadeAdmin/FilterPanel';
import OrderList from '../../components/commadeAdmin/OrderList';
import Siedebar from '../../components/Siedebar';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ tableId: '', status: '', paymentStatus: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [ordersRes, tablesRes] = await Promise.all([
        fetch('http://localhost:8000/api/commandes'),
        fetch('http://localhost:8000/api/tables')
      ]);
      if (!ordersRes.ok || !tablesRes.ok) throw new Error('Erreur API');
      const [ordersData, tablesData] = await Promise.all([
        ordersRes.json(),
        tablesRes.json()
      ]);
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          try {
            const itemsRes = await fetch(`http://localhost:8000/api/commandes/${order.id}/elements`);
            if (!itemsRes.ok) throw new Error();
            const itemsData = await itemsRes.json();
            return {
              ...order,
              items: itemsData.elements.map(item => ({
                ...item,
                plat_name: item.plat?.name || 'Plat inconnu'
              }))
            };
          } catch {
            return { ...order, items: [], itemsError: true };
          }
        })
      );
      setOrders(ordersWithItems);
      setTables(tablesData);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(prev => (prev === orderId ? null : orderId));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ tableId: '', status: '', paymentStatus: '' });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/commandes/${orderId}`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error();
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch {
      setError("Erreur mise à jour du statut.");
    }
  };

  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/commandes/${orderId}`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: newStatus }),
      });
      if (!response.ok) throw new Error();
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, payment_status: newStatus } : order
        )
      );
    } catch {
      setError("Erreur mise à jour statut paiement.");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData().finally(() => setIsRefreshing(false));
  };

  const filteredOrders = orders.filter(order =>
    (filters.tableId === '' || order.table_id.toString() === filters.tableId) &&
    (filters.status === '' || order.status === filters.status) &&
    (filters.paymentStatus === '' || order.payment_status === filters.paymentStatus)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden md:block w-52 bg-white border-r shadow-md fixed h-full">
        <Siedebar activeSection="Menu" />
      </div>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-white shadow-lg fixed h-full">
            <Siedebar activeSection="Menu" />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 ml-52">
        <motion.header
          initial={{ opacity: 0, y: -20 }}  // Initialisation : invisible et légèrement au-dessus
          animate={{ opacity: 1, y: 0 }}    // Animation : devient visible et se positionne à sa place
          exit={{ opacity: 0, y: -20 }}     // Lors de la sortie : redevient invisible et remonte
          transition={{ duration: 0.5 }}    // Durée de l'animation (ici 0.5s)
          className="sticky top-0 z-40 bg-white shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden text-orange-600 hover:text-orange-800"
              >
                <Menu size={28} />
              </button>
              <h2 className="text-xl font-semibold text-gray-700 mb-6">Gestion des commandes</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 bg-orange-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-xl hover:bg-orange-600 transition-transform transform hover:scale-105 shadow-md"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={18} />
                <span className="hidden md:inline">Filtrer</span>
              </button>
              <button
                className={`flex items-center gap-2 bg-white border text-orange-600 border-orange-500 px-3 py-2 md:px-4 md:py-2 rounded-xl hover:bg-orange-50 transition-transform transform hover:scale-105 shadow-md ${isRefreshing ? 'animate-pulse' : ''}`}
                onClick={handleRefresh}
              >
                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="hidden md:inline">Actualiser</span>
              </button>
            </div>
          </div>
        </motion.header>

        {/* Erreur */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow">
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Filtres */}
        {isFilterOpen && (
          <FilterPanel
            tables={tables}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
          />
        )}

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 py-6 flex-1">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
              {Object.values(filters).some(f => f !== '')
                ? "Aucune commande ne correspond aux critères sélectionnés."
                : "Aucune commande enregistrée."}
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <OrderList
                orders={filteredOrders}
                tables={tables}
                expandedOrder={expandedOrder}
                onToggleExpand={toggleOrderExpand}
                onStatusChange={updateOrderStatus}
                onPaymentStatusChange={updatePaymentStatus}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import OrderFilters from '../components/commadeAdmin/OrderFilters';
import OrderStatistics from '../components/commadeAdmin/OrderStatistics';
import OrderList from '../components/commadeAdmin/OrderList';

const GestionDesCommandes = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('tous');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('tous');

  // Utilisation de fetch pour charger les commandes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/commandes'); // Remplacez par votre URL d'API
        const data = await response.json();
        console.log('Commandes récupérées :', data); // Ajoutez ce log
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      }
    };

    fetchOrders();
  }, []);

  // Appliquer les filtres dès que les filtres ou les commandes changent
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...orders];
      
      if (statusFilter !== 'tous') {
        filtered = filtered.filter(o => o.status === statusFilter);
      }

      if (serviceTypeFilter !== 'tous') {
        filtered = filtered.filter(o => o.service_type === serviceTypeFilter);
      }

      setFilteredOrders(filtered);
    };

    applyFilters();
  }, [statusFilter, serviceTypeFilter, orders]);

  return (
    <div className="space-y-6">
      <OrderFilters 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
        serviceTypeFilter={serviceTypeFilter} 
        setServiceTypeFilter={setServiceTypeFilter}
      />
      <OrderStatistics filteredOrders={filteredOrders} />
      <OrderList orders={filteredOrders} setOrders={setOrders} />
    </div>
  );
};

export default GestionDesCommandes;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminTables from './pages/admin/AdminTables';
import AdminCategories from './pages/AdminCategories';
import AdminPlats from './pages/admin/AdminPlats';
import AdminCommandes from './pages/AdminCommandes';
import AdminEltCommandes from './pages/AdminEltCommandes';
import ClientTablePage from './pages/ClientTablePage';
import GestionDesCommandes from './pages/admin/AdminDashboard';

import Header from './components/Header';
import HomeClient from './pages/clients/Home';

// import Commande from './pages/Commande';
// import Paiement from './pages/Paiement';
import RestaurantMenu from './components/clients/RestaurantMenu';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/tables" element={<AdminTables />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/plats" element={<AdminPlats />} />
        <Route path="/admin/GestionDesCommandes" element={<GestionDesCommandes />} />
        <Route path="/admin/commandes" element={<AdminCommandes />} />
        <Route path="/admin/elt-commandes" element={<AdminEltCommandes />} />
        <Route path="/client/:table" element={<ClientTablePage />} />
        <Route path="/" element={<HomeClient />} />

        <Route path="/acceuil" element={<RestaurantMenu />} />
        
        {/* <Route path="/commande" element={<Commande />} />
        <Route path="/paiement" element={<Paiement />} /> */}
      </Routes>
    </Router>
  );
}
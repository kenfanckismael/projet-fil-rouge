import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminTables from './pages/admin/AdminTables';
import AdminPlats from './pages/admin/AdminPlats';
import GestionDesCommandes from './pages/admin/AdminDashboard';
import RestaurantMenu from './components/clients/RestaurantMenu';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/tables" element={<AdminTables />} />
        <Route path="/plats" element={<AdminPlats />} />
        <Route path="/GestionDesCommandes" element={<GestionDesCommandes />} />
        <Route path="/acceuil" element={<RestaurantMenu />} />
      </Routes>
    </Router>
  );
}
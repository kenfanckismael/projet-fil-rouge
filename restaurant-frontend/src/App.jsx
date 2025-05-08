import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminTables from './pages/admin/AdminTables';
import AdminPlats from './pages/admin/AdminPlats';
import GestionDesCommandes from './pages/admin/AdminDashboard';
import RestaurantMenu from './components/apres/RestaurantMenu';
import Login from './pages/admin/Login';
import ClientTablePage from './pages/clients/ClientTablePage';

export default function App() {
  return (
    
      <Routes>
        <Route path="/tables" element={<AdminTables />} />
        <Route path="/login" element={<Login />} />
        <Route path="/plats" element={<AdminPlats />} />
        <Route path="/GestionDesCommandes" element={<GestionDesCommandes />} />
        <Route path="/" element={<RestaurantMenu />} />
        <Route path="/client/:table" element={<ClientTablePage />} />
      </Routes>
    
  );
}
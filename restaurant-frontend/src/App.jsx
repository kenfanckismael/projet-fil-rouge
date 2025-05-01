import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminTables from './pages/AdminTables';
import AdminCategories from './pages/AdminCategories';
import AdminPlats from './pages/AdminPlats';
import AdminCommandes from './pages/AdminCommandes';
import AdminEltCommandes from './pages/AdminEltCommandes';
import ClientTablePage from './pages/ClientTablePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/tables" element={<AdminTables />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/plats" element={<AdminPlats />} />
        <Route path="/admin/commandes" element={<AdminCommandes />} />
        <Route path="/admin/elt-commandes" element={<AdminEltCommandes />} />
        <Route path="/client/:table" element={<ClientTablePage />} />
      </Routes>
    </Router>
  );
}
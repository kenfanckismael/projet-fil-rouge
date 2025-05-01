import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-orange-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Restaurant App</Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-orange-200">Accueil</Link>
          <Link to="/admin" className="text-white hover:text-orange-200">Admin</Link>
          <Link to="/admin/tables" className="text-white hover:text-orange-200">Tables</Link>
          <Link to="/admin/categories" className="text-white hover:text-orange-200">Catégories</Link>
          <Link to="/admin/plats" className="text-white hover:text-orange-200">Plats</Link>
          <Link to="/admin/commandes" className="text-white hover:text-orange-200">Commandes</Link>
          <Link to="/admin/elt-commandes" className="text-white hover:text-orange-200">Éléments</Link>
        </div>
      </div>
    </nav>
  );
}
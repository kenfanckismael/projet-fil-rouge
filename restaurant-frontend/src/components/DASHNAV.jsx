import { Link } from 'react-router-dom';

export default function Dashnav() {
  return (
    <nav className="bg-orange-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
          <div className="space-x-4">
            <nav className="bg-orange-500 p-4 shadow-md">
              <div className="container mx-auto flex justify-between items-center">
                <div className="space-x-4">
                <Link to="/admin/tables" className="text-white hover:text-orange-200">Tables</Link>
                <Link to="/admin" className="text-white hover:text-orange-200">Admin</Link>
                </div>
              </div>
            </nav>           
          </div>
      </div>
    </nav>
  );
}
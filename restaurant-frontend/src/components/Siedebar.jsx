import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ClipboardList,
  ShoppingCart,
  Settings,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <ClipboardList size={20} />, label: 'Menu', path: '/admin/plats' },
    { icon: <ShoppingCart size={20} />, label: 'Ordre', path: '/admin/GestionDesCommandes' },
    { icon: <Settings size={20} />, label: 'Paramètre', path: '/admin/tables' },
  ];

  return (
    <aside className="w-[199px] h-full flex flex-col justify-between bg-white p-4 mt-18">
      <div className="space-y-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={index}
              className={`border h-[48px] rounded-[10px] flex items-center gap-3 pl-3 cursor-pointer ${
                isActive ? 'bg-[#F96540] text-white' : 'text-black hover:bg-gray-100'
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="font-nunito font-medium text-[16px] leading-[22px]">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bouton Déconnexion */}
      <div
        className="h-[48px] bg-[#171A1F] rounded-[10px] flex items-center gap-3 pl-3 mt-6 cursor-pointer text-white"
        onClick={() => navigate('/login')}
      >
        <LogOut size={20} />
        <span className="font-nunito font-medium text-[16px] leading-[22px]">
          Déconnexion
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;

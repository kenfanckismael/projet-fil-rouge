import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ClipboardList,
  ShoppingCart,
  Settings,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: <ClipboardList size={20} />, label: 'Menu', path: '/plats' },
    { icon: <ShoppingCart size={20} />, label: 'Ordre', path: '/GestionDesCommandes' },
    { icon: <Settings size={20} />, label: 'Paramètre', path: '/tables' },
  ];

  return (
    <aside className="w-[199px] h-full flex flex-col bg-white p-4 mt-18">
      {/* Menu Principal */}
      <div className="space-y-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={index}
              className={`border h-[48px] rounded-[10px] flex items-center gap-3 pl-3 cursor-pointer ${
                isActive ? 'bg-[#F96540] text-white' : 'text-black hover:bg-gray-100'
              }`}
              onClick={() => window.location.href = item.path}
              role="menuitem"
              aria-label={item.label}
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
        onClick={() => logout()}
        role="button"
        aria-label="Déconnexion"
      >
        <LogOut size={20} />
        <span className="font-nunito font-medium text-[16px] leading-[22px]">
          Déconnexion
        </span>
      </div>

      <div className="flex-grow"></div>
    </aside>
  );
};

export default Sidebar;

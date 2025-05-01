import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { icon: '🏠', label: 'Dashboard', active: false },
    { icon: '📋', label: 'Menu', active: true },
    { icon: '🛒', label: 'Ordre', active: false },
    { icon: '⚙️', label: 'Parametre', active: false },
  ];

  return (
    <aside className="w-[199px] h-full flex flex-col justify-between bg-white p-4">
      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`h-[48px] rounded-[10px] flex items-center pl-3 transition-colors ${
              item.active
                ? 'bg-[#FC8F33] text-white'
                : 'bg-white border border-black text-[#171A1F]'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="font-nunito font-medium text-[16px] leading-[22px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bouton Déconnexion */}
      <div className="h-[48px] bg-[#171A1F] rounded-[10px] flex items-center pl-3 mt-6">
        <span className="mr-3">🚪</span>
        <span className="font-nunito font-medium text-[16px] leading-[22px] text-white">
          Deconnexion
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';

const Header = ({ title = "POKE NOW.", initials = "PN" }) => {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#FF8760] rounded-full flex items-center justify-center text-white font-bold shadow-md">
          {initials}
        </div>
        <span className="text-white font-catamaran font-extrabold text-xl hidden sm:block">
          {title}
        </span>
      </div>
      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 shadow"></div>
    </header>
  );
};

export default Header;
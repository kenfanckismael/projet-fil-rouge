import { PlusCircle, Star } from 'lucide-react';

export default function PlatCard({ plat, onClick, onAdd }) {
  return (
    <div
      onClick={onClick}
      className={`relative w-[180px] h-[360px] transform transition-transform duration-300 ease-in-out hover:scale-105 ${
        !plat.disponible ? 'opacity-50' : ''
      }`}
    >
      {/* Carte du plat */}
      <div className="absolute w-[180px] h-[260px] top-[40px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
        
        {/* Image */}
        {plat.image && (
          <div
            className="absolute w-[110px] h-[110px] left-[35px] top-[-50px] border-4 border-white rounded-full bg-cover bg-center shadow-md animate-bounce-slow"
            style={{ backgroundImage: `url('/storage/${plat.image}')` }}
          />
        )}

        {/* Nom du plat */}
        <h3 className="absolute w-full text-center top-[70px] font-semibold text-[15px] text-orange-600 px-2">
          {plat.name}
        </h3>

        {/* Description */}
        <p className="absolute top-[100px] left-[10px] right-[10px] text-xs text-gray-600 leading-tight text-center">
          {plat.description || 'Aucune description.'}
        </p>

        {/* Prix */}
        <p className="absolute left-[10px] bottom-[70px] font-bold text-sm text-orange-700">
          {Number(plat.prix).toFixed(2)} €
        </p>

        {/* Tags */}
        <div className="absolute bottom-[40px] left-[10px] flex gap-1 flex-wrap items-center">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              plat.disponible
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {plat.disponible ? 'Dispo' : 'Indispo'}
          </span>

          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              plat.en_vedette
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {plat.en_vedette ? (
              <Star size={12} className="inline text-yellow-500" />
            ) : (
              'Standard'
            )}
          </span>
        </div>

        {/* Bouton Ajouter */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          disabled={!plat.disponible}
          className="absolute bottom-[38px] right-[10px] text-orange-500 hover:text-orange-700 transition-transform transform hover:scale-110 disabled:opacity-30"
        >
          <PlusCircle size={20} className="drop-shadow-sm" />
        </button>
      </div>
    </div>
  );
}

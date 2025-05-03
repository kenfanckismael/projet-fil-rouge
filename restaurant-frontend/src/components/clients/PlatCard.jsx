import { PlusCircle, Star } from 'lucide-react'; // Icônes à utiliser

export default function PlatCard({ plat, onClick, onAdd }) {
  return (
    <div
      onClick={onClick}
      className={`relative w-[230px] h-[500px] transform transition-transform duration-300 ease-in-out hover:scale-105 ${
        !plat.disponible ? 'opacity-50' : ''
      }`}
    >
      {/* Carte du plat */}
      <div className="absolute w-[230px] h-[340px] left-0 top-[60px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-visible">
        
        {/* Image */}
        {plat.image && (
          <div
            className="absolute w-[170px] h-[170px] left-[30px] top-[-60px] border-4 border-white rounded-full bg-cover bg-center shadow-md animate-bounce-slow"
            style={{ backgroundImage: `url('/storage/${plat.image}')` }}
          />
        )}

        {/* Nom du plat */}
        <h3 className="absolute w-full text-center top-[120px] font-semibold text-[18px] text-orange-600">
          {plat.name}
        </h3>

        {/* Description */}
        <p className="absolute top-[160px] left-[12px] right-[12px] text-sm font-light text-gray-600 leading-tight text-center">
          {plat.description || 'Aucune description.'}
        </p>

        {/* Prix */}
        <p className="absolute left-[12px] bottom-[95px] font-bold text-md text-orange-700">
          {Number(plat.prix).toFixed(2)} €
        </p>

        {/* Tags */}
        <div className="absolute bottom-[55px] left-[12px] flex gap-1 flex-wrap items-center">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              plat.disponible
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {plat.disponible ? 'Disponible' : 'Indisponible'}
          </span>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              plat.en_vedette
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {plat.en_vedette ? <Star size={14} className="inline text-yellow-500" /> : 'Standard'}
          </span>
        </div>

        {/* Bouton Ajouter */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          disabled={!plat.disponible}
          className="absolute bottom-[50px] right-[12px] text-orange-500 hover:text-orange-700 transition-transform transform hover:scale-110 disabled:opacity-30"
        >
          <PlusCircle size={24} className="drop-shadow-sm" /> {/* Icône d'ajout */}
        </button>
      </div>
    </div>
  );
}

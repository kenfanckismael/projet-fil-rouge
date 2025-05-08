import { X } from 'lucide-react';

export default function PlatDetailModal({ plat, onClose, onAddToCart }) {

  // Fonction pour fermer le modal lorsque l'utilisateur clique à l'extérieur
  const handleOverlayClick = (e) => {
    // Ferme le modal si on clique en dehors de la boîte (overlay)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4 animate-fade-in"
      onClick={handleOverlayClick} // Appel de la fonction pour fermer en cliquant à l'extérieur
    >
      <div className="bg-white rounded-2xl w-full sm:max-w-md max-w-[90%] p-6 shadow-2xl relative transform transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-full p-1 shadow-sm transition"
        >
          <X size={20} />
        </button>

        <img
          src={`/storage/${plat.image}`}
          alt={plat.name}
          className="w-full h-48 object-cover rounded-xl mb-4 sm:h-60 md:h-72 lg:h-80"
        />

        <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">{plat.name}</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">{plat.description}</p>

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <span className="text-lg font-semibold text-green-600 mb-4 sm:mb-0">
            {Number(plat.prix).toFixed(2)} XAF
          </span>
          <button
            onClick={() => onAddToCart(plat)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl shadow-md transition transform hover:scale-105"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

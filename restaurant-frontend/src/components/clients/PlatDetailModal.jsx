import { X } from 'lucide-react';

export default function PlatDetailModal({ plat, onClose, onAddToCart }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative transform transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-full p-1 shadow-sm transition"
        >
          <X size={20} />
        </button>

        <img
          src={`/storage/${plat.image}`}
          alt={plat.name}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />

        <h2 className="text-2xl font-bold text-orange-600 mb-2">{plat.name}</h2>
        <p className="text-gray-600 mb-4">{plat.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-green-600">
            {Number(plat.prix).toFixed(2)}€
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

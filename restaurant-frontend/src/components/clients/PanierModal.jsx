import { X, PlusCircle, MinusCircle, ShoppingCart, CheckCircle } from 'lucide-react'; // Icônes à utiliser

export default function PanierModal({
  items,
  onClose,
  onModifierQuantite,
  onSupprimer,
  onValider,
  total,
  paymentMethod,
  setPaymentMethod,
  serviceType,
  setServiceType,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl p-6 animate-slide-up">
        
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-orange-600">
            <ShoppingCart size={22} />
            <h2 className="text-xl font-bold">Votre Panier</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-orange-500 transition">
            <X size={22} />
          </button>
        </div>

        {/* Liste des articles */}
        <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300">
          {items.map(item => (
            <div key={item.plat_id} className="border-b pb-3">
              <div className="flex justify-between font-semibold text-gray-700">
                <span>{item.nom}</span>
                <span>{(item.prix * item.quantity).toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => onModifierQuantite(item.plat_id, -1)} className="text-orange-500 hover:scale-110 transition-transform">
                    <MinusCircle size={20} />
                  </button>
                  <span className="text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => onModifierQuantite(item.plat_id, 1)} className="text-orange-500 hover:scale-110 transition-transform">
                    <PlusCircle size={20} />
                  </button>
                </div>
                <button
                  onClick={() => onSupprimer(item.plat_id)}
                  className="text-red-500 hover:scale-110 transition-transform"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paiement et service */}
        <div className="mt-6 flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moyen de paiement
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Sélectionner</option>
              <option value="carte">Carte bancaire</option>
              <option value="especes">Espèces</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de service
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Sélectionner</option>
              <option value="sur_place">Sur place</option>
              <option value="a_emporter">À emporter</option>
              <option value="livraison">Livraison</option>
            </select>
          </div>
        </div>

        {/* Total et validation */}
        <div className="mt-6">
          <div className="flex justify-between font-bold text-lg text-gray-800">
            <span>Total :</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <button
            onClick={onValider}
            disabled={items.length === 0 || !paymentMethod || !serviceType}
            className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle size={20} />
            Valider la commande
          </button>
        </div>
      </div>
    </div>
  );
}

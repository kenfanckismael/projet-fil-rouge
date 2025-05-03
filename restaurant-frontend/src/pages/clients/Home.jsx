import { useState, useEffect } from 'react';
import { ShoppingCart, PlusCircle, MinusCircle, X, Coffee } from 'lucide-react';

const CATEGORIES = ["Tous", "Entrées", "Plats principaux", "Desserts"];

export default function RestaurantMenu() {
  const [plats, setPlats] = useState([]);
  const [loadingPlats, setLoadingPlats] = useState(true);
  const [errorPlats, setErrorPlats] = useState(null);
  const [selectedPlat, setSelectedPlat] = useState(null);
  const [panier, setPanier] = useState([]);
  const [showPanier, setShowPanier] = useState(false);
  const [categorieActive, setCategorieActive] = useState("Tous");
  const [commande, setCommande] = useState({
    restaurant_id: 1,
    table_id: 3,
    total_prix: 0,
    status: "en attente",
    payment_method: "",
    payment_status: "non payé",
    service_type: "sur place"
  });

  // Chargement des plats depuis une API
  useEffect(() => {
    const fetchPlats = async () => {
      try {
        const response = await fetch('/api/plats'); // 🔁 Modifie cette URL si besoin
        if (!response.ok) throw new Error("Erreur lors du chargement des plats.");
        const data = await response.json();
        setPlats(data);
      } catch (error) {
        setErrorPlats(error.message);
      } finally {
        setLoadingPlats(false);
      }
    };

    fetchPlats();
  }, []);

  // Filtrer les plats par catégorie
  const platsFiltres = categorieActive === "Tous" ? plats : plats.filter(p => p.categorie === categorieActive);

  // Calcul du total du panier
  useEffect(() => {
    const total = panier.reduce((sum, item) => sum + item.prix * item.quantity, 0);
    setCommande(prev => ({ ...prev, total_prix: total }));
  }, [panier]);

  // Ajouter un plat au panier
  const ajouterAuPanier = (plat) => {
    const index = panier.findIndex(item => item.plat_id === plat.id);
    if (index >= 0) {
      const newPanier = [...panier];
      newPanier[index].quantity += 1;
      setPanier(newPanier);
    } else {
      setPanier([...panier, {
        commande_id: Date.now(),
        plat_id: plat.id,
        quantity: 1,
        notes: "",
        prix: plat.prix,
        nom: plat.name
      }]);
    }
    setSelectedPlat(null);
  };

  // Modifier la quantité
  const modifierQuantite = (id, delta) => {
    const nouveauPanier = panier
      .map(item => {
        if (item.plat_id === id) {
          const qty = item.quantity + delta;
          return qty <= 0 ? null : { ...item, quantity: qty };
        }
        return item;
      })
      .filter(Boolean);
    setPanier(nouveauPanier);
  };

  const supprimerDuPanier = (id) => {
    setPanier(panier.filter(item => item.plat_id !== id));
  };

  const validerCommande = () => {
    alert(`Commande validée ! Total: ${commande.total_prix.toFixed(2)}€`);
    setPanier([]);
    setShowPanier(false);
  };

  const DetailPlat = ({ plat, onClose, onAddToCart }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
        <div className="relative">
          <img src={plat.image} alt={plat.name} className="w-full h-48 object-cover" />
          <button onClick={onClose} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-800">{plat.name}</h2>
            <span className="text-lg font-semibold text-green-600">{plat.prix.toFixed(2)}€</span>
          </div>
          <p className="text-gray-600 mt-2">{plat.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className={`text-sm ${plat.disponible ? 'text-green-500' : 'text-red-500'}`}>
              {plat.disponible ? 'Disponible' : 'Indisponible'}
            </span>
            {plat.en_vedette && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                En vedette
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(plat)}
            disabled={!plat.disponible}
            className={`mt-4 w-full py-2 px-4 rounded ${
              plat.disponible ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );

  const Panier = ({ items, onClose, onModifierQuantite, onSupprimer, onValider, total }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-xl">
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Votre panier</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Votre panier est vide</p>
          ) : (
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.plat_id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.nom}</span>
                    <span>{(item.prix * item.quantity).toFixed(2)}€</span>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => onModifierQuantite(item.plat_id, -1)} className="text-gray-500 hover:text-blue-600">
                        <MinusCircle size={20} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onModifierQuantite(item.plat_id, 1)} className="text-gray-500 hover:text-blue-600">
                        <PlusCircle size={20} />
                      </button>
                    </div>
                    <button onClick={() => onSupprimer(item.plat_id)} className="text-red-500 hover:text-red-700">
                      <X size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-lg">{total.toFixed(2)}€</span>
          </div>
          <button
            onClick={onValider}
            disabled={items.length === 0}
            className={`w-full py-2 px-4 rounded ${
              items.length > 0 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 cursor-not-allowed text-gray-500'
            }`}
          >
            Valider la commande
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coffee size={24} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Restaurant Menu Digital</h1>
          </div>
          <button
            onClick={() => setShowPanier(true)}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
          >
            <ShoppingCart size={18} />
            <span className="font-medium">{panier.length}</span>
          </button>
        </div>
      </header>

      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-1 py-3">
            {CATEGORIES.map(categorie => (
              <button
                key={categorie}
                onClick={() => setCategorieActive(categorie)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  categorieActive === categorie
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {categorie}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loadingPlats && <p className="text-center text-gray-500">Chargement des plats...</p>}
        {errorPlats && <p className="text-center text-red-500">{errorPlats}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platsFiltres.map(plat => (
            <div
              key={plat.id}
              onClick={() => plat.disponible && setSelectedPlat(plat)}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg cursor-pointer ${
                !plat.disponible && 'opacity-60'
              }`}
            >
              <div className="relative">
                <img src={plat.image} alt={plat.name} className="w-full h-40 object-cover" />
                {plat.en_vedette && (
                  <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded">
                    En vedette
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between">
                  <h3 className="font-bold text-gray-800">{plat.name}</h3>
                  <span className="font-semibold text-green-600">{plat.prix.toFixed(2)}€</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{plat.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded ${
                    plat.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plat.disponible ? 'Disponible' : 'Indisponible'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (plat.disponible) {
                        ajouterAuPanier(plat);
                      }
                    }}
                    disabled={!plat.disponible}
                    className={`p-2 rounded-full ${
                      plat.disponible ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <PlusCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedPlat && (
        <DetailPlat plat={selectedPlat} onClose={() => setSelectedPlat(null)} onAddToCart={ajouterAuPanier} />
      )}

      {showPanier && (
        <Panier
          items={panier}
          onClose={() => setShowPanier(false)}
          onModifierQuantite={modifierQuantite}
          onSupprimer={supprimerDuPanier}
          onValider={validerCommande}
          total={commande.total_prix}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { ShoppingCart, Coffee } from 'lucide-react';
import PlatCard from '../clients/PlatCard';
import PlatDetailModal from '../clients/PlatDetailModal';
import PanierModal from '../clients/PanierModal';
import CategoryTabs from '../clients/CategoryTabs';
import { useSearchParams } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function RestaurantMenu() {
  const [searchParams] = useSearchParams();
  const tableIdFromUrl = parseInt(searchParams.get('table_id')) || 0;

  const [plats, setPlats] = useState([]);
  const [categories, setCategories] = useState(['Tous']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorieActive, setCategorieActive] = useState('Tous');
  const [selectedPlat, setSelectedPlat] = useState(null);
  const [panier, setPanier] = useState([]);
  const [showPanier, setShowPanier] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [serviceType, setServiceType] = useState('');

  const [commande, setCommande] = useState({
    restaurant_id: 1,
    table_id: tableIdFromUrl,
    total_prix: 0,
    status: 'en attente',
    payment_method: '',
    payment_status: 'non payé',
    service_type: '',
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/plats')
      .then(res => res.json())
      .then(setPlats)
      .catch(err => setError(err.message));

    fetch('http://localhost:8000/api/categories')
      .then(res => res.json())
      .then(data => {
        const noms = data.map(cat => cat.name);
        setCategories(['Tous', ...noms]);
      })
      .catch(err => console.error('Erreur chargement catégories :', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const total = panier.reduce((sum, p) => sum + p.prix * p.quantity, 0);
    setCommande(prev => ({ ...prev, total_prix: total }));
  }, [panier]);

  const platsFiltres =
    categorieActive === 'Tous'
      ? plats
      : plats.filter(p => p.categorie === categorieActive || p.categorie?.name === categorieActive);

  const ajouterAuPanier = (plat) => {
    setPanier(prev => {
      const exist = prev.find(p => p.plat_id === plat.id);
      return exist
        ? prev.map(p => p.plat_id === plat.id
          ? { ...p, quantity: p.quantity + 1 }
          : p)
        : [...prev, {
          plat_id: plat.id,
          quantity: 1,
          prix: plat.prix,
          nom: plat.name,
          notes: ''
        }];
    });
    setSelectedPlat(null);
  };

  const modifierQuantite = (id, delta) => {
    setPanier(p =>
      p.map(item =>
        item.plat_id === id
          ? { ...item, quantity: item.quantity + delta }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const supprimerDuPanier = (id) => {
    setPanier(p => p.filter(item => item.plat_id !== id));
  };

  const validerCommande = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/elt-commandes/multiple', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...commande,
          payment_method: paymentMethod,
          service_type: serviceType,
          elts: panier.map(p => ({
            plat_id: p.plat_id,
            quantity: p.quantity,
            prix: p.prix,
            notes: p.notes || '',
          }))
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la validation de la commande');
      const result = await response.json();

      alert(`Commande validée ! Total: ${commande.total_prix.toFixed(2)}XAF`);
      setPanier([]);
      setShowPanier(false);
      setPaymentMethod('');
      setServiceType('');
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 animate-fade-in">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 animate-bounce">
            <Coffee size={28} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-orange-600 transition duration-500 hover:scale-105">Menu Digital</h1>
          </div>
          <button
            onClick={() => setShowPanier(true)}
            className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow-md transition transform hover:scale-105"
          >
            <ShoppingCart size={20} className="mr-2 animate-pulse" />
            <span>{panier.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </button>
        </div>
      </header>

      <CategoryTabs
        categories={categories}
        active={categorieActive}
        onChange={setCategorieActive}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-600 text-center mb-10 relative">
          <span className="relative z-10">Menu</span>
          <span className="absolute left-1/2 -bottom-2 w-20 h-1 bg-orange-400 rounded-full transform -translate-x-1/2"></span>
        </h2>

        {loading && (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-8 h-8 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
            <p className="text-orange-600 text-lg animate-pulse">Chargement des plats...</p>
          </div>
        )}
        {error && <p className="text-red-500 font-medium">{error}</p>}

        {/* Plats en vedette */}
        {plats.some(p => p.en_vedette) && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-green-700 mb-4 text-left">Plats en Vedette</h3>
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop={true}
              speed={1000}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {plats.filter(p => p.en_vedette).map(plat => (
                <SwiperSlide key={plat.id}>
                  <PlatCard
                    plat={plat}
                    onClick={() => plat.disponible && setSelectedPlat(plat)}
                    onAdd={() => plat.disponible && ajouterAuPanier(plat)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {platsFiltres.map(plat => (
            <PlatCard
              key={plat.id}
              plat={plat}
              onClick={() => plat.disponible && setSelectedPlat(plat)}
              onAdd={() => plat.disponible && ajouterAuPanier(plat)}
            />
          ))}
        </div>
      </main>

      {selectedPlat && (
        <PlatDetailModal
          plat={selectedPlat}
          onClose={() => setSelectedPlat(null)}
          onAddToCart={ajouterAuPanier}
        />
      )}

      {showPanier && (
        <PanierModal
          items={panier}
          total={commande.total_prix}
          onClose={() => setShowPanier(false)}
          onModifierQuantite={modifierQuantite}
          onSupprimer={supprimerDuPanier}
          onValider={validerCommande}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          serviceType={serviceType}
          setServiceType={setServiceType}
        />
      )}
    </div>
  );
}

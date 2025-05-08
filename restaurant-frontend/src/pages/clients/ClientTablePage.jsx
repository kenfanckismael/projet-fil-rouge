import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Coffee } from 'lucide-react';
import PlatCard from '../../components/clients/PlatCard';
import PlatDetailModal from '../../components/clients/PlatDetailModal';
import PanierModal from '../../components/clients/PanierModal';
import CategoryTabs from '../../components/clients/CategoryTabs';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function ClientTablePage() {
    const { table } = useParams();
    const [tableData, setTableData] = useState(null);
    const [restaurant, setRestaurant] = useState(null);

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
        restaurant_id: 0,
        table_id: 0,
        total_prix: 0,
        status: 'en attente',
        payment_method: '',
        payment_status: 'non payé',
        service_type: '',
    });

    const categoryRefs = useRef({});

    const scrollToCategory = (catName) => {
        setCategorieActive(catName);
        setTimeout(() => {
            const section = categoryRefs.current[catName];
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }, 50);
    };

    useEffect(() => {
        if (table) {
            let currentTable = null;
            let currentResto = null;

            fetch(`http://localhost:8000/api/tables?code=${table}`)
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        currentTable = data[0];
                        setTableData(currentTable);
                        return fetch(`http://localhost:8000/api/restaurants/${currentTable.restaurant_id}`);
                    }
                    throw new Error('Table non trouvée');
                })
                .then(res => res.json())
                .then(resto => {
                    currentResto = resto;
                    setRestaurant(currentResto);
                    setCommande(prev => ({
                        ...prev,
                        table_id: currentTable.id,
                        restaurant_id: currentResto.id
                    }));
                    return fetch('http://localhost:8000/api/plats');
                })
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
        }
    }, [table]);

    useEffect(() => {
        const total = panier.reduce((sum, p) => sum + p.prix * p.quantity, 0);
        setCommande(prev => ({ ...prev, total_prix: total }));
    }, [panier]);

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

    const platsParCategorie = plats.reduce((acc, plat) => {
        const cat = plat.categorie?.name || 'Autres';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(plat);
        return acc;
    }, {});

    if (!tableData) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto py-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            Table non trouvée
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Le code de table "{table}" n'existe pas ou n'est pas actif.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 animate-fade-in">
            <header className="bg-white shadow-md sticky top-0 z-50 w-full">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Coffee size={28} className="text-orange-500" />
                        <div>
                            <h1 className="text-xl font-bold text-orange-600">{restaurant?.name || 'Menu Digital'}</h1>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span>Table: {tableData.name}</span>
                                <span>•</span>
                                <span>{tableData.nb_place} places</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPanier(true)}
                        className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl shadow-md transition transform hover:scale-105"
                    >
                        <ShoppingCart size={20} className="mr-2" />
                        <span>{panier.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </button>
                </div>
            </header>

            <CategoryTabs
                categories={categories}
                active={categorieActive}
                onChange={scrollToCategory}
                className="fixed top-0 left-0 w-full z-50 bg-white shadow-md"
            />

            <main className="max-w-6xl mx-auto px-4 py-8 main-content">
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

                {plats.some(p => p.en_vedette) && (
                    <section className="mb-12">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-4 text-left">Plats en Vedette</h3>
                        <Swiper
                            modules={[Autoplay]}
                            autoplay={{ delay: 2000, disableOnInteraction: false }}
                            loop={true}
                            speed={1000}
                            spaceBetween={12}
                            breakpoints={{
                                320: { slidesPerView: 1 },
                                640: { slidesPerView: 2 },
                                768: { slidesPerView: 3 },
                                1024: { slidesPerView: 4 },
                                1280: { slidesPerView: 5 },
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

                {categories.filter(cat => cat !== 'Tous').map(cat => (
                    <section key={cat} ref={el => categoryRefs.current[cat] = el} className="mb-12">
                        <h3 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-4">{cat}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                            {platsParCategorie[cat]?.map(plat => (
                                <PlatCard
                                    key={plat.id}
                                    plat={plat}
                                    onClick={() => plat.disponible && setSelectedPlat(plat)}
                                    onAdd={() => plat.disponible && ajouterAuPanier(plat)}
                                />
                            ))}
                        </div>
                    </section>
                ))}
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
                    className="max-w-full sm:max-w-md"
                />
            )}
        </div>
    );
}

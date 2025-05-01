import { useEffect, useState } from 'react';
import EltCommandeCard from '../components/EltCommandeCard';
import EltCommandeForm from '../components/EltCommandeForm';
import Navbar from '../components/Navbar';

export default function AdminEltCommandes() {
    const [eltCommandes, setEltCommandes] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [plats, setPlats] = useState([]);
    const [editingEltCommande, setEditingEltCommande] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    useEffect(() => {
        fetchEltCommandes();
        fetchCommandes();
        fetchPlats();
    }, []);
    
    const fetchEltCommandes = () => {
        fetch('http://localhost:8000/api/elt-commandes')
            .then(res => res.json())
            .then(data => setEltCommandes(data))
            .catch(err => console.error(err));
    };
    
    const fetchCommandes = () => {
        fetch('http://localhost:8000/api/commandes')
            .then(res => res.json())
            .then(data => setCommandes(data))
            .catch(err => console.error(err));
    };
    
    const fetchPlats = () => {
        fetch('http://localhost:8000/api/plats')
            .then(res => res.json())
            .then(data => setPlats(data))
            .catch(err => console.error(err));
    };
    
    const handleCreate = () => {
        setEditingEltCommande(null);
        setShowForm(true);
    };
    
    const handleEdit = (eltCommande) => {
        setEditingEltCommande(eltCommande);
        setShowForm(true);
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément de commande ?')) {
            fetch(`http://localhost:8000/api/elt-commandes/${id}`, {
                method: 'DELETE',
            })
            .then(() => {
                fetchEltCommandes();
            })
            .catch(err => console.error(err));
        }
    };
    
    const handleSubmit = (formData) => {
        const url = editingEltCommande 
            ? `http://localhost:8000/api/elt-commandes/${editingEltCommande.id}`
            : 'http://localhost:8000/api/elt-commandes';
            
        const method = editingEltCommande ? 'PUT' : 'POST';
        
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(() => {
            fetchEltCommandes();
            setShowForm(false);
        })
        .catch(err => console.error(err));
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-orange-500">Éléments de Commandes</h1>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                        Ajouter un élément
                    </button>
                </div>
                
                {showForm && (
                    <div className="mb-8">
                        <EltCommandeForm 
                            eltCommande={editingEltCommande}
                            commandes={commandes}
                            plats={plats}
                            onSubmit={handleSubmit}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eltCommandes.map(eltCommande => (
                        <EltCommandeCard 
                            key={eltCommande.id} 
                            eltCommande={eltCommande} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
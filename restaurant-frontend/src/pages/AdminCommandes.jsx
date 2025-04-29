import { useEffect, useState } from 'react';
import CommandeCard from '../components/CommandeCard';
import CommandeForm from '../components/CommandeForm';
import Navbar from '../components/Navbar';

export default function AdminCommandes() {
    const [commandes, setCommandes] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [tables, setTables] = useState([]);
    const [plats, setPlats] = useState([]);
    const [editingCommande, setEditingCommande] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    useEffect(() => {
        fetchCommandes();
        fetchRestaurants();
        fetchTables();
        fetchPlats();
    }, []);
    
    const fetchCommandes = () => {
        fetch('http://localhost:8000/api/commandes')
            .then(res => res.json())
            .then(data => setCommandes(data))
            .catch(err => console.error(err));
    };
    
    const fetchRestaurants = () => {
        fetch('http://localhost:8000/api/restaurants')
            .then(res => res.json())
            .then(data => setRestaurants(data))
            .catch(err => console.error(err));
    };
    
    const fetchTables = () => {
        fetch('http://localhost:8000/api/tables')
            .then(res => res.json())
            .then(data => setTables(data))
            .catch(err => console.error(err));
    };
    
    const fetchPlats = () => {
        fetch('http://localhost:8000/api/plats')
            .then(res => res.json())
            .then(data => setPlats(data))
            .catch(err => console.error(err));
    };
    
    const handleCreate = () => {
        setEditingCommande(null);
        setShowForm(true);
    };
    
    const handleEdit = (commande) => {
        setEditingCommande(commande);
        setShowForm(true);
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            fetch(`http://localhost:8000/api/commandes/${id}`, {
                method: 'DELETE',
            })
            .then(() => {
                fetchCommandes();
            })
            .catch(err => console.error(err));
        }
    };
    
    const handleSubmit = (formData) => {
        const url = editingCommande 
            ? `http://localhost:8000/api/commandes/${editingCommande.id}`
            : 'http://localhost:8000/api/commandes';
            
        const method = editingCommande ? 'PUT' : 'POST';
        
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(res => res.json())
        .then(() => {
            fetchCommandes();
            setShowForm(false);
        })
        .catch(err => console.error(err));
    };
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-orange-500">Gestion des Commandes</h1>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                        Créer une commande
                    </button>
                </div>
                
                {showForm && (
                    <div className="mb-8">
                        <CommandeForm 
                            commande={editingCommande}
                            restaurants={restaurants}
                            tables={tables}
                            plats={plats}
                            onSubmit={handleSubmit}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}
                
                <div className="space-y-4">
                    {commandes.map(commande => (
                        <CommandeCard 
                            key={commande.id} 
                            commande={commande} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
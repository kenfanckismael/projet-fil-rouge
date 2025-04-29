import { useEffect, useState } from 'react';
import TableCard from '../components/TableCard';
import TableForm from '../components/TableForm';
import Navbar from '../components/Navbar';

export default function AdminTables() {
    const [tables, setTables] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [editingTable, setEditingTable] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    useEffect(() => {
        fetchTables();
        fetchRestaurants();
    }, []);
    
    const fetchTables = () => {
        fetch('http://localhost:8000/api/tables')
            .then(res => res.json())
            .then(data => setTables(data))
            .catch(err => console.error(err));
    };
    
    const fetchRestaurants = () => {
        fetch('http://localhost:8000/api/restaurants')
            .then(res => res.json())
            .then(data => setRestaurants(data))
            .catch(err => console.error(err));
    };
    
    const handleCreate = () => {
        setEditingTable(null);
        setShowForm(true);
    };
    
    const handleEdit = (table) => {
        setEditingTable(table);
        setShowForm(true);
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette table ?')) {
            fetch(`http://localhost:8000/api/tables/${id}`, {
                method: 'DELETE',
            })
            .then(() => {
                fetchTables();
            })
            .catch(err => console.error(err));
        }
    };
    
    const handleSubmit = (formData) => {
        const url = editingTable 
            ? `http://localhost:8000/api/tables/${editingTable.id}`
            : 'http://localhost:8000/api/tables';
            
        const method = editingTable ? 'PUT' : 'POST';
        
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(async res => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }
            return res.json();
        })
        .then(() => {
            fetchTables();
            setShowForm(false);
        })
        .catch(err => console.error('Erreur serveur :', err.message));
    };
    
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-orange-500">Gestion des Tables</h1>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    >
                        Ajouter une table
                    </button>
                </div>
                
                {showForm && (
                    <div className="mb-8">
                        <TableForm 
                            table={editingTable}
                            restaurants={restaurants}
                            onSubmit={handleSubmit}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tables.map(table => (
                        <TableCard 
                            key={table.id} 
                            table={table} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
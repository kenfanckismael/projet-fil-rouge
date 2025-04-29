import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ClientTablePage() {
    const { table } = useParams();
    const [tableData, setTableData] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    
    useEffect(() => {
        if (table) {
            // Trouver la table par son code
            fetch(`http://localhost:8000/api/tables?code=${table}`)
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        setTableData(data[0]);
                        // Charger les infos du restaurant
                        fetch(`http://localhost:8000/api/restaurants/${data[0].restaurant_id}`)
                            .then(res => res.json())
                            .then(setRestaurant)
                            .catch(console.error);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [table]);
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-8">
                {tableData ? (
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-orange-500 mb-2">
                                    Bienvenue à la table {tableData.name}
                                </h1>
                                {restaurant && (
                                    <h2 className="text-xl text-gray-700">
                                        {restaurant.name}
                                    </h2>
                                )}
                            </div>
                            
                            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-orange-600 mb-2">
                                    Informations de la table
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Code:</p>
                                        <p className="font-medium">{tableData.code}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Places:</p>
                                        <p className="font-medium">{tableData.nb_place}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center mt-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                    Menu du restaurant
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Scanner le QR code sur la table pour accéder à cette page
                                </p>
                                
                                <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg">
                                    <img 
                                        src={tableData.qr_code_path ? `/storage/${tableData.qr_code_path}` : 'https://via.placeholder.com/200'} 
                                        alt="QR Code"
                                        className="w-48 h-48 mx-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold text-gray-700">
                            Table non trouvée
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Le code de table "{table}" n'existe pas ou n'est pas active.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
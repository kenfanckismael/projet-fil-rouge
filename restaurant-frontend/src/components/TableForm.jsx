import React, { useState, useEffect } from 'react';

const TableForm = ({ table, restaurants, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(table || {
    name: '',
    code: '',
    nb_place: 4,
    active: true,
    restaurant_id: restaurants[0]?.id || ''
  });

  useEffect(() => {
    if (table) {
      setFormData(table);
    }
  }, [table]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation ici si nécessaire
    onSubmit(formData);
  };

  return (
    <div className="w-full bg-white p-8 rounded-[20px] shadow-md">
      <h2 className="font-nunito font-bold text-[24px] mb-6 text-center">
        {table ? 'Modifier la table' : 'Ajouter une nouvelle table'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-6">
          <div className="w-[48%]">
            <label className="block font-nunito font-medium text-[16px] mb-2" htmlFor="name">
              Nom de la table
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Table 1"
              className="w-full h-[48px] bg-white border border-black rounded-[10px] px-4 font-nunito"
              required
            />
          </div>

          <div className="w-[48%]">
            <label className="block font-nunito font-medium text-[16px] mb-2" htmlFor="code">
              Code unique
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Ex: T-001"
              className="w-full h-[48px] bg-white border border-black rounded-[10px] px-4 font-nunito"
              required
            />
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div className="w-[48%]">
            <label className="block font-nunito font-medium text-[16px] mb-2" htmlFor="nb_place">
              Nombre de places
            </label>
            <input
              type="number"
              id="nb_place"
              name="nb_place"
              min="1"
              value={formData.nb_place}
              onChange={handleChange}
              className="w-full h-[48px] bg-white border border-black rounded-[10px] px-4 font-nunito"
              required
            />
          </div>

          <div className="w-[48%]">
            <label className="block font-nunito font-medium text-[16px] mb-2" htmlFor="restaurant_id">
              Restaurant
            </label>
            <select
              id="restaurant_id"
              name="restaurant_id"
              value={formData.restaurant_id}
              onChange={handleChange}
              className="w-full h-[48px] bg-white border border-black rounded-[10px] px-4 font-nunito"
              required
            >
              {restaurants.map(restaurant => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8 flex items-center">
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-5 h-5 rounded text-[#F96540]"
          />
          <label htmlFor="active" className="ml-2 font-nunito font-medium text-[16px]">
            Table active
          </label>
        </div>

        <div className="flex justify-center space-x-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-[200px] h-[46px] bg-gray-300 text-gray-800 rounded-[20px] font-nunito font-bold hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          )}
          
          <button
            type="submit"
            className="w-[557px] h-[46px] bg-[#F96540] rounded-[20px] font-nunito font-bold text-[20px] text-white hover:bg-[#E05530] transition-colors"
          >
            {table ? 'Mettre à jour la table' : 'Ajouter une table et générer QR code'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TableForm;

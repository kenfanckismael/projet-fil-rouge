import { useState } from 'react';

export default function RestaurantForm({ restaurant, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(restaurant || {
    name: '',
    description: '',
    logo: null,
    image: null,
    address: '',
    phoneNumber: '',
    email: ''
  });

  const [logoPreview, setLogoPreview] = useState(restaurant?.logo || null);
  const [imagePreview, setImagePreview] = useState(restaurant?.image || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      setFormData(prev => ({ ...prev, [name]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'logo') setLogoPreview(reader.result);
        else setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="name">Nom</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="logo">Logo</label>
        <input
          type="file"
          id="logo"
          name="logo"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded-md"
          accept="image/*"
        />
        {logoPreview && (
          <img src={logoPreview} alt="Logo preview" className="mt-2 h-20 w-20 object-cover rounded-full" />
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded-md"
          accept="image/*"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Image preview" className="mt-2 h-32 w-full object-cover rounded-md" />
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="address">Adresse</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="phoneNumber">Téléphone</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
}
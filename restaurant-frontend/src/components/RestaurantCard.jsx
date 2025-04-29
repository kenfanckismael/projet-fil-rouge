export default function RestaurantCard({ restaurant }) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
        {/* Image avec effet de zoom au hover */}
        <div className="overflow-hidden">
          <img 
            src={restaurant.image ? `/storage/${restaurant.image}` : 'https://via.placeholder.com/400x300'} 
            alt={restaurant.name}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        <div className="p-5">
          {/* En-tête avec effet de hover sur le nom */}
          <div className="flex items-center mb-3 gap-3">
            <div className="min-w-[40px]">
              <img 
                src={restaurant.logo ? `/storage/${restaurant.logo}` : 'https://via.placeholder.com/50'} 
                alt="Logo" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-primary-600">
              {restaurant.name}
            </h3>
          </div>
          
          {/* Description avec limite de lignes */}
          <p className="text-gray-600 mb-4 line-clamp-2">
            {restaurant.description}
          </p>
          
          {/* Informations avec icônes stylisées */}
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <span className="text-sm">{restaurant.address}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <span className="text-sm">{restaurant.phoneNumber}</span>
            </div>
          </div>
        </div>
      </div>
    );
}
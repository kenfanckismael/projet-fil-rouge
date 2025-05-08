export default function OrderActions({ 
  orderStatus, 
  paymentStatus, 
  onStatusChange, 
  onPaymentStatusChange 
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 gap-3 w-full">
      {/* Statut Filter */}
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
        <span className="text-sm font-medium text-gray-700 self-center">Statut:</span>
        <button
          className={`px-3 py-1 rounded-md text-sm transition ${
            orderStatus === 'en_attente' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
          onClick={() => onStatusChange('en_attente')}
        >
          En attente
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm transition ${
            orderStatus === 'en_cours' 
              ? 'bg-blue-500 text-white' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
          onClick={() => onStatusChange('en_cours')}
        >
          En préparation
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm transition ${
            orderStatus === 'terminee' 
              ? 'bg-green-500 text-white' 
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
          onClick={() => onStatusChange('terminee')}
        >
          Servi
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm transition ${
            orderStatus === 'annulee' 
              ? 'bg-red-500 text-white' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
          onClick={() => onStatusChange('annulee')}
        >
          Annuler
        </button>
      </div>

      {/* Paiement Filter */}
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
        <span className="text-sm font-medium text-gray-700 self-center">Paiement:</span>
        <button
          className={`px-3 py-1 rounded-md text-sm transition ${
            paymentStatus === 'non_payé' 
              ? 'bg-red-500 text-white' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
          onClick={() => onPaymentStatusChange('non_payé')}
        >
          Non payé
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm transition ${
            paymentStatus === 'payé' 
              ? 'bg-green-500 text-white' 
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
          onClick={() => onPaymentStatusChange('payé')}
        >
          Payé
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm transition ${
            paymentStatus === 'remboursé' 
              ? 'bg-purple-500 text-white' 
              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          }`}
          onClick={() => onPaymentStatusChange('remboursé')}
        >
          Remboursé
        </button>
      </div>
    </div>
  );
}

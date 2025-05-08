export default function FilterPanel({
  tables,
  filters,
  onFilterChange,
  onResetFilters
}) {
  return (
    <div className="bg-white shadow-md p-4 mb-4 max-w-7xl mx-auto mt-4 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Table Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Table</label>
          <select
            name="tableId"
            value={filters.tableId}
            onChange={onFilterChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les tables</option>
            {tables.map(table => (
              <option key={table.id} value={table.id.toString()}>
                {table.name || `Table ${table.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            name="status"
            value={filters.status}
            onChange={onFilterChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_préparation">En préparation</option>
            <option value="servi">Servi</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paiement</label>
          <select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={onFilterChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les paiements</option>
            <option value="payé">Payé</option>
            <option value="non_payé">Non payé</option>
            <option value="remboursé">Remboursé</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end col-span-1 sm:col-span-2 lg:col-span-1">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto"
            onClick={onResetFilters}
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
}

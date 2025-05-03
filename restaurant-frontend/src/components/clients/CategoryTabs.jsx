export default function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="bg-white sticky top-0 shadow-sm z-10">
      <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
        <div className="flex space-x-2 py-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={`px-5 py-2 rounded-full font-medium transition transform duration-200 ${
                active === c
                  ? 'bg-green-600 text-white scale-105 shadow-md'
                  : 'bg-green-200 text-green-800 hover:bg-green-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

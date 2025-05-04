import React from "react";
import { Pencil, Trash } from "lucide-react";

export default function PlatCard({ plat, onEdit, onDelete }) {
  return (
    <div className="relative w-[180px] h-[380px] transform transition-transform hover:scale-105">
      {/* Bouton Modifier */}
      {onEdit && (
        <button
          onClick={() => onEdit(plat)}
          className="absolute w-9 h-9 left-0 top-0 bg-white rounded-full flex items-center justify-center shadow hover:bg-blue-100"
        >
          <Pencil className="w-4 h-4 text-blue-600" />
        </button>
      )}

      {/* Bouton Supprimer */}
      {onDelete && (
        <button
          onClick={() => onDelete(plat.id)}
          className="absolute w-9 h-9 right-0 top-0 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-100"
        >
          <Trash className="w-4 h-4 text-red-600" />
        </button>
      )}

      {/* Carte du plat */}
      <div className="absolute w-[180px] h-[280px] top-10 bg-white rounded-lg shadow-md">
        {/* Image */}
        {plat.image && (
          <div
            className="absolute w-[120px] h-[120px] left-[30px] top-[-50px] border-2 border-white rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url('/storage/${plat.image}')` }}
          />
        )}

        {/* Nom du plat */}
        <h3 className="absolute w-full text-center top-[80px] font-bold text-[15px] text-[#171A1F]">
          {plat.name}
        </h3>

        {/* Description */}
        <p className="absolute top-[110px] left-[10px] right-[10px] text-xs text-[#565E6C] leading-snug text-center">
          {plat.description || "Aucune description."}
        </p>

        {/* Prix */}
        <p className="absolute left-[10px] bottom-[70px] font-bold text-sm text-[#171A1F]">
          {Number(plat.prix).toFixed(2)} €
        </p>

        {/* Tags */}
        <div className="absolute bottom-[40px] left-[10px] flex gap-1 flex-wrap">
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              plat.disponible
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {plat.disponible ? "Disponible" : "Non dispo"}
          </span>
          {plat.en_vedette && (
            <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
              Vedette
            </span>
          )}
        </div>

        {/* Catégorie & Restaurant */}
        <div className="absolute bottom-[10px] left-[10px] right-[10px] text-[11px] text-[#565E6C]">
          <p>
            <span className="font-medium text-[#171A1F]">Cat :</span>{" "}
            {plat.categorie?.name || "Non spéc."}
          </p>
          <p>
            <span className="font-medium text-[#171A1F]">Rest. :</span>{" "}
            {plat.restaurant?.name || "Non spéc."}
          </p>
        </div>
      </div>
    </div>
  );
}

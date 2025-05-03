import React from "react";
import { Pencil, Trash } from "lucide-react";

export default function PlatCard({ plat, onEdit, onDelete }) {
  return (
    <div className="relative w-[230px] h-[500px] transform transition-transform hover:scale-105">
      {/* Bouton Modifier */}
      {onEdit && (
        <button
          onClick={() => onEdit(plat)}
          className="absolute w-[45px] h-[45px] left-0 top-0 bg-white rounded-full flex items-center justify-center shadow hover:bg-blue-100"
        >
          <Pencil className="w-5 h-5 text-blue-600" />
        </button>
      )}

      {/* Bouton Supprimer */}
      {onDelete && (
        <button
          onClick={() => onDelete(plat.id)}
          className="absolute w-[45px] h-[45px] right-0 top-0 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-100"
        >
          <Trash className="w-5 h-5 text-red-600" />
        </button>
      )}

      {/* Carte du plat */}
      <div className="absolute w-[230px] h-[340px] left-0 top-[60px] bg-white rounded-lg shadow-md">
        {/* Image */}
        {plat.image && (
          <div
            className="absolute w-[170px] h-[170px] left-[30px] top-[-60px] border-2 border-white rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url('/storage/${plat.image}')` }}
          />
        )}

        {/* Nom du plat */}
        <h3 className="absolute w-full text-center top-[120px] font-nunito font-bold text-[17px] text-[#171A1F]">
          {plat.name}
        </h3>

        {/* Description */}
        <p className="absolute top-[160px] left-[12px] right-[12px] text-sm font-light text-[#565E6C] leading-tight text-center">
          {plat.description || "Aucune description."}
        </p>

        {/* Prix */}
        <p className="absolute left-[12px] bottom-[95px] font-bold text-sm text-[#171A1F]">
          {Number(plat.prix).toFixed(2)} €
        </p>

        {/* Tags */}
        <div className="absolute bottom-[55px] left-[12px] flex gap-1 flex-wrap">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              plat.disponible
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {plat.disponible ? "Disponible" : "Non disponible"}
          </span>
          {plat.en_vedette && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              En vedette
            </span>
          )}
        </div>

            {/* Catégorie & Restaurant */}
            <div className="absolute bottom-[12px] left-[12px] right-[12px] text-sm text-[#565E6C] font-light leading-tight">
            <p>
                <span className="font-medium text-[#171A1F]">Catégorie :</span>{" "}
                {plat.categorie?.name || "Non spécifiée"}
            </p>
            <p>
                <span className="font-medium text-[#171A1F]">Restaurant :</span>{" "}
                {plat.restaurant?.name || "Non spécifié"}
            </p>
            </div>
      </div>
    </div>
  );
}

<?php

// app/Http/Controllers/CommandeController.php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Plat;
use App\Models\Restaurant;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    public function index()
    {
        return Commande::with(['restaurant', 'table', 'plats'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'table_id' => 'required|exists:tables,id',
            'total_prix' => 'required|numeric|min:0',
            'status' => 'sometimes|in:en_attente,en_cours,terminee,annulee',
            'payment_method' => 'nullable|in:espece,carte,online',
            'payment_status' => 'sometimes|in:paye,non_paye,partiel',
            'service_type' => 'required|in:sur_place,a_emporter,livraison',
            'plats' => 'required|array',
            'plats.*.id' => 'required|exists:plats,id',
            'plats.*.quantite' => 'required|integer|min:1',
            'plats.*.prix_unitaire' => 'required|numeric|min:0',
            'plats.*.commentaire' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $commande = Commande::create($validated);

            // Attacher les plats à la commande
            foreach ($validated['plats'] as $plat) {
                $commande->plats()->attach($plat['id'], [
                    'quantite' => $plat['quantite'],
                    'prix_unitaire' => $plat['prix_unitaire'],
                    'commentaire' => $plat['commentaire'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json($commande->load(['restaurant', 'table', 'plats']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création de la commande'], 500);
        }
    }

    public function show(Commande $commande)
    {
        return $commande->load(['restaurant', 'table', 'plats']);
    }

    public function update(Request $request, Commande $commande)
    {
        $validated = $request->validate([
            'restaurant_id' => 'sometimes|exists:restaurants,id',
            'table_id' => 'sometimes|exists:tables,id',
            'total_prix' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:en_attente,en_cours,terminee,annulee',
            'payment_method' => 'nullable|in:espece,carte,online',
            'payment_status' => 'sometimes|in:paye,non_paye,partiel',
            'service_type' => 'sometimes|in:sur_place,a_emporter,livraison',
            'plats' => 'sometimes|array',
            'plats.*.id' => 'required_with:plats|exists:plats,id',
            'plats.*.quantite' => 'required_with:plats|integer|min:1',
            'plats.*.prix_unitaire' => 'required_with:plats|numeric|min:0',
            'plats.*.commentaire' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $commande->update($validated);

            if (isset($validated['plats'])) {
                // Synchroniser les plats de la commande
                $platsData = [];
                foreach ($validated['plats'] as $plat) {
                    $platsData[$plat['id']] = [
                        'quantite' => $plat['quantite'],
                        'prix_unitaire' => $plat['prix_unitaire'],
                        'commentaire' => $plat['commentaire'] ?? null,
                    ];
                }
                $commande->plats()->sync($platsData);
            }

            DB::commit();

            return response()->json($commande->load(['restaurant', 'table', 'plats']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la mise à jour de la commande'], 500);
        }
    }

    public function destroy(Commande $commande)
    {
        $commande->plats()->detach();
        $commande->delete();

        return response()->json(null, 204);
    }
}
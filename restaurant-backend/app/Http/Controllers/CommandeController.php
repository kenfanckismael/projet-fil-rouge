<?php

// app/Http/Controllers/CommandeController.php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    public function index()
    {
        return Commande::with(['restaurant', 'table'])->get();
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
        ]);

        try {
            DB::beginTransaction();

            $commande = Commande::create($validated);

            DB::commit();

            return response()->json($commande->load(['restaurant', 'table']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création de la commande'], 500);
        }
    }

    public function show(Commande $commande)
    {
        return $commande->load(['restaurant', 'table']);
    }

    public function update(Request $request, Commande $commande)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'table_id' => 'required|exists:tables,id',
            'total_prix' => 'required|numeric|min:0',
            'status' => 'sometimes|in:en_attente,en_cours,terminee,annulee',
            'payment_method' => 'nullable|in:espece,carte,online',
            'payment_status' => 'sometimes|in:paye,non_paye,partiel',
            'service_type' => 'required|in:sur_place,a_emporter,livraison',
        ]);

        try {
            DB::beginTransaction();

            $commande->update($validated);

            DB::commit();

            return response()->json($commande->load(['restaurant', 'table']));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la mise à jour de la commande'], 500);
        }
    }

    public function destroy(Commande $commande)
    {
        $commande->delete();

        return response()->json(null, 204);
    }
}

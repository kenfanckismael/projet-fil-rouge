<?php

// app/Http/Controllers/EltCommandeController.php

namespace App\Http\Controllers;

use App\Models\EltCommande;
use App\Models\Commande;
use App\Models\Plat;
use Illuminate\Http\Request;

class EltCommandeController extends Controller
{
    public function index()
    {
        return EltCommande::with(['commande', 'plat'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'commande_id' => 'required|exists:commandes,id',
            'plat_id' => 'required|exists:plats,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
        ]);

        $eltCommande = EltCommande::create($validated);
        $eltCommande->commande->recalculerTotalPrix();


        return response()->json($eltCommande->load(['commande', 'plat']), 201);
    }

    public function show(EltCommande $eltCommande)
    {
        return $eltCommande->load(['commande', 'plat']);
    }

    public function update(Request $request, EltCommande $eltCommande)
    {
        $validated = $request->validate([
            'plat_id' => 'sometimes|exists:plats,id',
            'quantity' => 'sometimes|integer|min:1',
            'notes' => 'nullable|string',
            'prix' => 'sometimes|numeric|min:0',
        ]);

        $eltCommande->update($validated);
        $eltCommande->commande->recalculerTotalPrix();


        return response()->json($eltCommande->load(['commande', 'plat']));
    }

    public function getByCommande(Commande $commande)
{
    return response()->json([
        'commande' => $commande,
        'elements' => $commande->elt_commandes()->with('plat')->get()
    ]);
}

    public function destroy(EltCommande $eltCommande)
    {
        $eltCommande->delete();
        $commande = $eltCommande->commande;
        $eltCommande->delete();
        $commande->recalculerTotalPrix();


        return response()->json(null, 204);
    }

    public function storeMultiple(Request $request)
{
    $validated = $request->validate([
        'commande_id' => 'nullable|exists:commandes,id',
        'elts' => 'required|array|min:1',
        'elts.*.plat_id' => 'required|exists:plats,id',
        'elts.*.quantity' => 'required|integer|min:1',
        'elts.*.prix' => 'required|numeric|min:0',
        'elts.*.notes' => 'nullable|string',
    ]);

    // Créer une commande si aucune n'est fournie
    $commande = isset($validated['commande_id'])
        ? Commande::findOrFail($validated['commande_id'])
        : Commande::create([
            'restaurant_id' => 1, // idéalement à passer aussi depuis le frontend
            'table_id' =>  $request->table_id,
            'status' => 'en_attente',
            'payment_method' => $request->payment_method ?? '',
            'payment_status' => $request->payment_status ?? 'non_paye',
            'service_type' => $request->service_type ?? 'sur_place',
            'total_prix' => 0,
        ]);
        

    $elts = [];

    foreach ($validated['elts'] as $eltData) {
        $elt = EltCommande::create([
            'commande_id' => $commande->id,
            'plat_id' => $eltData['plat_id'],
            'quantity' => $eltData['quantity'],
            'prix' => $eltData['prix'],
            'notes' => $eltData['notes'] ?? null,
        ]);
        $elts[] = $elt;
    }

    // Recalculer le prix total de la commande
    $commande->recalculerTotalPrix();

    return response()->json([
        'commande' => $commande->fresh(),
        'elts' => EltCommande::where('commande_id', $commande->id)->with('plat')->get()
    ], 201);
}

}
<?php

namespace App\Http\Controllers;

use App\Models\Plat;
use App\Models\Category;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PlatController extends Controller
{
    public function index(Request $request)
    {
        $query = Plat::with(['categorie', 'restaurant']);

        if ($request->has('categorie_id')) {
            $query->where('categorie_id', $request->input('categorie_id'));
        }

        if ($request->has('restaurant_id')) {
            $query->where('restaurant_id', $request->input('restaurant_id'));
        }

        if ($request->has('disponible')) {
            $query->where('disponible', filter_var($request->input('disponible'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->has('en_vedette')) {
            $query->where('en_vedette', filter_var($request->input('en_vedette'), FILTER_VALIDATE_BOOLEAN));
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'prix' => 'required|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'disponible' => 'boolean',
                'en_vedette' => 'boolean',
                'categorie_id' => 'required|exists:categories,id',
                'restaurant_id' => 'required|exists:restaurants,id',
            ]);

            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('plats', 'public');
            }

            $plat = Plat::create($validated);

            return response()->json($plat->load(['categorie', 'restaurant']), 201);
        } catch (\Exception $e) {
            Log::error('Erreur création plat : ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la création du plat',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Plat $plat)
    {
        return $plat->load(['categorie', 'restaurant']);
    }

    public function update(Request $request, Plat $plat)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'prix' => 'sometimes|numeric|min:0',
                'image' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
                'disponible' => 'sometimes|boolean',
                'en_vedette' => 'sometimes|boolean',
                'categorie_id' => 'sometimes|exists:categories,id',
                'restaurant_id' => 'sometimes|exists:restaurants,id',
            ]);

            // Gestion de l'image
            if ($request->hasFile('image')) {
                // Supprimer l'ancienne image si elle existe
                if ($plat->image) {
                    Storage::disk('public')->delete($plat->image);
                }
                $validated['image'] = $request->file('image')->store('plats', 'public');
            } else {
                // Conserver l'image existante si aucune nouvelle image n'est envoyée
                unset($validated['image']);
            }

            // Conversion des booléens
            if ($request->has('disponible')) {
                $validated['disponible'] = filter_var($validated['disponible'], FILTER_VALIDATE_BOOLEAN);
            }

            if ($request->has('en_vedette')) {
                $validated['en_vedette'] = filter_var($validated['en_vedette'], FILTER_VALIDATE_BOOLEAN);
            }

            $plat->update($validated);

            return response()->json($plat->fresh()->load(['categorie', 'restaurant']));
        } catch (\Exception $e) {
            Log::error('Erreur modification plat : ' . $e->getMessage(), [
                'plat_id' => $plat->id,
                'input' => $request->all()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la modification du plat',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Plat $plat)
    {
        try {
            if ($plat->image) {
                Storage::disk('public')->delete($plat->image);
            }
            
            $plat->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Erreur suppression plat : ' . $e->getMessage(), [
                'plat_id' => $plat->id
            ]);

            return response()->json([
                'message' => 'Erreur lors de la suppression du plat',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
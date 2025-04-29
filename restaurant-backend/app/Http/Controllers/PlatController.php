<?php

// app/Http/Controllers/PlatController.php

namespace App\Http\Controllers;

use App\Models\Plat;
use App\Models\Category;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PlatController extends Controller
{
    public function index()
    {
        return Plat::with(['categorie', 'restaurant'])->get();
    }

    public function store(Request $request)
    {
        
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

        Log::info('Image stockée', ['path' => $request['image']]);
        $plat = Plat::create($validated);

        return response()->json($plat->load(['categorie', 'restaurant']), 201);
    }

    public function show(Plat $plat)
    {
        return $plat->load(['categorie', 'restaurant']);
    }

    public function update(Request $request, Plat $plat)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'prix' => 'sometimes|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'disponible' => 'sometimes|boolean',
            'en_vedette' => 'sometimes|boolean',
            'categorie_id' => 'sometimes|exists:categories,id',
            'restaurant_id' => 'sometimes|exists:restaurants,id',
        ]);

        if ($request->hasFile('image')) {
            if ($plat->image) {
                Storage::disk('public')->delete($plat->image);
            }
            $validated['image'] = $request->file('image')->store('plats', 'public');
        }

        $plat->update($validated);

        return response()->json($plat->load(['categorie', 'restaurant']));
    }

    public function destroy(Plat $plat)
    {
        if ($plat->image) {
            Storage::disk('public')->delete($plat->image);
        }
        
        $plat->delete();

        return response()->json(null, 204);
    }
}
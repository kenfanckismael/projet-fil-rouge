<?php

// app/Http/Controllers/TableController.php

namespace App\Http\Controllers;

use App\Models\Table;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TableController extends Controller
{
    public function index()
    {
        return Table::with('restaurant')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:tables',
            'nb_place' => 'required|integer|min:1',
            'active' => 'boolean',
            'restaurant_id' => 'required|exists:restaurants,id',
        ]);

        $table = Table::create($validated);
        
        // Générer le QR code
        $baseUrl = config('app.client_url');
        $table->generateQrCode($baseUrl);

        return response()->json($table->load('restaurant'), 201);
    }

    public function show(Table $table)
    {
        return $table->load('restaurant');
    }

    public function update(Request $request, Table $table)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|unique:tables,code,'.$table->id,
            'nb_place' => 'sometimes|integer|min:1',
            'active' => 'sometimes|boolean',
            'restaurant_id' => 'sometimes|exists:restaurants,id',
        ]);

        $table->update($validated);

        if ($request->has('code')) {
            // Regénérer le QR code si le code change
            $baseUrl = config('app.client_url');
            $table->generateQrCode($baseUrl);
        }

        return response()->json($table->load('restaurant'));
    }

    public function destroy(Table $table)
    {
        if ($table->qr_code_path) {
            Storage::disk('public')->delete($table->qr_code_path);
        }
        
        $table->delete();

        return response()->json(null, 204);
    }
}
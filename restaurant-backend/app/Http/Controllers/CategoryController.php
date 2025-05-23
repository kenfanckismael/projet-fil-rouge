<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Category::with('restaurant')->orderBy('ordre')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ordre' => 'required|integer|min:1',
            'restaurant_id' => 'required|exists:restaurants,id',
        ]);

        $category = Category::create($validated);

        return response()->json($category->load('restaurant'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return $category->load('restaurant');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'ordre' => 'sometimes|integer|min:1',
            'restaurant_id' => 'sometimes|exists:restaurants,id',
        ]);

        $category->update($validated);

        return response()->json($category->load('restaurant'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(null, 204);
    }
}

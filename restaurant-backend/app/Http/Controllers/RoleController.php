<?php

// app/Http/Controllers/RoleController.php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return Role::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles'
        ]);

        $role = Role::create($validated);

        return response()->json($role, 201);
    }

    public function show(Role $role)
    {
        return $role;
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,'.$role->id
        ]);

        $role->update($validated);

        return response()->json($role);
    }

    public function destroy(Role $role)
    {
        // Vérifier si le rôle est utilisé avant de supprimer
        if ($role->users()->count() > 0) {
            return response()->json([
                'message' => 'Ce rôle est attribué à des utilisateurs et ne peut pas être supprimé'
            ], 422);
        }

        $role->delete();

        return response()->json(null, 204);
    }
}
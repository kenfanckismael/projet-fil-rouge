<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PlatController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\EltCommandeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AuthController;

Route::apiResource('roles', RoleController::class);
Route::apiResource('elt-commandes', EltCommandeController::class);
Route::post('elt-commandes/multiple', [EltCommandeController::class, 'storeMultiple']);
Route::get('/commandes/{commande}/elements', [EltCommandeController::class, 'getByCommande']);
Route::apiResource('commandes', CommandeController::class);
Route::post('commandes/{id}/status', [CommandeController::class, 'updateStatus']);
Route::apiResource('plats', PlatController::class);
Route::apiResource('tables', TableController::class);
Route::apiResource('restaurants', RestaurantController::class);
Route::apiResource('categories', CategoryController::class);
Route::get('restaurants/{client}/tables', [TableController::class, 'indexByRestaurant']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');